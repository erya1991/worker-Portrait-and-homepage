import { useMemo, useState } from 'react'
import { CheckCircle2, Edit, FileText, Plus, Search, Sliders, X } from 'lucide-react'

const dimensions = [
  { name: '职业能力', desc: '技能证书、工种等级、项目经验', count: 4, color: '#2196F3' },
  { name: '履约能力', desc: '考勤、连续出勤、进退场履约', count: 4, color: '#52C41A' },
  { name: '安全能力', desc: '培训、违章、处罚、安全表彰', count: 5, color: '#FA8C16' },
  { name: '健康能力', desc: '体检结果、职业禁忌、健康状态', count: 3, color: '#13C2C2' },
  { name: '信用能力', desc: '投诉、欠薪纠纷、黑名单记录', count: 3, color: '#722ED1' }
]

const initialIndicators = [
  { id: 'I-001', name: '技能证书', dimension: '职业能力', source: 'AI采集/人工维护', algorithm: '加分项', enabled: true, desc: '持有有效技能证书可获得加分', baseScore: 0, score: 8, maxScore: 20, condition: '证书有效' },
  { id: 'I-002', name: '考勤率', dimension: '履约能力', source: '实名制系统', algorithm: '权重计分', enabled: true, desc: '按实名制考勤率参与履约能力评分', baseScore: 100, score: 25, maxScore: 25, condition: '月度考勤率' },
  { id: 'I-003', name: '安全之星', dimension: '安全能力', source: 'AI采集/人工维护', algorithm: '加分项', enabled: true, desc: '获得安全之星奖励进行加分', baseScore: 0, score: 10, maxScore: 20, condition: '获得安全之星' },
  { id: 'I-004', name: '违章处罚', dimension: '安全能力', source: 'AI采集/人工维护', algorithm: '扣分项', enabled: true, desc: '发生现场违章或处罚时扣分', baseScore: 0, score: 10, maxScore: 30, condition: '一般违章处罚' },
  { id: 'I-005', name: '体检合格', dimension: '健康能力', source: 'AI采集/人工维护', algorithm: '基准分', enabled: true, desc: '体检合格作为健康能力基础分', baseScore: 80, score: 0, maxScore: 100, condition: '体检结论合格' },
  { id: 'I-006', name: '信用投诉', dimension: '信用能力', source: '人工维护', algorithm: '扣分项', enabled: true, desc: '出现投诉或纠纷记录时扣分', baseScore: 0, score: 15, maxScore: 30, condition: '有效投诉记录' }
]

const algorithmExamples = {
  基准分: { title: '基准分', desc: '满足基础条件即可获得默认分值，适合体检合格、安全培训合格等指标。', fields: ['baseScore', 'maxScore'] },
  加分项: { title: '加分项', desc: '出现正向事实时加分，适合安全之星、技能证书、奖励记录。', fields: ['condition', 'score', 'maxScore'] },
  扣分项: { title: '扣分项', desc: '出现负向事实时扣分，适合违章处罚、投诉、异常退场。', fields: ['condition', 'score', 'maxScore'] },
  权重计分: { title: '权重计分', desc: '按比例参与维度计算，适合考勤率、培训通过率等连续型指标。', fields: ['condition', 'baseScore', 'score'] }
}

const emptyIndicator = {
  id: '',
  name: '',
  dimension: '职业能力',
  source: '实名制系统',
  algorithm: '基准分',
  enabled: true,
  desc: '',
  baseScore: 80,
  score: 10,
  maxScore: 20,
  condition: ''
}

