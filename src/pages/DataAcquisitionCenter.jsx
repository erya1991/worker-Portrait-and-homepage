import { useMemo, useRef, useState } from 'react'
import { Check, Cpu, Edit, Plus, Search, Upload, X } from 'lucide-react'

const workers = [
  { id: 1, name: '张建国', idCard: '3701021980******56', job: '钢筋工', team: '钢筋一班', company: '中建一局集团', project: '北京CBD东区超高层项目', status: '在场', completeness: 92 },
  { id: 2, name: '李强', idCard: '4201061988******90', job: '架子工', team: '架子二班', company: '中建一局集团', project: '北京CBD东区超高层项目', status: '在场', completeness: 88 },
  { id: 3, name: '王朝阳', idCard: '1301021992******67', job: '泥工', team: '泥工一班', company: '中铁十一局', project: '轨道交通18号线项目', status: '在场', completeness: 76 },
  { id: 4, name: '赵铁柱', idCard: '2101031975******78', job: '电焊工', team: '机电安装班', company: '上海建工集团', project: '城市剧院机电安装项目', status: '离场', completeness: 84 }
]

const initialPending = [
  { id: 1, worker: '张建国', type: '体检记录', source: '体检报告.pdf', result: '体检合格，无职业禁忌', confidence: 98, time: '2026-07-09 11:20' },
  { id: 2, worker: '王朝阳', type: '处罚记录', source: '安全整改处罚单.png', result: '未佩戴安全帽，通报批评', confidence: 95, time: '2026-07-09 09:10' }
]

const initialManual = {
  health: [
    { id: 1, worker: '张建国', project: '北京CBD东区超高层项目', date: '2026-07-08', result: '合格', attachment: '体检报告.pdf', org: '朝阳区第二医院', remark: '无职业禁忌' }
  ],
  reward: [
    { id: 2, worker: '李强', project: '北京CBD东区超高层项目', date: '2026-07-08', result: '安全之星', attachment: '表彰名单.jpg', org: '项目安全部', remark: '月度安全表彰' }
  ],
  punish: [
    { id: 3, worker: '王朝阳', project: '轨道交通18号线项目', date: '2026-07-05', result: '一般违章处罚', attachment: '处罚单.png', org: '项目安全部', remark: '未佩戴安全帽' }
  ],
  training: [
    { id: 4, worker: '赵铁柱', project: '城市剧院机电安装项目', date: '2026-07-02', result: '三级安全教育合格', attachment: '培训签到表.xlsx', org: '项目培训负责人', remark: '考试合格' }
  ],
  cert: [
    { id: 5, worker: '张建国', project: '北京CBD东区超高层项目', date: '2026-06-20', result: '钢筋工技能证书', attachment: '证书扫描件.pdf', org: '住建部门', remark: '证书有效' }
  ]
}

const manualTabs = [
  { key: 'health', label: '体检', title: '体检记录' },
  { key: 'reward', label: '奖励', title: '奖励记录' },
  { key: 'punish', label: '处罚', title: '处罚记录' },
  { key: 'training', label: '培训', title: '培训记录' },
  { key: 'cert', label: '证书', title: '证书记录' }
]

const emptyForm = {
  worker: '张建国',
  project: '北京CBD东区超高层项目',
  date: '2026-07-10',
  result: '',
  attachment: '',
  org: '',
  remark: ''
}

