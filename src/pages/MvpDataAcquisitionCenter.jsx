import { useMemo, useRef, useState } from 'react'
import { Check, Database, FileCheck2, Plus, Upload, X } from 'lucide-react'
import {
  Badge,
  Drawer,
  FormInput,
  FormSelect,
  FormTextarea,
  InfoLine,
  SimpleTable,
  Stat,
  Tab,
  workers,
  projects
} from './mvpShared'

const manualTabs = [
  { key: 'health', label: '体检记录', type: '体检' },
  { key: 'reward', label: '奖励记录', type: '奖励' },
  { key: 'punish', label: '处罚记录', type: '处罚' },
  { key: 'cert', label: '证书记录', type: '证书' },
  { key: 'laborDispute', label: '劳资纠纷', type: '劳资纠纷' }
]

const schemas = {
  health: [
    { key: 'healthResult', label: '体检结果', required: true },
    { key: 'qualified', label: '是否合格', type: 'select', options: ['是', '否'], required: true }
  ],
  reward: [
    { key: 'rewardItem', label: '奖励事项', type: 'select', options: ['安全之星', '质量之星', '公司技能大赛'], required: true },
    { key: 'rewardContent', label: '奖励内容' }
  ],
  punish: [
    { key: 'punishItem', label: '处罚事项', type: 'select', options: ['安全整改', '质量整改'], required: true },
    { key: 'punishContent', label: '处罚内容' }
  ],
  cert: [
    { key: 'certCategory', label: '证书类别', type: 'select', options: ['普通证书', '特殊工种证书'], required: true },
    { key: 'certName', label: '证书名称', required: true }
  ],
  laborDispute: [
    { key: 'disputeItem', label: '纠纷事项', required: true }
  ]
}

const initialPending = [
  {
    id: 1,
    worker: '张建国',
    idCard: '3701021980******56',
    project: '北京CBD东区超高层项目',
    type: '体检',
    file: '张建国体检报告.pdf',
    date: '2026-07-10',
    fields: { healthResult: '体检结论合格，无职业禁忌', qualified: '是' },
    status: '待确认',
    time: '2026-07-10 09:20'
  },
  {
    id: 2,
    worker: '王朝阳',
    idCard: '1301021992******67',
    project: '轨道交通8号线项目',
    type: '处罚',
    file: '安全整改处罚单.png',
    date: '2026-07-10',
    fields: { punishItem: '安全整改', punishContent: '未佩戴安全帽' },
    status: '待确认',
    time: '2026-07-10 10:15'
  }
]

const initialManual = {
  health: [{ id: 1, worker: '张建国', idCard: '3701021980******56', project: '北京CBD东区超高层项目', date: '2026-07-08', healthResult: '合格', qualified: '是', source: 'AI识别', attachment: '体检报告.pdf', remark: '无职业禁忌' }],
  reward: [{ id: 2, worker: '李强', idCard: '4201061988******90', project: '北京CBD东区超高层项目', date: '2026-07-08', rewardItem: '安全之星', rewardContent: '月度安全表彰', source: '人工录入', attachment: '表彰名单.jpg', remark: '' }],
  punish: [{ id: 3, worker: '王朝阳', idCard: '1301021992******67', project: '轨道交通8号线项目', date: '2026-07-05', punishItem: '安全整改', punishContent: '未佩戴安全帽', source: 'AI识别', attachment: '处罚单.png', remark: '' }],
  cert: [{ id: 5, worker: '张建国', idCard: '3701021980******56', project: '北京CBD东区超高层项目', date: '2026-06-20', certCategory: '特殊工种证书', certName: '钢筋工技能证书', source: 'AI识别', attachment: '证书扫描件.pdf', remark: '证书有效' }]
  ,laborDispute: []
}

