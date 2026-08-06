import { useMemo, useState } from 'react'
import { Award, CheckCircle2, Cpu, Edit, Play, Sliders, X } from 'lucide-react'

const initialWeights = {
  职业能力: 30,
  履约能力: 25,
  安全能力: 20,
  健康能力: 10,
  信用能力: 15
}

const initialModel = {
  name: '建筑产业工人综合评价模型',
  version: 'V1.0',
  scope: '集团全部项目工人',
  status: '启用',
  desc: '用于课题验收版本的单一综合评价模型，打通数据采集、指标评分、维度加权、等级生成、标签更新和画像展示闭环。'
}

const initialLevels = [
  { level: 'A', min: 90, max: 100, desc: '优秀工人', color: '#52C41A' },
  { level: 'B', min: 80, max: 89, desc: '良好工人', color: '#2196F3' },
  { level: 'C', min: 70, max: 79, desc: '合格工人', color: '#FA8C16' },
  { level: 'D', min: 0, max: 69, desc: '重点关注', color: '#F5222D' }
]

export default function ModelCenter({ triggerNotification }) {
  const [tab, setTab] = useState('model')
  const [model, setModel] = useState(initialModel)
  const [modelForm, setModelForm] = useState(initialModel)
  const [modelDrawerOpen, setModelDrawerOpen] = useState(false)
  const [weights, setWeights] = useState(initialWeights)
  const [levels, setLevels] = useState(initialLevels)
  const [levelForm, setLevelForm] = useState(null)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const totalWeight = useMemo(() => Object.values(weights).reduce((sum, value) => sum + Number(value), 0), [weights])

  const updateWeight = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: Number(value) }))
  }

  const saveModel = () => {
    setModel(modelForm)
    setModelDrawerOpen(false)
    triggerNotification('模型配置已更新')
  }

  const saveLevel = () => {
    setLevels((prev) => prev.map((item) => (item.level === levelForm.level ? levelForm : item)))
    setLevelForm(null)
    triggerNotification('等级规则已更新')
  }

  const runModel = () => {
    if (totalWeight !== 100) {
      triggerNotification('维度权重合计必须等于100%', 'warning')
      return
    }
    setRunning(true)
    setResult(null)
    setProgress(0)
    let current = 0
    const timer = setInterval(() => {
      current += 20
      setProgress(current)
      if (current >= 100) {
        clearInterval(timer)
        setRunning(false)
        setResult({ total: 1265, success: 1258, failed: 7, score: 92, level: 'A' })
        triggerNotification('评价模型执行完成，画像和标签已更新')
      }
    }, 350)
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat title="当前模型" value={model.version} desc={model.name} />
        <Stat title="维度权重" value={`${totalWeight}%`} desc={totalWeight === 100 ? '配置有效' : '需要调整为100%'} />
        <Stat title="等级规则" value="A/B/C/D" desc="四级评价标准" />
        <Stat title="最近执行" value={result ? '刚刚' : '未执行'} desc="手动执行评价模型" />
      </section>

      <section className="rounded border border-border-gray bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border-gray p-4">
          <Tab active={tab === 'model'} onClick={() => setTab('model')}>模型配置</Tab>
          <Tab active={tab === 'weight'} onClick={() => setTab('weight')}>维度权重</Tab>
          <Tab active={tab === 'level'} onClick={() => setTab('level')}>等级配置</Tab>
          <Tab active={tab === 'run'} onClick={() => setTab('run')}>模型执行</Tab>
        </div>

        {tab === 'model' && (
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_360px]">
            <div className="rounded border border-border-gray p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-lg font-bold"><Cpu className="h-5 w-5 text-primary" /> {model.name}</div>
                <button className="rounded border border-border-gray px-3 py-1.5 text-sm text-primary" onClick={() => { setModelForm(model); setModelDrawerOpen(true) }}>
                  <Edit className="inline h-4 w-4" /> 编辑模型
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Info label="模型名称" value={model.name} />
                <Info label="模型版本" value={model.version} />
                <Info label="适用范围" value={model.scope} />
                <Info label="状态" value={model.status} />
              </div>
              <p className="mt-5 rounded bg-[#F6FAFF] p-4 text-sm text-text-secondary">{model.desc}</p>
            </div>
            <div className="rounded border border-border-gray p-5">
              <div className="mb-3 font-bold">计算流程</div>
              {['读取评价数据', '执行指标算法', '计算五维得分', '生成综合等级', '更新标签画像'].map((step, index) => (
                <div key={step} className="flex items-center gap-3 py-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">{index + 1}</div>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'weight' && (
          <div className="p-4">
            <div className="mb-4 rounded bg-[#FFF7E6] p-3 text-sm text-warning-orange">权重合计必须等于100%，否则不能执行模型。</div>
            <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
              <div className="space-y-4">
                {Object.entries(weights).map(([key, value]) => (
                  <div key={key} className="rounded border border-border-gray p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold">{key}</span>
                      <span className="font-bold text-primary">{value}%</span>
                    </div>
                    <input className="w-full" type="range" min="0" max="60" value={value} onChange={(e) => updateWeight(key, e.target.value)} />
                  </div>
                ))}
              </div>
              <div className="rounded border border-border-gray p-5">
                <div className="mb-4 flex items-center gap-2 font-bold"><Sliders className="h-4 w-4 text-primary" /> 权重汇总</div>
                <div className={`text-4xl font-bold ${totalWeight === 100 ? 'text-success-green' : 'text-danger-red'}`}>{totalWeight}%</div>
                <div className="mt-2 text-sm text-text-secondary">{totalWeight === 100 ? '当前权重配置可用于模型执行' : '请调整权重合计至100%'}</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'level' && (
          <div className="grid gap-4 p-4 md:grid-cols-4">
            {levels.map((item) => (
              <div key={item.level} className="rounded border border-border-gray p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-3xl font-bold" style={{ color: item.color }}>{item.level}</span>
                  <Award className="h-6 w-6" style={{ color: item.color }} />
                </div>
                <div className="font-semibold">{item.desc}</div>
                <div className="mt-1 text-sm text-text-secondary">{item.min}-{item.max} 分</div>
                <button className="mt-4 text-sm text-primary" onClick={() => setLevelForm(item)}><Edit className="inline h-4 w-4" /> 编辑等级</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'run' && (
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_380px]">
            <div className="rounded border border-border-gray p-5">
              <div className="mb-4 text-lg font-bold">立即执行评价</div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block text-text-secondary">执行项目</span>
                  <select className="w-full rounded border border-border-gray px-3 py-2">
                    <option>全部项目</option>
                    <option>北京CBD东区超高层项目</option>
                    <option>轨道交通18号线项目</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-text-secondary">执行范围</span>
                  <select className="w-full rounded border border-border-gray px-3 py-2">
                    <option>全部工人</option>
                    <option>在场工人</option>
                  </select>
                </label>
              </div>
              <button disabled={running} onClick={runModel} className="mt-5 flex items-center gap-2 rounded bg-primary px-5 py-2 text-white disabled:opacity-60">
                <Play className="h-4 w-4" /> {running ? '执行中...' : '开始执行'}
              </button>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm"><span>执行进度</span><span>{progress}%</span></div>
                <div className="h-3 rounded bg-[#EDF2F7]"><div className="h-3 rounded bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
              </div>
            </div>
            <div className="rounded border border-border-gray p-5">
              <div className="mb-3 flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4 text-success-green" /> 执行结果与AI解释</div>
              {result ? (
                <div className="space-y-3 text-sm">
                  <Info label="评价人数" value={`${result.total} 人`} />
                  <Info label="成功/失败" value={`${result.success} / ${result.failed}`} />
                  <Info label="示例得分" value={`${result.score} 分，${result.level}级`} />
                  <div className="rounded bg-[#F6FAFF] p-3">
                    AI解释：本次评价已根据五维权重计算综合评分，张建国因连续出勤、安全无处罚、技能证书完整，综合评价为A级，可作为重点培养对象。
                  </div>
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded bg-[#FAFAFA] text-text-secondary">执行后展示评价结果</div>
              )}
            </div>
          </div>
        )}
      </section>

      {modelDrawerOpen && (
        <Drawer title="编辑评价模型" onClose={() => setModelDrawerOpen(false)}>
          <FormInput label="模型名称" value={modelForm.name} onChange={(v) => setModelForm({ ...modelForm, name: v })} />
          <FormInput label="模型版本" value={modelForm.version} onChange={(v) => setModelForm({ ...modelForm, version: v })} />
          <FormInput label="适用范围" value={modelForm.scope} onChange={(v) => setModelForm({ ...modelForm, scope: v })} />
          <FormSelect label="状态" value={modelForm.status} onChange={(v) => setModelForm({ ...modelForm, status: v })} options={['启用', '停用']} />
          <FormTextarea label="模型说明" value={modelForm.desc} onChange={(v) => setModelForm({ ...modelForm, desc: v })} />
          <div className="mt-5 flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setModelDrawerOpen(false)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={saveModel}>保存模型</button>
          </div>
        </Drawer>
      )}

      {levelForm && (
        <Drawer title={`编辑${levelForm.level}级规则`} onClose={() => setLevelForm(null)}>
          <FormInput label="等级名称" value={levelForm.level} onChange={(v) => setLevelForm({ ...levelForm, level: v })} />
          <FormInput label="最低分" type="number" value={levelForm.min} onChange={(v) => setLevelForm({ ...levelForm, min: Number(v) })} />
          <FormInput label="最高分" type="number" value={levelForm.max} onChange={(v) => setLevelForm({ ...levelForm, max: Number(v) })} />
          <FormInput label="等级说明" value={levelForm.desc} onChange={(v) => setLevelForm({ ...levelForm, desc: v })} />
          <FormInput label="显示颜色" value={levelForm.color} onChange={(v) => setLevelForm({ ...levelForm, color: v })} />
          <div className="mt-5 flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setLevelForm(null)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={saveLevel}>保存等级</button>
          </div>
        </Drawer>
      )}
    </div>
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

function Info({ label, value }) {
  return <div><div className="text-xs text-text-secondary">{label}</div><div className="mt-1 font-semibold">{value}</div></div>
}

function Drawer({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20">
      <div className="h-full w-[500px] overflow-y-auto bg-white shadow-xl">
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
