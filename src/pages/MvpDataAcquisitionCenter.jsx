import { useMemo, useState } from 'react'
import { Check, Database, FileCheck2, LoaderCircle, Plus, Upload, X } from 'lucide-react'
import {
  Badge,
  Drawer,
  FormInput,
  FormSelect,
  FormTextarea,
  InfoLine,
  SimpleTable,
  Stat,
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

const dataTabs = [
  { key: 'worker', label: '人员信息', group: 'realname' },
  { key: 'employment', label: '用工信息', group: 'realname' },
  { key: 'attendance', label: '考勤信息', group: 'realname' },
  { key: 'team', label: '班组信息', group: 'realname' },
  { key: 'company', label: '企业信息', group: 'realname' },
  ...manualTabs.map((item) => ({ ...item, group: 'manual' }))
]

const supportedExtensions = ['.pdf', '.doc', '.docx', '.png']
const maxSingleFileSize = 20 * 1024 * 1024
const maxBatchFileSize = 100 * 1024 * 1024

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

const initialManual = {
  health: [{ id: 1, worker: '张建国', idCard: '3701021980******56', project: '北京CBD东区超高层项目', date: '2026-07-08', healthResult: '合格', qualified: '是', source: 'AI识别', reviewStatus: '已确认', attachment: '体检报告.pdf', remark: '无职业禁忌' }],
  reward: [{ id: 2, worker: '李强', idCard: '4201061988******90', project: '北京CBD东区超高层项目', date: '2026-07-08', rewardItem: '安全之星', rewardContent: '月度安全表彰', source: '人工录入', reviewStatus: '无需确认', attachment: '表彰名单.jpg', remark: '' }],
  punish: [{ id: 3, worker: '王朝阳', idCard: '1301021992******67', project: '轨道交通8号线项目', date: '2026-07-05', punishItem: '安全整改', punishContent: '未佩戴安全帽', source: 'AI识别', reviewStatus: '已确认', attachment: '处罚单.png', remark: '' }],
  cert: [{ id: 5, worker: '张建国', idCard: '3701021980******56', project: '北京CBD东区超高层项目', date: '2026-06-20', certCategory: '特殊工种证书', certName: '钢筋工技能证书', source: 'AI识别', reviewStatus: '已确认', attachment: '证书扫描件.pdf', remark: '证书有效' }]
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
  const [activeTab, setActiveTab] = useState('worker')
  const [queries, setQueries] = useState({})
  const [manualData, setManualData] = useState(initialManual)
  const [manualQueries, setManualQueries] = useState({})
  const [pendingOnly, setPendingOnly] = useState({})
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [previewAttachment, setPreviewAttachment] = useState(null)
  const [reviewRecord, setReviewRecord] = useState(null)
  const [manualDrawerOpen, setManualDrawerOpen] = useState(false)
  const [manualForm, setManualForm] = useState(emptyManualForm)
  const [editingManualId, setEditingManualId] = useState(null)
  const [editingManualTab, setEditingManualTab] = useState('health')
  const [batchState, setBatchState] = useState(null)
  const [batchConfirmOpen, setBatchConfirmOpen] = useState(false)

  const activeMeta = dataTabs.find((item) => item.key === activeTab) || dataTabs[0]
  const workerQuery = queries[activeTab] || {}
  const realnameData = useMemo(() => getRealnameData(activeTab), [activeTab])
  const manualTable = activeMeta.group === 'manual' ? getManualTableConfig(activeTab) : null
  const manualQuery = manualQueries[activeTab] || {}
  const currentManualMeta = manualTabs.find((item) => item.key === activeTab)
  const editingManualMeta = manualTabs.find((item) => item.key === editingManualTab) || manualTabs[0]
  const pendingCount = Object.values(manualData).flat().filter((item) => item.reviewStatus === '待确认').length
  const activePendingCount = activeMeta.group === 'manual' ? manualData[activeTab].filter((item) => item.reviewStatus === '待确认').length : 0

  const updateQuery = (key, value) => {
    setQueries((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], [key]: value } }))
  }

  const filteredWorkers = workers.filter((item) => matchesQueries(item, workerQuery, ['name', 'idCard', 'job', 'team', 'company', 'project', 'status']))
  const filteredRealnameRows = realnameData.rows.filter((row) => row.some((value, index) => matchesQueryValue(value, workerQuery[realnameData.queryKeys[index]])))
  const filteredManualRows = activeMeta.group === 'manual'
    ? manualData[activeTab].filter((item) => matchesManualQuery(item, manualQuery) && (!pendingOnly[activeTab] || item.reviewStatus === '待确认'))
    : []

  const updateManualQuery = (key, value) => {
    setManualQueries((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], [key]: value } }))
  }

  const openBatchUpload = () => {
    setBatchState({ type: currentManualMeta.type, tab: activeTab, files: [], status: 'idle', results: [] })
  }

  const addBatchFiles = (fileList) => {
    const incoming = Array.from(fileList || [])
    if (!incoming.length) return
    setBatchState((prev) => {
      if (!prev) return prev
      const existingNames = new Set(prev.files.map((item) => item.name))
      let queuedSize = prev.files.filter((item) => item.status !== 'invalid').reduce((total, item) => total + (item.size || 0), 0)
      const nextFiles = []
      incoming.forEach((file, index) => {
        if (existingNames.has(file.name)) {
          triggerNotification(`已忽略重复文件：${file.name}`, 'warning')
          return
        }
        existingNames.add(file.name)
        let status = 'ready'
        let error = ''
        if (!isSupportedFile(file.name)) {
          status = 'invalid'
          error = '仅支持 PDF、Word、PNG'
        } else if (file.size > maxSingleFileSize) {
          status = 'invalid'
          error = '单个文件不能超过20MB'
        } else if (queuedSize + file.size > maxBatchFileSize) {
          status = 'invalid'
          error = '本批文件总大小不能超过100MB'
        } else {
          queuedSize += file.size
        }
        nextFiles.push({ id: `${Date.now()}-${index}-${file.name}`, name: file.name, size: file.size, file, status, error })
      })
      return { ...prev, status: prev.status === 'completed' ? 'idle' : prev.status, results: prev.status === 'completed' ? [] : prev.results, files: [...prev.files, ...nextFiles] }
    })
  }

  const startBatchRecognition = () => {
    if (!batchState) return
    const readyFiles = batchState.files.filter((item) => item.status === 'ready')
    if (!readyFiles.length) {
      triggerNotification('请先添加可识别的附件', 'warning')
      return
    }
    setBatchState((prev) => ({ ...prev, status: 'recognizing', files: prev.files.map((item) => item.status === 'ready' ? { ...item, status: 'recognizing' } : item) }))
    window.setTimeout(() => {
      const namedFailureIndex = readyFiles.findIndex((file) => file.name.includes('失败'))
      const simulatedFailureIndex = readyFiles.length > 1 ? (namedFailureIndex >= 0 ? namedFailureIndex : readyFiles.length - 1) : namedFailureIndex
      const created = readyFiles.reduce((records, file, index) => {
        if (index === simulatedFailureIndex) return records
        const matchedWorker = matchWorkerByFileName(file.name)
        const partial = file.name.includes('模糊') || file.name.includes('未匹配')
        records.push({
          id: Date.now() + index,
          worker: matchedWorker.name,
          idCard: matchedWorker.idCard,
          project: matchedWorker.project,
          type: batchState.type,
          file: file.name,
          attachment: createAttachmentMeta(file),
          date: '2026-07-10',
          ...aiFields(batchState.type, matchedWorker),
          reviewStatus: '待确认',
          recognitionStatus: partial ? 'partial' : 'success',
          warning: partial ? '人员或关键字段匹配置信度偏低，请重点核对' : '',
          source: 'AI识别',
          time: '2026-07-10 14:30'
        })
        return records
      }, [])
      setBatchState((prev) => ({
        ...prev,
        status: 'completed',
        results: created,
        files: prev.files.map((item) => {
          const result = created.find((record) => record.file === item.name)
          if (result) return { ...item, status: result.recognitionStatus, pendingId: result.id, warning: result.warning }
          if (item.status === 'recognizing') return { ...item, status: 'failed', error: '识别服务未提取到有效字段' }
          return item
        })
      }))
      triggerNotification(`批量识别完成，请点击“完成”确认写入台账`)
    }, 900)
  }

  const openBatchCompletionConfirm = () => {
    if (batchState?.status === 'completed') setBatchConfirmOpen(true)
  }

  const confirmBatchCompletion = () => {
    if (!batchState) return
    const { tab, results } = batchState
    setManualData((prev) => ({ ...prev, [tab]: [...results, ...prev[tab]] }))
    setBatchConfirmOpen(false)
    setBatchState(null)
    triggerNotification(`${results.length} 条识别结果已生成待确认数据`)
  }

  const closeBatchUpload = () => {
    setBatchConfirmOpen(false)
    setBatchState(null)
  }

  const confirmReview = (record) => {
    const targetTab = record.reviewTab || manualTabs.find((item) => item.type === record.type)?.key
    if (!targetTab) return
    const requiredField = schemas[targetTab].find((field) => field.required && !record[field.key])
    if (!record.worker || !record.idCard || !record.project || !record.date || requiredField) {
      triggerNotification(`请补充${requiredField?.label || '工人、项目和发生日期'}`, 'warning')
      return
    }
    const updatedRecord = { ...record }
    delete updatedRecord.reviewTab
    setManualData((prev) => ({
      ...prev,
      [targetTab]: prev[targetTab].map((item) => item.id === record.id ? { ...item, ...updatedRecord, reviewStatus: '已确认' } : item)
    }))
    setReviewRecord(null)
    triggerNotification('确认成功，记录状态已更新为已确认')
  }

  const openAddManual = () => {
    setEditingManualId(null)
    setEditingManualTab(activeTab)
    setManualForm({ ...emptyManualForm, ...defaultFields(activeTab) })
    setManualDrawerOpen(true)
  }

  const openEditManual = (record) => {
    setEditingManualId(record.id)
    setEditingManualTab(activeTab)
    setManualForm({ ...emptyManualForm, ...record, attachment: attachmentName(record.attachment) })
    setManualDrawerOpen(true)
  }

  const updateManualWorker = (name) => {
    const worker = workers.find((item) => item.name === name)
    setManualForm((prev) => ({ ...prev, worker: name, idCard: worker?.idCard || '' }))
  }

  const saveManual = () => {
    const requiredField = schemas[editingManualTab].find((field) => field.required && !manualForm[field.key])
    if (!manualForm.worker || !manualForm.idCard || !manualForm.project || !manualForm.date || requiredField) {
      triggerNotification(`请填写${requiredField?.label || '必填字段'}`, 'warning')
      return
    }
    setManualData((prev) => {
      const next = editingManualId
        ? prev[editingManualTab].map((item) => (item.id === editingManualId ? { ...manualForm, id: editingManualId, source: item.source, reviewStatus: item.reviewStatus || '无需确认', attachment: typeof item.attachment === 'object' ? item.attachment : manualForm.attachment } : item))
        : [{ ...manualForm, id: Date.now(), source: '人工录入', reviewStatus: '无需确认' }, ...prev[editingManualTab]]
      return { ...prev, [editingManualTab]: next }
    })
    setManualDrawerOpen(false)
    triggerNotification(editingManualId ? '人工维护记录已更新' : '人工维护记录已新增')
  }

  const deleteManual = (record) => {
    if (!window.confirm(`确认删除${record.worker}的${currentManualMeta.label}吗？`)) return
    setManualData((prev) => ({ ...prev, [activeTab]: prev[activeTab].filter((item) => item.id !== record.id) }))
    triggerNotification('记录已删除')
  }

  const openReview = (record) => setReviewRecord({ ...record, reviewTab: activeTab })

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat icon={Database} title="实名制工人数" value="1,265 人" desc="" />
        <Stat icon={Upload} title="今日AI识别" value="18 条" desc="" />
        <Stat icon={FileCheck2} title="待确认记录" value={`${pendingCount} 条`} desc="请进入对应页签核对" />
      </section>

      <section className="rounded border border-border-gray bg-white shadow-sm">
        <div className="overflow-x-auto border-b border-border-gray">
          <div className="flex min-w-max px-4">
            {dataTabs.map((item) => <UnderlineTab key={item.key} active={activeTab === item.key} onClick={() => setActiveTab(item.key)}>{item.label}</UnderlineTab>)}
          </div>
        </div>

        {activeMeta.group === 'realname' && (
          <div className="p-4">
            <FieldQueries fields={realnameData.queryFields} values={workerQuery} onChange={updateQuery} />
            {activeTab === 'worker' ? (
              <SimpleTable
                headers={['姓名', '身份证号', '工种', '班组', '所属企业', '当前项目', '在场状态', '来源', '操作']}
                rows={filteredWorkers.map((item) => [<b key="name">{item.name}</b>, item.idCard, item.job, item.team, item.company, item.project, <Badge key="status" tone={item.status === '在场' ? 'green' : 'gray'}>{item.status}</Badge>, <Badge key="source">实名制系统</Badge>, <button key="view" className="text-primary" onClick={() => setSelectedWorker(item)}>查看详情</button>])}
              />
            ) : <SimpleTable headers={realnameData.headers} rows={filteredRealnameRows} />}
          </div>
        )}

        {activeMeta.group === 'manual' && (
          <div className="p-4">
             <div className="mb-3 flex flex-wrap gap-2">
               <button className="flex items-center gap-2 rounded border border-border-gray px-4 py-2 text-text-dark hover:border-primary hover:text-primary" onClick={openAddManual}><Plus className="h-4 w-4" /> 新增{currentManualMeta.type}</button>
               <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white hover:bg-primary-hover" onClick={openBatchUpload}><Upload className="h-4 w-4" /> AI智能采集</button>
             </div>
             <ManualQueries values={manualQuery} onChange={updateManualQuery} onlyPending={pendingOnly[activeTab]} pendingCount={activePendingCount} onTogglePending={() => setPendingOnly((prev) => ({ ...prev, [activeTab]: !prev[activeTab] }))} />
             <SimpleTable headers={manualTable.headers} rows={filteredManualRows.map((item) => [...manualTable.values(item), <Badge key="source" tone={item.source === 'AI识别' ? 'blue' : 'green'}>{item.source}</Badge>, <StatusBadge key="reviewStatus" status={item.reviewStatus} />, <AttachmentLink key="attachment" attachment={item.attachment} onClick={() => setPreviewAttachment(item.attachment)} />, item.remark || '-', <div key="actions" className="flex gap-3">{item.reviewStatus === '待确认' ? <button className="text-primary" onClick={() => openReview(item)}>核对确认</button> : <button className="text-primary" onClick={() => openEditManual(item)}>编辑</button>}<button className="text-danger-red" onClick={() => deleteManual(item)}>删除</button></div>])} />
           </div>
        )}
      </section>

      {selectedWorker && <Drawer title="实名制工人详情" onClose={() => setSelectedWorker(null)} width="560px"><InfoLine label="姓名" value={selectedWorker.name} /><InfoLine label="身份证号" value={selectedWorker.idCard} /><InfoLine label="性别/年龄" value={`${selectedWorker.gender} / ${selectedWorker.age}岁`} /><InfoLine label="联系方式" value={selectedWorker.phone} /><InfoLine label="学历" value={selectedWorker.education} /><InfoLine label="企业/班组" value={`${selectedWorker.company} / ${selectedWorker.team}`} /><InfoLine label="工种/项目" value={`${selectedWorker.job} / ${selectedWorker.project}`} /></Drawer>}

      {manualDrawerOpen && <Drawer title={`${editingManualId ? '编辑' : '新增'}${editingManualMeta.label}`} onClose={() => setManualDrawerOpen(false)}><WorkerSelect value={manualForm.worker} idCard={manualForm.idCard} onChange={updateManualWorker} /><FormSelect label="所属项目" value={manualForm.project} onChange={(v) => setManualForm({ ...manualForm, project: v })} options={projects} required /><FormInput label="发生日期" type="date" value={manualForm.date} onChange={(v) => setManualForm({ ...manualForm, date: v })} required /><DynamicFormFields tab={editingManualTab} form={manualForm} setForm={setManualForm} /><FormInput label="附件名称" value={manualForm.attachment} onChange={(v) => setManualForm({ ...manualForm, attachment: v })} /><FormTextarea label="备注" value={manualForm.remark} onChange={(v) => setManualForm({ ...manualForm, remark: v })} /><div className="flex justify-end gap-2"><button className="rounded border border-border-gray px-4 py-2" onClick={() => setManualDrawerOpen(false)}>取消</button><button className="rounded bg-primary px-4 py-2 text-white" onClick={saveManual}>保存</button></div></Drawer>}

      {previewAttachment && <AttachmentPreviewModal attachment={previewAttachment} onClose={() => setPreviewAttachment(null)} />}
      {reviewRecord && <ReviewModal record={reviewRecord} onChange={setReviewRecord} onClose={() => setReviewRecord(null)} onConfirm={confirmReview} />}
      {batchState && <AiBatchDrawer state={batchState} onClose={closeBatchUpload} onAddFiles={addBatchFiles} onStart={startBatchRecognition} onComplete={openBatchCompletionConfirm} onRemoveFile={(id) => setBatchState((prev) => ({ ...prev, files: prev.files.filter((item) => item.id !== id) }))} />}
      {batchConfirmOpen && batchState && <BatchCompletionModal state={batchState} onClose={() => setBatchConfirmOpen(false)} onConfirm={confirmBatchCompletion} />}
    </div>
  )
}