const emptyManualForm = {
  worker: '张建国',
  idCard: '3701021980******56',
  project: '北京CBD东区超高层项目',
  date: '2026-07-10',
  healthResult: '',
  qualified: '是',
  rewardItem: '安全之星',
  rewardContent: '',
  punishItem: '安全整改',
  punishContent: '',
  certCategory: '普通证书',
  certName: '',
  disputeItem: '',
  attachment: '',
  remark: ''
}

export default function MvpDataAcquisitionCenter({ triggerNotification }) {
  const [tab, setTab] = useState('realname')
  const [realnameTab, setRealnameTab] = useState('worker')
  const [queries, setQueries] = useState({})
  const [pending, setPending] = useState(initialPending)
  const [manualTab, setManualTab] = useState('health')
  const [manualData, setManualData] = useState(initialManual)
  const [manualQueries, setManualQueries] = useState({})
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [aiResult, setAiResult] = useState(null)
  const [pendingRecord, setPendingRecord] = useState(null)
  const [manualDrawerOpen, setManualDrawerOpen] = useState(false)
  const [manualForm, setManualForm] = useState(emptyManualForm)
  const [editingManualId, setEditingManualId] = useState(null)
  const fileInputRef = useRef(null)

  const currentManualMeta = manualTabs.find((item) => item.key === manualTab)
  const workerQuery = queries[realnameTab] || {}
  const realnameData = useMemo(() => getRealnameData(realnameTab), [realnameTab])
  const manualTable = getManualTableConfig(manualTab)
  const manualQuery = manualQueries[manualTab] || {}

  const updateQuery = (key, value) => {
    setQueries((prev) => ({ ...prev, [realnameTab]: { ...prev[realnameTab], [key]: value } }))
  }

  const filteredWorkers = workers.filter((item) => matchesQueries(item, workerQuery, ['name', 'idCard', 'job', 'team', 'company', 'project', 'status']))
  const filteredRealnameRows = realnameData.rows.filter((row) => row.some((value, index) => matchesQueryValue(value, workerQuery[realnameData.queryKeys[index]])))
  const filteredManualRows = manualData[manualTab].filter((item) => matchesManualQuery(item, manualQuery))

  const updateManualQuery = (key, value) => {
    setManualQueries((prev) => ({ ...prev, [manualTab]: { ...prev[manualTab], [key]: value } }))
  }

  const handleUpload = (file) => {
    if (!file) return
    const type = inferType(file.name)
    const matchedWorker = file.name.includes('王') ? workers[2] : file.name.includes('李') ? workers[1] : workers[0]
    setAiResult({ file: file.name, type, worker: matchedWorker.name, idCard: matchedWorker.idCard, project: matchedWorker.project, date: '2026-07-10', fields: aiFields(type, matchedWorker) })
    triggerNotification('AI识别完成，请核对后保存至待确认数据')
  }

  const saveAiToPending = () => {
    if (!aiResult) return
    setPending((prev) => [{ id: Date.now(), ...aiResult, status: '待确认', time: '2026-07-10 14:30' }, ...prev])
    setAiResult(null)
    triggerNotification('已生成待确认数据')
  }

  const approvePending = (record) => {
    const targetTab = manualTabs.find((item) => item.type === record.type)?.key || 'health'
    setManualData((prev) => ({
      ...prev,
      [targetTab]: [{ id: Date.now(), worker: record.worker, idCard: record.idCard, project: record.project, date: record.date, ...record.fields, source: 'AI识别', attachment: record.file, remark: '由待确认数据确认入库' }, ...prev[targetTab]]
    }))
    setPending((prev) => prev.filter((item) => item.id !== record.id))
    setPendingRecord(null)
    triggerNotification('确认成功，数据已进入评价台账')
  }

  const rejectPending = (record) => {
    setPending((prev) => prev.map((item) => (item.id === record.id ? { ...item, status: '已驳回' } : item)))
    setPendingRecord(null)
    triggerNotification('已驳回该识别结果', 'warning')
  }

  const openAddManual = () => {
    setEditingManualId(null)
    setManualForm({ ...emptyManualForm, ...defaultFields(manualTab) })
    setManualDrawerOpen(true)
  }

  const openEditManual = (record) => {
    setEditingManualId(record.id)
    setManualForm({ ...emptyManualForm, ...record })
    setManualDrawerOpen(true)
  }

  const updateManualWorker = (name) => {
    const worker = workers.find((item) => item.name === name)
    setManualForm((prev) => ({ ...prev, worker: name, idCard: worker?.idCard || '' }))
  }

  const saveManual = () => {
    const requiredField = schemas[manualTab].find((field) => field.required && !manualForm[field.key])
    if (!manualForm.worker || !manualForm.idCard || !manualForm.project || !manualForm.date || requiredField) {
      triggerNotification(`请填写${requiredField?.label || '必填字段'}`, 'warning')
      return
    }
    setManualData((prev) => {
      const next = editingManualId
        ? prev[manualTab].map((item) => (item.id === editingManualId ? { ...manualForm, id: editingManualId, source: item.source } : item))
        : [{ ...manualForm, id: Date.now(), source: '人工录入' }, ...prev[manualTab]]
      return { ...prev, [manualTab]: next }
    })
    setManualDrawerOpen(false)
    triggerNotification(editingManualId ? '人工维护记录已更新' : '人工维护记录已新增')
  }

  const deleteManual = (record) => {
    if (!window.confirm(`确认删除${record.worker}的${currentManualMeta.label}吗？`)) return
    setManualData((prev) => ({ ...prev, [manualTab]: prev[manualTab].filter((item) => item.id !== record.id) }))
    triggerNotification('记录已删除')
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat icon={Database} title="实名制工人数" value="1,265 人" desc="" />
        <Stat icon={Upload} title="今日AI识别" value="18 条" desc="" />
        <Stat icon={FileCheck2} title="待确认数据" value={`${pending.filter((item) => item.status === '待确认').length} 条`} desc="" />
      </section>

      <section className="rounded border border-border-gray bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border-gray p-4">
          <Tab active={tab === 'realname'} onClick={() => setTab('realname')}>实名制数据</Tab>
          <Tab active={tab === 'ai'} onClick={() => setTab('ai')}>AI智能采集</Tab>
          <Tab active={tab === 'pending'} onClick={() => setTab('pending')}>待确认数据</Tab>
          <Tab active={tab === 'manual'} onClick={() => setTab('manual')}>人工数据维护</Tab>
        </div>

        {tab === 'realname' && (
          <div className="p-4">
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                ['worker', '人员信息'], ['employment', '用工信息'], ['attendance', '考勤信息'], ['team', '班组信息'], ['company', '企业信息']
              ].map(([key, label]) => <Tab key={key} active={realnameTab === key} onClick={() => setRealnameTab(key)}>{label}</Tab>)}
            </div>
            <FieldQueries fields={realnameData.queryFields} values={workerQuery} onChange={updateQuery} />
            {realnameTab === 'worker' ? (
              <SimpleTable
                headers={['姓名', '身份证号', '工种', '班组', '所属企业', '当前项目', '在场状态', '来源', '操作']}
                rows={filteredWorkers.map((item) => [<b key="name">{item.name}</b>, item.idCard, item.job, item.team, item.company, item.project, <Badge key="status" tone={item.status === '在场' ? 'green' : 'gray'}>{item.status}</Badge>, <Badge key="source">实名制系统</Badge>, <button key="view" className="text-primary" onClick={() => setSelectedWorker(item)}>查看详情</button>])}
              />
            ) : <SimpleTable headers={realnameData.headers} rows={filteredRealnameRows} />}
          </div>
        )}

        {tab === 'ai' && (
          <div className="grid gap-4 p-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded border border-dashed border-primary bg-[#F6FAFF] p-8 text-center">
              <Upload className="mx-auto mb-3 h-10 w-10 text-primary" />
              <div className="text-base font-semibold">上传线下附件，AI自动提取评价事实数据</div>
              <div className="mt-2 text-sm text-text-secondary">支持 PDF、Word、JPG、PNG 文件</div>
              <button className="mt-5 rounded bg-primary px-4 py-2 text-white" onClick={() => fileInputRef.current?.click()}>选择文件</button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => handleUpload(event.target.files?.[0])} />
            </div>
            <div className="rounded border border-border-gray p-4">
              <div className="mb-3 font-bold">AI结构化识别结果</div>
              {aiResult ? <div className="space-y-3"><InfoLine label="文档类型" value={aiResult.type} /><InfoLine label="关联工人" value={`${aiResult.worker} / ${aiResult.idCard}`} /><InfoLine label="所属项目" value={aiResult.project} /><StructuredFields type={aiResult.type} fields={aiResult.fields} /><div className="flex gap-2 pt-1"><button className="rounded bg-primary px-4 py-2 text-white" onClick={saveAiToPending}>保存至待确认</button><button className="rounded border border-border-gray px-4 py-2" onClick={() => setAiResult(null)}>取消</button></div></div> : <div className="flex h-64 items-center justify-center rounded bg-[#FAFAFA] text-text-secondary">上传附件后展示AI识别字段</div>}
            </div>
          </div>
        )}

        {tab === 'pending' && <div className="p-4"><SimpleTable headers={['工人', '身份证号', '项目', '类型', '原文件', '识别结果', '状态', '识别时间', '操作']} rows={pending.map((item) => [item.worker, item.idCard, item.project, item.type, item.file, <StructuredFields key="fields" type={item.type} fields={item.fields} compact />, <Badge key="status" tone={item.status === '待确认' ? 'orange' : 'gray'}>{item.status}</Badge>, item.time, <button key="view" className="text-primary" onClick={() => setPendingRecord(item)}>核对</button>])} /></div>}

        {tab === 'manual' && (
          <div className="p-4">
             <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{manualTabs.map((item) => <Tab key={item.key} active={manualTab === item.key} onClick={() => setManualTab(item.key)}>{item.label}</Tab>)}</div><button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white" onClick={openAddManual}><Plus className="h-4 w-4" /> 新增{currentManualMeta.type}</button></div>
             <ManualQueries values={manualQuery} onChange={updateManualQuery} />
             <SimpleTable headers={manualTable.headers} rows={filteredManualRows.map((item) => [...manualTable.values(item), <Badge key="source" tone={item.source === 'AI识别' ? 'blue' : 'green'}>{item.source}</Badge>, item.attachment || '-', item.remark || '-', <div key="actions" className="flex gap-3"><button className="text-primary" onClick={() => openEditManual(item)}>编辑</button><button className="text-danger-red" onClick={() => deleteManual(item)}>删除</button></div>])} />
          </div>
        )}
      </section>

      {selectedWorker && <Drawer title="实名制工人详情" onClose={() => setSelectedWorker(null)} width="560px"><InfoLine label="姓名" value={selectedWorker.name} /><InfoLine label="身份证号" value={selectedWorker.idCard} /><InfoLine label="性别/年龄" value={`${selectedWorker.gender} / ${selectedWorker.age}岁`} /><InfoLine label="联系方式" value={selectedWorker.phone} /><InfoLine label="学历" value={selectedWorker.education} /><InfoLine label="企业/班组" value={`${selectedWorker.company} / ${selectedWorker.team}`} /><InfoLine label="工种/项目" value={`${selectedWorker.job} / ${selectedWorker.project}`} /></Drawer>}

      {pendingRecord && <Drawer title="核对待确认数据" onClose={() => setPendingRecord(null)} width="760px"><div className="space-y-4"><WorkerSelect value={pendingRecord.worker} idCard={pendingRecord.idCard} onChange={(name) => updatePendingWorker(name, pendingRecord, setPendingRecord)} /><FormSelect label="所属项目" value={pendingRecord.project} onChange={(v) => setPendingRecord({ ...pendingRecord, project: v })} options={projects} required /><FormSelect label="数据类型" value={pendingRecord.type} onChange={(v) => setPendingRecord({ ...pendingRecord, type: v, fields: { ...defaultFields(manualTabs.find((item) => item.type === v)?.key || 'health') } })} options={manualTabs.map((item) => item.type)} required /><FormInput label="发生日期" type="date" value={pendingRecord.date} onChange={(v) => setPendingRecord({ ...pendingRecord, date: v })} required /><PendingDynamicFields record={pendingRecord} setRecord={setPendingRecord} /><div className="flex justify-end gap-2"><button className="flex items-center gap-2 rounded border border-danger-red px-4 py-2 text-danger-red" onClick={() => rejectPending(pendingRecord)}><X className="h-4 w-4" /> 驳回</button><button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white" onClick={() => approvePending(pendingRecord)}><Check className="h-4 w-4" /> 确认入库</button></div></div></Drawer>}

      {manualDrawerOpen && <Drawer title={`${editingManualId ? '编辑' : '新增'}${currentManualMeta.label}`} onClose={() => setManualDrawerOpen(false)}><WorkerSelect value={manualForm.worker} idCard={manualForm.idCard} onChange={updateManualWorker} /><FormSelect label="所属项目" value={manualForm.project} onChange={(v) => setManualForm({ ...manualForm, project: v })} options={projects} required /><FormInput label="发生日期" type="date" value={manualForm.date} onChange={(v) => setManualForm({ ...manualForm, date: v })} required /><DynamicFormFields tab={manualTab} form={manualForm} setForm={setManualForm} /><FormInput label="附件名称" value={manualForm.attachment} onChange={(v) => setManualForm({ ...manualForm, attachment: v })} /><FormTextarea label="备注" value={manualForm.remark} onChange={(v) => setManualForm({ ...manualForm, remark: v })} /><div className="flex justify-end gap-2"><button className="rounded border border-border-gray px-4 py-2" onClick={() => setManualDrawerOpen(false)}>取消</button><button className="rounded bg-primary px-4 py-2 text-white" onClick={saveManual}>保存</button></div></Drawer>}
    </div>
  )
}

