import { useMemo, useState } from 'react'
import { Award, CheckCircle2, Play } from 'lucide-react'
import {
  Drawer,
  FormInput,
  FormSelect,
  FormTextarea,
  Grade,
  projects,
  Tab
} from './mvpShared'

const dimensionOptions = ['职业资质', '履约能力', '安全行为', '工作效率', '信用记录']

const initialWeights = {
  职业资质: 25,
  履约能力: 25,
  安全行为: 25,
  工作效率: 15,
  信用记录: 10
}
let savedWeightConfig = { ...initialWeights }

const initialLevels = [
  { level: 'A', min: 90, max: 100, desc: '优秀工人', color: '#52C41A' },
  { level: 'B', min: 80, max: 89.99, desc: '良好工人', color: '#2196F3' },
  { level: 'C', min: 60, max: 79.99, desc: '合格工人', color: '#FA8C16' },
  { level: 'D', min: 0, max: 59.99, desc: '重点关注', color: '#F5222D' }
]

export default function MvpModelCenter({ triggerNotification, activeTab, embedded = false }) {
  const [tab, setTab] = useState(activeTab || 'weight')
  const [weights, setWeights] = useState(() => ({ ...savedWeightConfig }))
  const [savedWeights, setSavedWeights] = useState(() => ({ ...savedWeightConfig }))
  const [levels, setLevels] = useState(initialLevels)
  const [levelForm, setLevelForm] = useState(null)
  const [runForm, setRunForm] = useState({ scope: '指定项目', project: projects[0], executionDate: today(), remark: '课题验收演示执行' })
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [executionRecords, setExecutionRecords] = useState([])

  const totalWeight = useMemo(() => Object.values(weights).reduce((sum, value) => sum + Number(value), 0), [weights])
  const hasWeightChanges = useMemo(() => dimensionOptions.some((dimension) => weights[dimension] !== savedWeights[dimension]), [weights, savedWeights])

  const saveWeights = () => {
    if (totalWeight !== 100) {
      triggerNotification('五个维度权重之和必须等于100%，请调整后再保存', 'warning')
      return
    }
    savedWeightConfig = { ...weights }
    setSavedWeights({ ...weights })
    triggerNotification('维度权重配置已保存')
  }

  const saveLevel = () => {
    setLevels((prev) => prev.map((item) => (item.level === levelForm.level ? levelForm : item)))
    setLevelForm(null)
    triggerNotification('等级配置已保存')
  }

  const runModel = () => {
    if (hasWeightChanges) {
      triggerNotification('维度权重存在未保存修改，请先保存权重配置', 'warning')
      return
    }
    if (totalWeight !== 100) {
      triggerNotification('五个维度权重之和必须等于100%', 'warning')
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
        setResult({
          total: 286,
          success: 281,
          failed: 5,
          tagExecution: { total: 281, success: 281, failed: 0 },
          distribution: { A: 38, B: 156, C: 78, D: 9 },
          sample: {
            name: '张建国',
            dimensions: { 职业资质: 92, 履约能力: 96, 安全行为: 95, 工作效率: 91, 信用记录: 97 },
            score: 94,
            grade: 'A'
          }
        })
        const executedAt = new Date().toLocaleString('zh-CN', { hour12: false })
        setExecutionRecords((prev) => [{
          id: `RUN-${Date.now()}`,
          executionDate: runForm.executionDate,
          scope: runForm.scope,
          project: runForm.project,
          executedAt,
          operator: '当前用户',
          status: '成功',
          total: 286,
          success: 281,
          failed: 5,
          tagSuccess: 281,
          tagFailed: 0
        }, ...prev])
        triggerNotification('评价模型执行完成，画像与标签已更新')
      }
    }, 300)
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded border border-border-gray bg-white shadow-sm">
        {!embedded && <div className="flex flex-wrap gap-2 border-b border-border-gray p-4">
          <Tab active={tab === 'weight'} onClick={() => setTab('weight')}>维度权重</Tab>
          <Tab active={tab === 'level'} onClick={() => setTab('level')}>等级配置</Tab>
          <Tab active={tab === 'run'} onClick={() => setTab('run')}>模型执行</Tab>
          <Tab active={tab === 'records'} onClick={() => setTab('records')}>执行记录</Tab>
        </div>}

        {tab === 'weight' && (
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              {dimensionOptions.map((dimension) => (
                <div key={dimension} className="rounded border border-border-gray p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">{dimension}</span>
                    <span className="font-bold text-primary">{weights[dimension]}%</span>
                  </div>
                  <input
                    className="w-full"
                    type="range"
                    min="0"
                    max="60"
                    value={weights[dimension]}
                    onChange={(event) => setWeights((prev) => ({ ...prev, [dimension]: Number(event.target.value) }))}
                  />
                </div>
              ))}
            </div>
            <div className="rounded border border-border-gray p-5">
              <div className="mb-4 font-bold">权重校验</div>
              <div className={`text-4xl font-bold ${totalWeight === 100 ? 'text-success-green' : 'text-danger-red'}`}>{totalWeight}%</div>
              <div className="mt-2 text-sm text-text-secondary">{totalWeight === 100 ? '当前权重可用于模型执行' : '权重合计必须等于100%才可执行'}</div>
              <div className={`mt-4 rounded px-3 py-2 text-sm ${hasWeightChanges ? 'bg-[#FFF7E6] text-warning-orange' : 'bg-[#F6FFED] text-success-green'}`}>
                {hasWeightChanges ? '存在未保存修改，保存后正式生效' : '当前权重配置已保存'}
              </div>
              <button type="button" disabled={!hasWeightChanges} onClick={saveWeights} className="mt-4 w-full rounded bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50">
                保存权重配置
              </button>
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
                <div className="mt-1 text-sm text-text-secondary">{item.min} - {item.max} 分</div>
                <button className="mt-4 text-sm text-primary" onClick={() => setLevelForm(item)}>
                  编辑等级
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'run' && (
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_430px]">
            <div className="rounded border border-border-gray p-5">
              <div className="mb-4 text-lg font-bold">手动执行评价模型</div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormSelect label="评价范围" value={runForm.scope} onChange={(v) => setRunForm({ ...runForm, scope: v })} options={['全部项目', '指定项目']} />
                <FormSelect label="所属项目" value={runForm.project} onChange={(v) => setRunForm({ ...runForm, project: v })} options={projects} />
                <FormInput label="手动执行日期" type="date" value={runForm.executionDate} onChange={(v) => setRunForm({ ...runForm, executionDate: v })} />
              </div>
              <FormTextarea label="执行说明" value={runForm.remark} onChange={(v) => setRunForm({ ...runForm, remark: v })} />
              <button disabled={running} onClick={runModel} className="mt-4 flex items-center gap-2 rounded bg-primary px-5 py-2 text-white disabled:opacity-60">
                <Play className="h-4 w-4" /> {running ? '执行中...' : '开始评价'}
              </button>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm"><span>执行进度</span><span>{progress}%</span></div>
                <div className="h-3 rounded bg-[#EDF2F7]">
                  <div className="h-3 rounded bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
            <div className="rounded border border-border-gray p-5">
              <div className="mb-3 flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4 text-success-green" /> 执行结果</div>
              {result ? (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-3 gap-3">
                    <ResultBox label="评价人数" value={result.total} />
                    <ResultBox label="成功" value={result.success} />
                    <ResultBox label="失败" value={result.failed} tone="red" />
                  </div>
                  <div className="rounded bg-[#F6FAFF] p-4"><div className="mb-2 font-semibold">标签规则执行</div><div className="grid grid-cols-3 gap-3"><ResultBox label="处理人数" value={result.tagExecution.total} /><ResultBox label="成功" value={result.tagExecution.success} /><ResultBox label="失败" value={result.tagExecution.failed} tone="red" /></div></div>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(result.distribution).map(([grade, count]) => (
                      <div key={grade} className="rounded bg-[#FAFAFA] p-3 text-center">
                        <Grade grade={grade} />
                        <div className="mt-2 font-bold">{count}人</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded bg-[#FAFAFA] text-text-secondary">执行后展示评价人数、等级分布和执行结果</div>
              )}
            </div>
          </div>
        )}

        {tab === 'records' && (
          <div className="p-4">
            <div className="mb-4 text-sm text-text-secondary">记录每次手动执行评价模型的范围、日期和处理结果。</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead><tr className="border-b border-border-gray text-text-secondary"><th className="px-3 py-3">执行批次号</th><th className="px-3 py-3">手动执行日期</th><th className="px-3 py-3">评价范围</th><th className="px-3 py-3">所属项目</th><th className="px-3 py-3">执行人</th><th className="px-3 py-3">执行时间</th><th className="px-3 py-3">执行状态</th><th className="px-3 py-3">评价人数</th><th className="px-3 py-3">评价成功</th><th className="px-3 py-3">评价失败</th><th className="px-3 py-3">标签成功</th><th className="px-3 py-3">标签失败</th></tr></thead>
                <tbody>{executionRecords.length ? executionRecords.map((record) => <tr key={record.id} className="border-b border-border-gray"><td className="px-3 py-3 font-medium">{record.id}</td><td className="px-3 py-3">{record.executionDate}</td><td className="px-3 py-3">{record.scope}</td><td className="px-3 py-3">{record.project}</td><td className="px-3 py-3">{record.operator}</td><td className="px-3 py-3">{record.executedAt}</td><td className="px-3 py-3 text-success-green">{record.status}</td><td className="px-3 py-3">{record.total}</td><td className="px-3 py-3">{record.success}</td><td className="px-3 py-3">{record.failed}</td><td className="px-3 py-3">{record.tagSuccess}</td><td className="px-3 py-3">{record.tagFailed}</td></tr>) : <tr><td colSpan="12" className="px-3 py-16 text-center text-text-secondary">暂无手动执行记录</td></tr>}</tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {levelForm && (
        <Drawer title={`编辑${levelForm.level}级规则`} onClose={() => setLevelForm(null)}>
          <FormInput label="等级名称" value={levelForm.level} onChange={(v) => setLevelForm({ ...levelForm, level: v })} />
          <FormInput label="最低分" type="number" value={levelForm.min} onChange={(v) => setLevelForm({ ...levelForm, min: v })} />
          <FormInput label="最高分" type="number" value={levelForm.max} onChange={(v) => setLevelForm({ ...levelForm, max: v })} />
          <FormInput label="等级说明" value={levelForm.desc} onChange={(v) => setLevelForm({ ...levelForm, desc: v })} />
          <label className="block text-sm"><span className="mb-1 block text-text-secondary">展示颜色</span><div className="flex items-center gap-3"><input className="h-10 w-16 cursor-pointer rounded border border-border-gray p-1" type="color" value={levelForm.color} onChange={(event) => setLevelForm({ ...levelForm, color: event.target.value })} /><span className="text-sm text-text-secondary">{levelForm.color}</span></div></label>
          <div className="flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setLevelForm(null)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={saveLevel}>保存</button>
          </div>
        </Drawer>
      )}
    </div>
  )
}

function today() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function ResultBox({ label, value, tone = 'blue' }) {
  const color = tone === 'red' ? 'text-danger-red' : 'text-primary'
  return (
    <div className="rounded bg-[#FAFAFA] p-3">
      <div className="text-xs text-text-secondary">{label}</div>
      <div className={`mt-1 text-xl font-bold ${color}`}>{value}</div>
    </div>
  )
}