function UnderlineTab({ active, onClick, children }) {
  return <button type="button" onClick={onClick} className={`relative min-h-[48px] whitespace-nowrap border-b-2 px-4 py-3 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${active ? 'border-primary font-medium text-primary' : 'border-transparent text-text-dark hover:border-primary/30 hover:text-primary'}`}>{children}</button>
}

function AiBatchDrawer({ state, onClose, onAddFiles, onStart, onComplete, onRemoveFile }) {
  const canStart = state.files.some((item) => item.status === 'ready')
  const isRecognizing = state.status === 'recognizing'
  const successFiles = state.files.filter((item) => item.status === 'success' || item.status === 'partial')
  const failedFiles = state.files.filter((item) => item.status === 'failed' || item.status === 'invalid')

  return <Drawer title={`AI智能采集-${state.type}`} onClose={isRecognizing ? undefined : onClose} width="860px">
    <div className="rounded border border-primary/30 bg-[#F6FAFF] p-3 text-sm"><div className="font-medium text-text-dark">当前识别类型：{state.type}</div></div>
    {(state.status === 'idle' || state.status === 'completed') && <label className="block cursor-pointer rounded border border-dashed border-primary bg-[#F6FAFF] p-4 text-center hover:bg-[#EFF7FF]"><div className="text-base font-semibold">拖拽或选择多个附件</div><div className="mt-1 text-sm text-text-secondary">支持 PDF、Word、PNG；单个文件不超过20MB，总文件大小不超过100MB</div><span className="mt-3 inline-flex rounded bg-primary px-4 py-2 text-white">选择文件</span><input type="file" multiple accept={supportedExtensions.join(',')} className="hidden" onChange={(event) => onAddFiles(event.target.files)} /></label>}
    {state.status !== 'completed' && state.files.length > 0 && <div className="rounded border border-border-gray"><div className="border-b border-border-gray px-4 py-3 font-medium">文件队列（{state.files.length}）</div><div className="divide-y divide-border-gray">{state.files.map((file) => <div key={file.id} className="flex min-w-0 items-center gap-3 px-4 py-2.5 text-sm"><div className="min-w-0 flex-1 truncate font-medium" title={file.name}>{file.name}</div><span className="shrink-0 text-xs text-text-secondary">{formatFileSize(file.size)}</span><BatchFileStatus status={file.status} error={file.error} warning={file.warning} />{(file.status === 'ready' || file.status === 'invalid') && <button className="shrink-0 text-danger-red" onClick={() => onRemoveFile(file.id)} aria-label={`移除${file.name}`}><X className="h-4 w-4" /></button>}</div>)}</div></div>}
    {state.status === 'recognizing' && <div className="flex items-center gap-3 rounded bg-[#F6FAFF] p-4 text-sm text-primary"><LoaderCircle className="h-5 w-5 animate-spin" />正在执行批量识别，请稍候……</div>}
    {state.status === 'completed' && <div className="grid gap-3 md:grid-cols-2"><BatchResultCard title="识别失败" files={failedFiles} tone="red" /><BatchResultCard title="识别成功" files={successFiles} tone="green" /></div>}
    <div className="flex justify-end gap-2">{!isRecognizing && state.status !== 'completed' && <button className="rounded border border-border-gray px-4 py-2" onClick={onClose}>取消</button>}{state.status !== 'completed' && <button className="rounded bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={!canStart || isRecognizing} onClick={onStart}>{isRecognizing ? '识别中…' : '开始识别'}</button>}{state.status === 'completed' && <button className="rounded bg-primary px-4 py-2 text-white" onClick={onComplete}>完成</button>}</div>
  </Drawer>
}

function BatchResultCard({ title, files, tone }) {
  const isSuccess = tone === 'green'
  return <div className={`overflow-hidden rounded border ${isSuccess ? 'border-success-green/30' : 'border-danger-red/30'}`}><div className={`flex items-center justify-between px-4 py-3 font-medium ${isSuccess ? 'bg-[#F6FFED] text-success-green' : 'bg-[#FFF1F0] text-danger-red'}`}><span>{title}</span><Badge tone={isSuccess ? 'green' : 'red'}>{files.length}</Badge></div>{files.length > 0 ? <div className="divide-y divide-border-gray">{files.map((file) => <div key={file.id} className="flex min-w-0 items-center gap-3 px-4 py-2.5 text-sm"><span className="min-w-0 flex-1 truncate" title={file.name}>{file.name}</span><Badge tone={isSuccess && file.status === 'partial' ? 'orange' : isSuccess ? 'green' : 'red'}>{isSuccess ? (file.status === 'partial' ? '需重点核对' : '识别成功') : (file.error || '识别失败')}</Badge></div>)}</div> : <div className="px-4 py-6 text-center text-sm text-text-secondary">-</div>}</div>
}

function BatchCompletionModal({ state, onClose, onConfirm }) {
  const successCount = state.files.filter((item) => item.status === 'success' || item.status === 'partial').length
  const failedCount = state.files.filter((item) => item.status === 'failed' || item.status === 'invalid').length
  return <CenterModal title="确认识别结果" onClose={onClose} width="520px" footer={<><button className="rounded border border-border-gray px-4 py-2" onClick={onClose}>取消</button><button className="rounded bg-primary px-4 py-2 text-white" onClick={onConfirm}>确认</button></>}><div className="space-y-4 p-5"><div className="text-sm leading-6 text-text-dark">成功识别的文件将自动生成待确认数据，失败文件可以重新上传处理或者手动录入。</div><div className="flex gap-5 text-sm text-text-secondary"><span>识别成功：{successCount} 个</span><span>识别失败：{failedCount} 个</span></div></div></CenterModal>
}

function BatchFileStatus({ status, error, warning }) {
  const config = { ready: { tone: 'gray', label: '待识别' }, invalid: { tone: 'red', label: error || '文件无效' }, recognizing: { tone: 'blue', label: '识别中' }, success: { tone: 'green', label: '已进入待确认' }, partial: { tone: 'orange', label: warning || '需重点核对' }, failed: { tone: 'red', label: error || '识别失败' } }
  const current = config[status] || config.ready
  return <Badge tone={current.tone}>{status === 'recognizing' && <LoaderCircle className="mr-1 inline h-3 w-3 animate-spin" />}{current.label}</Badge>
}

function StatusBadge({ status = '无需确认' }) {
  const tone = status === '待确认' ? 'orange' : status === '已确认' ? 'green' : 'gray'
  return <Badge tone={tone}>{status}</Badge>
}

function AttachmentLink({ attachment, onClick }) {
  const meta = normalizeAttachment(attachment)
  if (!meta) return <span className="text-text-secondary">-</span>
  return <button type="button" className="max-w-[190px] truncate text-left text-primary hover:underline" title={`预览${meta.name}`} onClick={onClick}>{meta.name}</button>
}

function AttachmentPreviewModal({ attachment, onClose }) {
  const meta = normalizeAttachment(attachment)
  return <CenterModal title={meta?.name || '附件预览'} onClose={onClose} width="900px" footer={<button className="rounded bg-primary px-4 py-2 text-white" onClick={onClose}>关闭</button>}><AttachmentPreview attachment={attachment} /></CenterModal>
}

function ReviewModal({ record, onChange, onClose, onConfirm }) {
  const tab = record.reviewTab || manualTabs.find((item) => item.type === record.type)?.key || 'health'
  return <CenterModal title={`核对${manualTabs.find((item) => item.key === tab)?.label || '业务记录'}`} onClose={onClose} width="1240px" footer={<><button className="rounded border border-border-gray px-4 py-2" onClick={onClose}>取消</button><button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white" onClick={() => onConfirm(record)}><Check className="h-4 w-4" />确认</button></>}>
    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[minmax(380px,0.9fr)_minmax(460px,1.1fr)]">
      <div className="space-y-4 border-b border-border-gray p-5 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between"><div className="font-semibold">表单编辑</div><StatusBadge status={record.reviewStatus} /></div>
        <InfoLine label="识别来源" value={record.source || 'AI识别'} />
        <WorkerSelect value={record.worker} idCard={record.idCard} onChange={(name) => updateReviewWorker(name, record, onChange)} />
        <FormSelect label="所属项目" value={record.project} onChange={(value) => onChange({ ...record, project: value })} options={projects} required />
        <FormInput label="发生日期" type="date" value={record.date} onChange={(value) => onChange({ ...record, date: value })} required />
        <ReviewDynamicFields record={record} setRecord={onChange} tab={tab} />
        {record.warning && <div className="rounded border border-warning-orange/30 bg-[#FFF7E6] p-3 text-sm text-warning-orange">识别提示：{record.warning}</div>}
      </div>
      <div className="min-h-[520px] bg-[#F6F8FA] p-5"><div className="mb-3 font-semibold">附件预览</div><AttachmentPreview attachment={record.attachment} /></div>
    </div>
  </CenterModal>
}

function CenterModal({ title, onClose, children, footer, width = '900px' }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"><div className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-lg bg-white shadow-2xl" style={{ maxWidth: width }}><div className="flex shrink-0 items-center justify-between border-b border-border-gray px-5 py-4"><div className="font-bold">{title}</div><button type="button" onClick={onClose} aria-label="关闭"><X className="h-5 w-5" /></button></div>{children}<div className="flex shrink-0 justify-end gap-2 border-t border-border-gray bg-white px-5 py-4">{footer}</div></div></div>
}

function AttachmentPreview({ attachment }) {
  const meta = normalizeAttachment(attachment)
  if (!meta) return <div className="flex h-[520px] items-center justify-center rounded border border-dashed border-border-gray bg-white text-text-secondary">暂无附件</div>
  if (meta.previewUrl && meta.mimeType.startsWith('image/')) return <div className="flex min-h-[520px] items-center justify-center rounded border border-border-gray bg-white p-4"><img src={meta.previewUrl} alt={meta.name} className="max-h-[500px] max-w-full object-contain" /></div>
  if (meta.previewUrl && meta.mimeType === 'application/pdf') return <iframe title={meta.name} src={meta.previewUrl} className="h-[520px] w-full rounded border border-border-gray bg-white" />
  return <div className="flex h-[520px] flex-col items-center justify-center rounded border border-dashed border-border-gray bg-white px-8 text-center"><div className="text-base font-semibold text-text-dark">{meta.name}</div><div className="mt-2 text-sm text-text-secondary">当前 Mock 数据未提供可嵌入的预览地址</div>{meta.downloadUrl && <a href={meta.downloadUrl} target="_blank" rel="noreferrer" className="mt-4 rounded border border-primary px-4 py-2 text-primary">下载附件</a>}</div>
}

function FieldQueries({ fields, values, onChange }) {
  return <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{fields.map((field) => <label key={field.key} className="text-sm"><span className="mb-1 block text-text-secondary">查询{field.label}</span><input className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values[field.key] || ''} onChange={(event) => onChange(field.key, event.target.value)} placeholder={`请输入${field.label}`} /></label>)}</div>
}

function ManualQueries({ values, onChange, onlyPending, pendingCount, onTogglePending }) {
  return <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
    <label className="text-sm"><span className="mb-1 block text-text-secondary">工人姓名</span><input className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values.worker || ''} onChange={(event) => onChange('worker', event.target.value)} placeholder="请输入工人姓名" /></label>
    <label className="text-sm"><span className="mb-1 block text-text-secondary">身份证号</span><input className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values.idCard || ''} onChange={(event) => onChange('idCard', event.target.value)} placeholder="请输入身份证号" /></label>
    <label className="text-sm"><span className="mb-1 block text-text-secondary">项目</span><input className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values.project || ''} onChange={(event) => onChange('project', event.target.value)} placeholder="请输入项目名称" /></label>
    <label className="text-sm"><span className="mb-1 block text-text-secondary">发生日期</span><span className="flex items-center gap-2"><input type="date" className="min-w-0 flex-1 rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values.dateStart || ''} onChange={(event) => onChange('dateStart', event.target.value)} /><span className="text-text-secondary">至</span><input type="date" className="min-w-0 flex-1 rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={values.dateEnd || ''} onChange={(event) => onChange('dateEnd', event.target.value)} /></span></label>
    <label className="flex h-[38px] cursor-pointer items-center gap-2 self-end px-2 text-sm text-text-dark">
      <input type="checkbox" checked={Boolean(onlyPending)} onChange={onTogglePending} className="h-4 w-4 accent-primary" />
      <span>仅看待确认</span>
      {pendingCount > 0 && <span className="rounded-full bg-warning-orange px-1.5 py-0.5 text-xs text-white">{pendingCount}</span>}
    </label>
  </div>
}