function FieldQueries({ fields, values, onChange }) {
  return <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{fields.map((field) => <label key={field.key} className="text-sm"><span className="mb-1 block text-text-secondary">查询{field.label}</span><input className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values[field.key] || ''} onChange={(event) => onChange(field.key, event.target.value)} placeholder={`请输入${field.label}`} /></label>)}</div>
}

function ManualQueries({ values, onChange }) {
  return <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
    <label className="text-sm"><span className="mb-1 block text-text-secondary">工人姓名</span><input className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values.worker || ''} onChange={(event) => onChange('worker', event.target.value)} placeholder="请输入工人姓名" /></label>
    <label className="text-sm"><span className="mb-1 block text-text-secondary">身份证号</span><input className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values.idCard || ''} onChange={(event) => onChange('idCard', event.target.value)} placeholder="请输入身份证号" /></label>
    <label className="text-sm"><span className="mb-1 block text-text-secondary">项目</span><input className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values.project || ''} onChange={(event) => onChange('project', event.target.value)} placeholder="请输入项目名称" /></label>
    <label className="text-sm"><span className="mb-1 block text-text-secondary">发生日期</span><span className="flex items-center gap-2"><input type="date" className="min-w-0 flex-1 rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values.dateStart || ''} onChange={(event) => onChange('dateStart', event.target.value)} /><span className="text-text-secondary">至</span><input type="date" className="min-w-0 flex-1 rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values.dateEnd || ''} onChange={(event) => onChange('dateEnd', event.target.value)} /></span></label>
  </div>
}