export default function IndexCenter({ triggerNotification }) {
  const [tab, setTab] = useState('dimension')
  const [keyword, setKeyword] = useState('')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('基准分')
  const [indicators, setIndicators] = useState(initialIndicators)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [indicatorForm, setIndicatorForm] = useState(emptyIndicator)
  const [editingId, setEditingId] = useState(null)

  const filteredIndicators = useMemo(() => {
    return indicators.filter((item) => [item.id, item.name, item.dimension, item.source, item.algorithm].some((v) => v.includes(keyword)))
  }, [indicators, keyword])

  const currentAlg = algorithmExamples[selectedAlgorithm]

  const openAdd = () => {
    const nextId = `I-${String(indicators.length + 1).padStart(3, '0')}`
    setEditingId(null)
    setIndicatorForm({ ...emptyIndicator, id: nextId })
    setDrawerOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setIndicatorForm(item)
    setDrawerOpen(true)
  }

  const saveIndicator = () => {
    setIndicators((prev) => editingId ? prev.map((item) => (item.id === editingId ? indicatorForm : item)) : [indicatorForm, ...prev])
    setDrawerOpen(false)
    triggerNotification(editingId ? '评价指标已更新' : '评价指标已新增')
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat title="评价维度" value="5" desc="V1.0 固定五维" />
        <Stat title="评价指标" value={indicators.length} desc="先覆盖核心指标" />
        <Stat title="算法类型" value="4" desc="基准/加分/扣分/权重" />
        <Stat title="启用状态" value={`${indicators.filter((item) => item.enabled).length} 个启用`} desc="满足课题演示闭环" />
      </section>

      <section className="rounded border border-border-gray bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border-gray p-4">
          <Tab active={tab === 'dimension'} onClick={() => setTab('dimension')}>评价维度</Tab>
          <Tab active={tab === 'indicator'} onClick={() => setTab('indicator')}>指标管理</Tab>
          <Tab active={tab === 'algorithm'} onClick={() => setTab('algorithm')}>评分算法</Tab>
        </div>

        {tab === 'dimension' && (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-5">
            {dimensions.map((item) => (
              <div key={item.name} className="rounded border border-border-gray p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="rounded bg-[#F5F7FA] px-2 py-0.5 text-xs text-text-secondary">{item.count} 个指标</span>
                </div>
                <div className="text-lg font-bold">{item.name}</div>
                <div className="mt-2 min-h-10 text-sm text-text-secondary">{item.desc}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'indicator' && (
          <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex max-w-md items-center gap-2 rounded border border-border-gray px-3 py-2">
                <Search className="h-4 w-4 text-text-secondary" />
                <input className="w-full outline-none" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜索指标、维度、来源、算法" />
              </div>
              <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white" onClick={openAdd}>
                <Plus className="h-4 w-4" /> 新增指标
              </button>
            </div>
            <div className="overflow-auto rounded border border-border-gray">
              <table className="b-table">
                <thead>
                  <tr><th>指标编号</th><th>指标名称</th><th>所属维度</th><th>数据来源</th><th>算法类型</th><th>状态</th><th>操作</th></tr>
                </thead>
                <tbody>
                  {filteredIndicators.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td className="font-semibold">{item.name}</td>
                      <td>{item.dimension}</td>
                      <td>{item.source}</td>
                      <td><span className="rounded bg-[#E6F7FF] px-2 py-1 text-xs text-primary">{item.algorithm}</span></td>
                      <td><span className={`rounded px-2 py-1 text-xs ${item.enabled ? 'bg-[#F6FFED] text-success-green' : 'bg-[#F5F5F5] text-text-secondary'}`}>{item.enabled ? '启用' : '停用'}</span></td>
                      <td><button className="text-primary" onClick={() => openEdit(item)}><Edit className="inline h-4 w-4" /> 编辑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'algorithm' && (
          <div className="grid gap-4 p-4 lg:grid-cols-[280px_1fr]">
            <div className="space-y-2">
              {Object.keys(algorithmExamples).map((name) => (
                <button key={name} className={`flex w-full items-center gap-2 rounded border px-4 py-3 text-left ${selectedAlgorithm === name ? 'border-primary bg-[#E6F7FF] text-primary' : 'border-border-gray bg-white'}`} onClick={() => setSelectedAlgorithm(name)}>
                  <Sliders className="h-4 w-4" />
                  <span className="font-semibold">{name}</span>
                </button>
              ))}
            </div>
            <div className="rounded border border-border-gray p-5">
              <div className="mb-2 flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5 text-primary" /> {currentAlg.title}</div>
              <p className="mb-5 text-sm text-text-secondary">{currentAlg.desc}</p>
              <div className="grid gap-3 md:grid-cols-3">
                {currentAlg.fields.map((field) => <DemoField key={field} field={field} />)}
              </div>
              <div className="mt-5 rounded bg-[#F6FAFF] p-4 text-sm">
                <div className="mb-1 flex items-center gap-2 font-semibold text-primary"><CheckCircle2 className="h-4 w-4" /> 逻辑翻译</div>
                当前规则会按照“{currentAlg.title}”参与指标得分计算，保存后供评价模型执行时调用。
              </div>
            </div>
          </div>
        )}
      </section>

      {drawerOpen && (
        <Drawer title={`${editingId ? '编辑' : '新增'}评价指标`} onClose={() => setDrawerOpen(false)}>
          <FormInput label="指标编号" value={indicatorForm.id} onChange={(v) => setIndicatorForm({ ...indicatorForm, id: v })} />
          <FormInput label="指标名称" value={indicatorForm.name} onChange={(v) => setIndicatorForm({ ...indicatorForm, name: v })} />
          <FormSelect label="所属维度" value={indicatorForm.dimension} onChange={(v) => setIndicatorForm({ ...indicatorForm, dimension: v })} options={dimensions.map((item) => item.name)} />
          <FormSelect label="数据来源" value={indicatorForm.source} onChange={(v) => setIndicatorForm({ ...indicatorForm, source: v })} options={['实名制系统', 'AI采集/人工维护', '人工维护', '系统计算']} />
          <FormSelect label="算法类型" value={indicatorForm.algorithm} onChange={(v) => setIndicatorForm({ ...indicatorForm, algorithm: v })} options={Object.keys(algorithmExamples)} />
          <FormTextarea label="指标说明" value={indicatorForm.desc} onChange={(v) => setIndicatorForm({ ...indicatorForm, desc: v })} />
          <div className="rounded bg-[#F6FAFF] p-4">
            <div className="mb-3 font-semibold">算法参数</div>
            <div className="grid gap-3 md:grid-cols-2">
              <FormInput label="触发条件" value={indicatorForm.condition} onChange={(v) => setIndicatorForm({ ...indicatorForm, condition: v })} />
              <FormInput label="基础分" type="number" value={indicatorForm.baseScore} onChange={(v) => setIndicatorForm({ ...indicatorForm, baseScore: Number(v) })} />
              <FormInput label="加/扣/权重值" type="number" value={indicatorForm.score} onChange={(v) => setIndicatorForm({ ...indicatorForm, score: Number(v) })} />
              <FormInput label="上限/下限" type="number" value={indicatorForm.maxScore} onChange={(v) => setIndicatorForm({ ...indicatorForm, maxScore: Number(v) })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={indicatorForm.enabled} onChange={(e) => setIndicatorForm({ ...indicatorForm, enabled: e.target.checked })} />
            启用该指标
          </label>
          <div className="mt-5 flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setDrawerOpen(false)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={saveIndicator}>保存指标</button>
          </div>
        </Drawer>
      )}
    </div>
  )
}

function DemoField({ field }) {
  const labels = { baseScore: '默认分值', maxScore: '最高/最低限制', condition: '触发条件', score: '分值/权重' }
  return (
    <label className="text-sm">
      <span className="mb-1 block text-text-secondary">{labels[field]}</span>
      <input className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" placeholder={`请输入${labels[field]}`} />
    </label>
  )
}

function Stat({ title, value, desc }) {
  return (
    <div className="rounded border border-border-gray bg-white p-4 shadow-sm">
      <div className="text-sm text-text-secondary">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-text-secondary">{desc}</div>
    </div>
  )
}

function Tab({ active, onClick, children }) {
  return <button onClick={onClick} className={`rounded px-3 py-1.5 text-sm ${active ? 'bg-primary text-white' : 'bg-[#F5F7FA] text-text-dark'}`}>{children}</button>
}

function Drawer({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20">
      <div className="h-full w-[520px] overflow-y-auto bg-white shadow-xl">
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
      <textarea className="min-h-20 w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={value} onChange={(e) => onChange(e.target.value)} />
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