function WorkerSelect({ value, idCard, onChange }) {
  return <div className="grid gap-4 md:grid-cols-2"><label className="block text-sm"><span className="mb-1 block text-text-secondary"><span className="mr-1 text-danger-red">*</span>工人</span><input list="worker-options" className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={value} onChange={(event) => onChange(event.target.value)} placeholder="输入姓名或身份证号检索" /><datalist id="worker-options">{workers.map((item) => <option key={item.id} value={item.name}>{item.idCard}</option>)}</datalist></label><label className="block text-sm"><span className="mb-1 block text-text-secondary">身份证号</span><input className="w-full rounded border border-border-gray bg-[#FAFAFA] px-3 py-2" value={idCard} readOnly /></label></div>
}

function DynamicFormFields({ tab, form, setForm }) {
  return <>{schemas[tab].map((field) => field.type === 'select' ? <FormSelect key={field.key} label={field.label} value={form[field.key] || ''} onChange={(v) => setForm({ ...form, [field.key]: v })} options={field.options} required={field.required} /> : <FormInput key={field.key} label={field.label} value={form[field.key] || ''} onChange={(v) => setForm({ ...form, [field.key]: v })} required={field.required} />)}</>
}

function ReviewDynamicFields({ record, setRecord, tab }) {
  return <>{schemas[tab].map((field) => field.type === 'select' ? <FormSelect key={field.key} label={field.label} value={record[field.key] || ''} onChange={(v) => setRecord({ ...record, [field.key]: v })} options={field.options} required={field.required} /> : <FormInput key={field.key} label={field.label} value={record[field.key] || ''} onChange={(v) => setRecord({ ...record, [field.key]: v })} required={field.required} />)}</>
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
function updateReviewWorker(name, record, setter) { const worker = workers.find((item) => item.name === name); setter({ ...record, worker: name, idCard: worker?.idCard || record.idCard }) }
function defaultFields(tab) { return Object.fromEntries(schemas[tab].map((field) => [field.key, field.options?.[0] || ''])) }
function getManualTableConfig(tab) {
  const common = ['工人姓名', '身份证号', '项目', '发生日期']
  const configs = {
    health: { headers: [...common, '体检结果', '是否合格', '来源', '状态', '附件', '备注', '操作'], values: (item) => [item.worker, item.idCard, item.project, item.date, item.healthResult || '-', item.qualified || '-'] },
    reward: { headers: [...common, '奖励事项', '奖励内容', '来源', '状态', '附件', '备注', '操作'], values: (item) => [item.worker, item.idCard, item.project, item.date, item.rewardItem || '-', item.rewardContent || '-'] },
    punish: { headers: [...common, '处罚事项', '处罚内容', '来源', '状态', '附件', '备注', '操作'], values: (item) => [item.worker, item.idCard, item.project, item.date, item.punishItem || '-', item.punishContent || '-'] },
    cert: { headers: [...common, '证书类别', '证书名称', '来源', '状态', '附件', '备注', '操作'], values: (item) => [item.worker, item.idCard, item.project, item.date, item.certCategory || '-', item.certName || '-'] },
    laborDispute: { headers: [...common, '纠纷事项', '来源', '状态', '附件', '备注', '操作'], values: (item) => [item.worker, item.idCard, item.project, item.date, item.disputeItem || '-'] }
  }
  return configs[tab]
}
function aiFields(type, worker) { const tab = manualTabs.find((item) => item.type === type)?.key || 'health'; return { ...defaultFields(tab), ...(tab === 'health' ? { healthResult: '体检结论合格，无职业禁忌', qualified: '是' } : {}), ...(tab === 'reward' ? { rewardContent: '项目级表彰' } : {}), ...(tab === 'punish' ? { punishContent: '完成整改并复查' } : {}), ...(tab === 'cert' ? { certName: `${worker.job}技能证书` } : {}), ...(tab === 'laborDispute' ? { disputeItem: '劳务结算争议' } : {}) } }
function matchWorkerByFileName(fileName) { return fileName.includes('王') ? workers[2] : fileName.includes('李') ? workers[1] : workers[0] }
function isSupportedFile(fileName) { return supportedExtensions.some((extension) => fileName.toLowerCase().endsWith(extension)) }
function formatFileSize(size) { if (!size) return '大小未知'; if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`; return `${(size / 1024 / 1024).toFixed(1)} MB` }
function createAttachmentMeta(file) {
  const mimeType = file.file?.type || inferMimeType(file.name)
  const previewUrl = file.file && typeof URL !== 'undefined' ? URL.createObjectURL(file.file) : ''
  return { name: file.name, mimeType, previewUrl, downloadUrl: previewUrl }
}
function normalizeAttachment(attachment) {
  if (!attachment) return null
  if (typeof attachment === 'string') return { name: attachment, mimeType: inferMimeType(attachment), previewUrl: '', downloadUrl: '' }
  return { name: attachment.name || '附件', mimeType: attachment.mimeType || inferMimeType(attachment.name || ''), previewUrl: attachment.previewUrl || '', downloadUrl: attachment.downloadUrl || '' }
}
function attachmentName(attachment) { return normalizeAttachment(attachment)?.name || '' }
function inferMimeType(fileName = '') {
  const name = fileName.toLowerCase()
  if (name.endsWith('.pdf')) return 'application/pdf'
  if (name.endsWith('.png')) return 'image/png'
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg'
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'application/msword'
  return 'application/octet-stream'
}
function companiesForTable() { return [{ company: '中建一局集团', creditCode: '91110000****1234', type: '总包单位', contact: '刘经理', count: 856 }, { company: '中铁十一局', creditCode: '91420000****5678', type: '专业分包', contact: '周经理', count: 312 }, { company: '上海建工集团', creditCode: '91310000****9012', type: '专业分包', contact: '陈经理', count: 97 }] }