function WorkerSelect({ value, idCard, onChange }) {
  return <div className="grid gap-4 md:grid-cols-2"><label className="block text-sm"><span className="mb-1 block text-text-secondary"><span className="mr-1 text-danger-red">*</span>工人</span><input list="worker-options" className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={value} onChange={(event) => onChange(event.target.value)} placeholder="输入姓名或身份证号检索" /><datalist id="worker-options">{workers.map((item) => <option key={item.id} value={item.name}>{item.idCard}</option>)}</datalist></label><label className="block text-sm"><span className="mb-1 block text-text-secondary">身份证号</span><input className="w-full rounded border border-border-gray bg-[#FAFAFA] px-3 py-2" value={idCard} readOnly /></label></div>
}

function DynamicFormFields({ tab, form, setForm }) {
  return <>{schemas[tab].map((field) => field.type === 'select' ? <FormSelect key={field.key} label={field.label} value={form[field.key] || ''} onChange={(v) => setForm({ ...form, [field.key]: v })} options={field.options} required={field.required} /> : <FormInput key={field.key} label={field.label} value={form[field.key] || ''} onChange={(v) => setForm({ ...form, [field.key]: v })} required={field.required} />)}</>
}

function PendingDynamicFields({ record, setRecord }) {
  const tab = manualTabs.find((item) => item.type === record.type)?.key || 'health'
  return <>{schemas[tab].map((field) => field.type === 'select' ? <FormSelect key={field.key} label={field.label} value={record.fields[field.key] || ''} onChange={(v) => setRecord({ ...record, fields: { ...record.fields, [field.key]: v } })} options={field.options} required={field.required} /> : <FormInput key={field.key} label={field.label} value={record.fields[field.key] || ''} onChange={(v) => setRecord({ ...record, fields: { ...record.fields, [field.key]: v } })} required={field.required} />)}</>
}