export default function DataAcquisitionCenter({ triggerNotification }) {
  const [tab, setTab] = useState('realname')
  const [keyword, setKeyword] = useState('')
  const [pending, setPending] = useState(initialPending)
  const [manualTab, setManualTab] = useState('health')
  const [manualData, setManualData] = useState(initialManual)
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [aiResult, setAiResult] = useState(null)
  const [editingPending, setEditingPending] = useState(null)
  const [manualForm, setManualForm] = useState(emptyForm)
  const [editingManualId, setEditingManualId] = useState(null)
  const [manualDrawerOpen, setManualDrawerOpen] = useState(false)
  const fileInputRef = useRef(null)

  const currentManualMeta = manualTabs.find((item) => item.key === manualTab)

  const filteredWorkers = useMemo(() => {
    return workers.filter((item) => [item.name, item.idCard, item.job, item.company, item.project].some((v) => v.includes(keyword)))
  }, [keyword])

  const handleUpload = (file) => {
    if (!file) return
    const result = {
      fileName: file.name,
      type: file.name.includes('处罚') ? '处罚记录' : file.name.includes('奖励') ? '奖励记录' : '体检记录',
      worker: file.name.includes('李') ? '李强' : '张建国',
      result: file.name.includes('处罚') ? '一般违章处罚' : file.name.includes('奖励') ? '安全之星' : '体检合格，无职业禁忌',
      confidence: 96
    }
    setAiResult(result)
    triggerNotification('AI已完成附件识别，请确认后入库')
  }

  const confirmAi = () => {
    if (!aiResult) return
    setPending((prev) => [
      {
        id: Date.now(),
        worker: aiResult.worker,
        type: aiResult.type,
        source: aiResult.fileName,
        result: aiResult.result,
        confidence: aiResult.confidence,
        time: '2026-07-10 10:30'
      },
      ...prev
    ])
    setAiResult(null)
    triggerNotification('已生成待确认数据')
  }

  const savePending = () => {
    setPending((prev) => prev.map((item) => (item.id === editingPending.id ? editingPending : item)))
    setEditingPending(null)
    triggerNotification('待确认数据已修改')
  }

  const approvePending = (id) => {
    const record = pending.find((item) => item.id === id)
    if (!record) return
    const key = record.type.includes('处罚') ? 'punish' : record.type.includes('奖励') ? 'reward' : 'health'
    setManualData((prev) => ({
      ...prev,
      [key]: [
        { id: Date.now(), worker: record.worker, project: '北京CBD东区超高层项目', date: '2026-07-10', result: record.result, attachment: record.source, org: 'AI识别', remark: '由待确认数据入库' },
        ...prev[key]
      ]
    }))
    setPending((prev) => prev.filter((item) => item.id !== id))
    triggerNotification('确认成功，数据已进入评价台账')
  }

  const openAddManual = () => {
    setEditingManualId(null)
    setManualForm({ ...emptyForm, result: defaultResultFor(manualTab) })
    setManualDrawerOpen(true)
  }

  const openEditManual = (record) => {
    setEditingManualId(record.id)
    setManualForm(record)
    setManualDrawerOpen(true)
  }

  const saveManual = () => {
    setManualData((prev) => {
      const nextList = editingManualId
        ? prev[manualTab].map((item) => (item.id === editingManualId ? { ...manualForm, id: editingManualId } : item))
        : [{ ...manualForm, id: Date.now() }, ...prev[manualTab]]
      return { ...prev, [manualTab]: nextList }
    })
    setManualDrawerOpen(false)
    triggerNotification(editingManualId ? '评价数据记录已更新' : '评价数据记录已新增')
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat title="实名制工人" value="1,265" desc="自动同步基础数据" />
        <Stat title="AI识别附件" value="58" desc="本周新增" />
        <Stat title="待确认数据" value={pending.length} desc="需人工确认后入库" />
        <Stat title="人工维护记录" value="126" desc="体检/奖励/处罚/培训/证书" />
      </section>

      <section className="rounded border border-border-gray bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border-gray p-4">
          <Tab active={tab === 'realname'} onClick={() => setTab('realname')}>实名制数据</Tab>
          <Tab active={tab === 'ai'} onClick={() => setTab('ai')}>AI采集</Tab>
          <Tab active={tab === 'pending'} onClick={() => setTab('pending')}>待确认</Tab>
          <Tab active={tab === 'manual'} onClick={() => setTab('manual')}>人工维护</Tab>
        </div>

        {tab === 'realname' && (
          <div className="p-4">
            <SearchBar keyword={keyword} setKeyword={setKeyword} placeholder="搜索姓名、工种、企业、项目" />
            <div className="mt-4 overflow-auto rounded border border-border-gray">
              <table className="b-table">
                <thead>
                  <tr><th>姓名</th><th>身份证</th><th>工种</th><th>班组</th><th>企业</th><th>项目</th><th>评价完整率</th><th>操作</th></tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((item) => (
                    <tr key={item.id}>
                      <td className="font-semibold">{item.name}</td>
                      <td>{item.idCard}</td>
                      <td>{item.job}</td>
                      <td>{item.team}</td>
                      <td>{item.company}</td>
                      <td>{item.project}</td>
                      <td><Progress value={item.completeness} /></td>
                      <td><button className="text-primary" onClick={() => setSelectedWorker(item)}>查看详情</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'ai' && (
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded border border-dashed border-primary bg-[#F6FAFF] p-8 text-center">
              <Upload className="mx-auto mb-3 h-10 w-10 text-primary" />
              <div className="text-base font-semibold">上传线下附件，由AI识别结构化数据</div>
              <div className="mt-2 text-sm text-text-secondary">支持体检报告、奖励名单、处罚单、培训签到表、证书扫描件</div>
              <button className="mt-5 rounded bg-primary px-4 py-2 text-white" onClick={() => fileInputRef.current?.click()}>选择文件</button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
            </div>
            <div className="rounded border border-border-gray p-4">
              <div className="mb-3 flex items-center gap-2 font-semibold"><Cpu className="h-4 w-4 text-primary" /> AI识别结果</div>
              {aiResult ? (
                <div className="space-y-3">
                  <InfoLine label="文件名称" value={aiResult.fileName} />
                  <InfoLine label="识别类型" value={aiResult.type} />
                  <InfoLine label="关联工人" value={aiResult.worker} />
                  <InfoLine label="提取结果" value={aiResult.result} />
                  <InfoLine label="识别可信度" value={`${aiResult.confidence}%`} />
                  <div className="flex gap-2 pt-2">
                    <button className="rounded bg-primary px-4 py-2 text-white" onClick={confirmAi}>生成待确认数据</button>
                    <button className="rounded border border-border-gray px-4 py-2" onClick={() => setAiResult(null)}>清空</button>
                  </div>
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded bg-[#FAFAFA] text-text-secondary">上传附件后展示AI识别字段</div>
              )}
            </div>
          </div>
        )}

        {tab === 'pending' && (
          <div className="p-4">
            <SimpleTable
              headers={['工人', '数据类型', '识别结果', '可信度', '时间', '操作']}
              rows={pending.map((item) => [
                item.worker,
                item.type,
                item.result,
                `${item.confidence}%`,
                item.time,
                <div className="flex gap-2" key={item.id}>
                  <button className="text-primary" onClick={() => setEditingPending(item)}><Edit className="inline h-4 w-4" /> 修改</button>
                  <button className="text-success-green" onClick={() => approvePending(item.id)}><Check className="inline h-4 w-4" /> 确认</button>
                  <button className="text-danger-red" onClick={() => setPending((prev) => prev.filter((p) => p.id !== item.id))}><X className="inline h-4 w-4" /> 驳回</button>
                </div>
              ])}
            />
          </div>
        )}

        {tab === 'manual' && (
          <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {manualTabs.map((item) => <Tab key={item.key} active={manualTab === item.key} onClick={() => setManualTab(item.key)}>{item.label}</Tab>)}
              </div>
              <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white" onClick={openAddManual}>
                <Plus className="h-4 w-4" /> 新增{currentManualMeta.title}
              </button>
            </div>
            <SimpleTable
              headers={['工人', '项目', '日期', '结果', '附件', '操作']}
              rows={manualData[manualTab].map((item) => [
                item.worker,
                item.project,
                item.date,
                item.result,
                item.attachment,
                <button key={item.id} className="text-primary" onClick={() => openEditManual(item)}><Edit className="inline h-4 w-4" /> 编辑</button>
              ])}
            />
          </div>
        )}
      </section>

      {selectedWorker && (
        <Drawer title="实名制工人详情" onClose={() => setSelectedWorker(null)}>
          <div className="space-y-3">
            <InfoLine label="姓名" value={selectedWorker.name} />
            <InfoLine label="身份证" value={selectedWorker.idCard} />
            <InfoLine label="工种/班组" value={`${selectedWorker.job} / ${selectedWorker.team}`} />
            <InfoLine label="企业/项目" value={`${selectedWorker.company} / ${selectedWorker.project}`} />
            <InfoLine label="评价完整率" value={`${selectedWorker.completeness}%`} />
            <div className="rounded bg-[#F6FAFF] p-3 text-sm">
              <div className="mb-2 font-semibold">系统建议</div>
              {selectedWorker.completeness < 85 ? '建议补充体检记录、培训记录或奖励处罚数据后再执行评价。' : '评价数据较完整，可直接进入评价模型计算。'}
            </div>
          </div>
        </Drawer>
      )}

      {editingPending && (
        <Drawer title="修改AI待确认数据" onClose={() => setEditingPending(null)}>
          <FormInput label="工人姓名" value={editingPending.worker} onChange={(v) => setEditingPending({ ...editingPending, worker: v })} />
          <FormSelect label="数据类型" value={editingPending.type} onChange={(v) => setEditingPending({ ...editingPending, type: v })} options={['体检记录', '奖励记录', '处罚记录', '培训记录', '证书记录']} />
          <FormInput label="原附件" value={editingPending.source} onChange={(v) => setEditingPending({ ...editingPending, source: v })} />
          <FormTextarea label="识别结果" value={editingPending.result} onChange={(v) => setEditingPending({ ...editingPending, result: v })} />
          <div className="mt-5 flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setEditingPending(null)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={savePending}>保存修改</button>
          </div>
        </Drawer>
      )}

      {manualDrawerOpen && (
        <Drawer title={`${editingManualId ? '编辑' : '新增'}${currentManualMeta.title}`} onClose={() => setManualDrawerOpen(false)}>
          <FormSelect label="工人姓名" value={manualForm.worker} onChange={(v) => setManualForm({ ...manualForm, worker: v })} options={workers.map((item) => item.name)} />
          <FormSelect label="所属项目" value={manualForm.project} onChange={(v) => setManualForm({ ...manualForm, project: v })} options={[...new Set(workers.map((item) => item.project))]} />
          <FormInput label="发生日期" type="date" value={manualForm.date} onChange={(v) => setManualForm({ ...manualForm, date: v })} />
          <FormInput label={resultLabelFor(manualTab)} value={manualForm.result} onChange={(v) => setManualForm({ ...manualForm, result: v })} />
          <FormInput label={orgLabelFor(manualTab)} value={manualForm.org} onChange={(v) => setManualForm({ ...manualForm, org: v })} />
          <FormInput label="附件名称" value={manualForm.attachment} onChange={(v) => setManualForm({ ...manualForm, attachment: v })} />
          <FormTextarea label="备注" value={manualForm.remark} onChange={(v) => setManualForm({ ...manualForm, remark: v })} />
          <div className="mt-5 flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setManualDrawerOpen(false)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={saveManual}>保存单据</button>
          </div>
        </Drawer>
      )}
    </div>
  )
}

function defaultResultFor(type) {
  return { health: '合格', reward: '安全之星', punish: '一般违章处罚', training: '培训合格', cert: '证书有效' }[type]
}

function resultLabelFor(type) {
  return { health: '体检结果', reward: '奖励名称', punish: '处罚事项', training: '培训结果', cert: '证书名称' }[type]
}

function orgLabelFor(type) {
  return { health: '体检机构', reward: '奖励单位', punish: '处罚部门', training: '培训讲师/机构', cert: '发证单位' }[type]
}

function Stat({ title, value, desc }) {
  return (
    <div className="rounded border border-border-gray bg-white p-4 shadow-sm">
      <div className="text-sm text-text-secondary">{title}</div>
      <div className="mt-2 text-2xl font-bold text-text-dark">{value}</div>
      <div className="mt-1 text-xs text-text-secondary">{desc}</div>
    </div>
  )
}

function Tab({ active, onClick, children }) {
  return <button onClick={onClick} className={`rounded px-3 py-1.5 text-sm ${active ? 'bg-primary text-white' : 'bg-[#F5F7FA] text-text-dark'}`}>{children}</button>
}

function SearchBar({ keyword, setKeyword, placeholder }) {
  return (
    <div className="flex max-w-md items-center gap-2 rounded border border-border-gray px-3 py-2">
      <Search className="h-4 w-4 text-text-secondary" />
      <input className="w-full outline-none" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

function Progress({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 rounded bg-[#EDF2F7]"><div className="h-2 rounded bg-primary" style={{ width: `${value}%` }} /></div>
      <span>{value}%</span>
    </div>
  )
}

function InfoLine({ label, value }) {
  return <div className="grid grid-cols-[96px_1fr] gap-3 text-sm"><span className="text-text-secondary">{label}</span><span className="font-medium">{value}</span></div>
}

function SimpleTable({ headers, rows }) {
  return (
    <div className="overflow-auto rounded border border-border-gray">
      <table className="b-table">
        <thead><tr>{headers.map((item) => <th key={item}>{item}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

function Drawer({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20">
      <div className="h-full w-[480px] overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border-gray bg-white px-5 py-4">
          <div className="font-bold">{title}</div>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4 p-5">{children}</div>
      </div>
    </div>
  )
}

function FormInput({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-secondary">{label}</span>
      <input type={type} className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function FormTextarea({ label, value, onChange }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-secondary">{label}</span>
      <textarea className="min-h-24 w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-secondary">{label}</span>
      <select className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  )
}