function StructuredFields({ type, fields, compact = false }) {
  const tab = manualTabs.find((item) => item.type === type)?.key || 'health'
  const visible = schemas[tab].map((field) => ({ label: field.label, value: fields[field.key] || '-' }))
  return <div className={`rounded bg-[#F6FAFF] ${compact ? 'p-2 text-xs' : 'p-3 text-sm'}`}>{visible.map((item) => <div key={item.label} className="mb-1 flex justify-between gap-4 last:mb-0"><span className="text-text-secondary">{item.label}</span><span className="font-medium">{item.value}</span></div>)}</div>
}

function getRealnameData(type) {
  const data = {
    employment: { queryFields: [{ key: 'name', label: '姓名' }, { key: 'company', label: '企业' }, { key: 'team', label: '班组' }, { key: 'job', label: '工种' }], queryKeys: ['name', 'company', 'team', 'job'], headers: ['姓名', '企业', '班组', '工种', '用工开始', '用工截止'], rows: workers.map((item) => [item.name, item.company, item.team, item.job, item.entryDate, item.leaveDate]) },
    attendance: { queryFields: [{ key: 'name', label: '姓名' }, { key: 'date', label: '考勤日期' }], queryKeys: ['name', 'date'], headers: ['姓名', '考勤日期', '首次进场', '最后出场', '累计时长'], rows: workers.map((item, index) => [item.name, '2026-07-10', `07:${50 + index}`, `18:${10 + index}`, `${8 + index}.5小时`]) },
    team: { queryFields: [{ key: 'team', label: '班组名称' }, { key: 'company', label: '所属企业' }], queryKeys: ['team', 'company'], headers: ['班组名称', '当前人数', '所属企业', '来源'], rows: [...new Set(workers.map((item) => item.team))].map((team) => [team, workers.filter((item) => item.team === team).length, workers.find((item) => item.team === team)?.company, '实名制系统']) },
    company: { queryFields: [{ key: 'company', label: '企业名称' }, { key: 'creditCode', label: '统一社会信用代码' }], queryKeys: ['company', 'creditCode'], headers: ['企业名称', '统一社会信用代码', '参建类型', '联系人', '当前用工人数'], rows: companiesForTable().map((item) => [item.company, item.creditCode, item.type, item.contact, item.count]) }
  }
  return data[type] || { queryFields: [{ key: 'name', label: '姓名' }, { key: 'idCard', label: '身份证号' }, { key: 'job', label: '工种' }, { key: 'company', label: '企业' }, { key: 'project', label: '当前项目' }], queryKeys: [], headers: [], rows: [] }
}

function matchesQueries(item, queries, keys) { return keys.every((key) => matchesQueryValue(item[key], queries[key])) }
function matchesQueryValue(value, query) { return !query || String(value || '').toLowerCase().includes(query.toLowerCase()) }
function matchesManualQuery(item, query) {
  return matchesQueryValue(item.worker, query.worker)
    && matchesQueryValue(item.idCard, query.idCard)
    && matchesQueryValue(item.project, query.project)
    && (!query.dateStart || item.date >= query.dateStart)
    && (!query.dateEnd || item.date <= query.dateEnd)
}
function updatePendingWorker(name, record, setter) { const worker = workers.find((item) => item.name === name); setter({ ...record, worker: name, idCard: worker?.idCard || record.idCard }) }
function defaultFields(tab) { return Object.fromEntries(schemas[tab].map((field) => [field.key, field.options?.[0] || ''])) }
function getManualTableConfig(tab) {
  const common = ['工人姓名', '身份证号', '项目', '发生日期']
  const configs = {
    health: { headers: [...common, '体检结果', '是否合格', '来源', '附件', '备注', '操作'], values: (item) => [item.worker, item.idCard, item.project, item.date, item.healthResult || '-', item.qualified || '-'] },
    reward: { headers: [...common, '奖励事项', '奖励内容', '来源', '附件', '备注', '操作'], values: (item) => [item.worker, item.idCard, item.project, item.date, item.rewardItem || '-', item.rewardContent || '-'] },
    punish: { headers: [...common, '处罚事项', '处罚内容', '来源', '附件', '备注', '操作'], values: (item) => [item.worker, item.idCard, item.project, item.date, item.punishItem || '-', item.punishContent || '-'] },
    cert: { headers: [...common, '证书类别', '证书名称', '来源', '附件', '备注', '操作'], values: (item) => [item.worker, item.idCard, item.project, item.date, item.certCategory || '-', item.certName || '-'] }
    ,laborDispute: { headers: [...common, '纠纷事项', '来源', '附件', '备注', '操作'], values: (item) => [item.worker, item.idCard, item.project, item.date, item.disputeItem || '-'] }
  }
  return configs[tab]
}
function aiFields(type, worker) { const tab = manualTabs.find((item) => item.type === type)?.key || 'health'; return { ...defaultFields(tab), ...(tab === 'health' ? { healthResult: '体检结论合格，无职业禁忌', qualified: '是' } : {}), ...(tab === 'reward' ? { rewardContent: '项目级表彰' } : {}), ...(tab === 'punish' ? { punishContent: '完成整改并复查' } : {}), ...(tab === 'cert' ? { certName: `${worker.job}技能证书` } : {}) } }
function inferType(fileName) { if (fileName.includes('奖励') || fileName.includes('安全之星')) return '奖励'; if (fileName.includes('处罚') || fileName.includes('整改')) return '处罚'; if (fileName.includes('证书')) return '证书'; return '体检' }
function companiesForTable() { return [{ company: '中建一局集团', creditCode: '91110000****1234', type: '总包单位', contact: '刘经理', count: 856 }, { company: '中铁十一局', creditCode: '91420000****5678', type: '专业分包', contact: '周经理', count: 312 }, { company: '上海建工集团', creditCode: '91310000****9012', type: '专业分包', contact: '陈经理', count: 97 }] }
