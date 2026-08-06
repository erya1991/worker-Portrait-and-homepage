import { useMemo, useState } from 'react'
import { BarChart3, Camera, ClipboardCheck, FileSignature, Gauge, UsersRound } from 'lucide-react'
import { dashboardProjects, getDashboardOverview } from '../mock/dashboard'

const metricTones = {
  blue: 'bg-[#E6F7FF] text-primary',
  green: 'bg-[#F6FFED] text-success-green',
  indigo: 'bg-[#EEF0FF] text-[#4F46E5]',
  cyan: 'bg-[#E6FFFB] text-[#08979C]',
  purple: 'bg-[#F9F0FF] text-[#722ED1]'
}

function PanelTitle({ icon: Icon, title, desc }) {
  return <div className="dashboard-panel-title mb-3 flex items-start gap-2"><div className="rounded bg-[#F0F7FF] p-1.5 text-primary"><Icon className="h-4 w-4" /></div><div><div className="text-base font-bold leading-5">{title}</div>{desc && <div className="mt-1 text-xs text-text-secondary">{desc}</div>}</div></div>
}

function MetricCard({ icon: Icon, tone, title, value, suffix, desc }) {
  return <div className="min-w-0 rounded border border-border-gray bg-white p-3.5 shadow-sm"><div className="flex items-center justify-between gap-2"><span className="truncate text-sm text-text-secondary">{title}</span><span className={`rounded p-1.5 ${metricTones[tone]}`}><Icon className="h-4 w-4" /></span></div><div className="mt-2.5 flex items-baseline gap-1"><span className="text-2xl font-bold leading-none">{value}</span><span className="text-xs text-text-secondary">{suffix}</span></div><div className="mt-2.5 truncate text-xs text-text-secondary">{desc}</div></div>
}

function DataStat({ label, value, suffix = '', tone = 'text-text-dark' }) {
  return <div className="dashboard-stat rounded bg-[#F8FAFC] px-2.5 py-2"><div className={`dashboard-stat-value text-lg font-bold leading-5 ${tone}`}>{value}<span className="ml-0.5 text-[11px] font-normal text-text-secondary">{suffix}</span></div><div className="mt-1.5 text-xs text-text-secondary">{label}</div></div>
}

function ValueTrend({ items, color = '#1890FF', labelKey = 'date', className = 'h-[104px]' }) {
  const values = items.map((item) => item.value ?? item.present ?? 0)
  const max = Math.max(...values, 1)
  return <div className={`dashboard-chart flex items-stretch gap-1.5 border-b border-[#EEF2F6] pb-2 ${className}`}>{items.map((item, index) => { const value = values[index]; const label = item[labelKey] ?? item.date; return <div key={`${label}-${index}`} className="flex min-w-0 flex-1 flex-col items-center justify-end"><span className="text-[11px] font-medium text-text-dark">{value}</span><div className="mt-1 flex min-h-0 w-full flex-1 items-end justify-center"><span className="w-3/4 max-w-8 rounded-t" style={{ height: `${Math.max(12, value / max * 100)}%`, backgroundColor: color }} /></div><span className="mt-1.5 whitespace-nowrap text-[11px] text-text-secondary">{label}</span></div> })}</div>
}

function ProgressRow({ label, value, color = '#1890FF' }) {
  return <div className="flex items-center gap-2"><span className="w-16 text-xs text-text-secondary">{label}</span><div className="h-2 flex-1 overflow-hidden rounded bg-[#EEF2F6]"><div className="h-full rounded" style={{ width: `${value}%`, backgroundColor: color }} /></div><span className="w-6 text-right text-xs font-medium">{value}</span></div>
}

function DonutChart({ items, colors = ['#1890FF', '#13C2C2', '#722ED1', '#BFBFBF'], centerLabel = '在场', showCount = true }) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  let cursor = 0
  const segments = items.map((item, index) => {
    const start = cursor
    cursor += item.value / total * 100
    return `${colors[index % colors.length]} ${start}% ${cursor}%`
  }).join(', ')

  return <div className="dashboard-donut flex min-h-0 items-center gap-3 rounded bg-[#FBFCFE] px-2.5 py-2"><div className="dashboard-donut-ring relative flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${segments})` }}><div className="dashboard-donut-hole flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full bg-white"><span className="text-lg font-bold leading-5">{total}</span><span className="text-[11px] text-text-secondary">{centerLabel}</span></div></div><div className="dashboard-donut-legend min-w-0 flex-1 space-y-1.5">{items.map((item, index) => { const percent = Math.round(item.value / total * 100); return <div key={item.name} className="flex items-start gap-1.5 text-xs leading-4"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} /><span className="min-w-0 flex-1 break-words text-text-secondary">{item.name}</span>{showCount ? <span className="shrink-0 whitespace-nowrap font-medium">{item.value}人 · {percent}%</span> : <span className="shrink-0 font-medium">{percent}%</span>}</div> })}</div></div>
}

function GradePieChart({ grades }) {
  const total = grades.reduce((sum, item) => sum + item.value, 0)
  const colors = grades.map((item) => item.color)
  let cursor = 0
  const segments = grades.map((item, index) => {
    const start = cursor
    cursor += total ? item.value / total * 100 : 0
    return `${colors[index]} ${start}% ${cursor}%`
  }).join(', ')

  return <div className="dashboard-grade-pie relative h-[220px] w-full min-w-[360px]">
    <div className="absolute left-3 top-1/2 h-[188px] w-[188px] -translate-y-1/2 rounded-full shadow-inner" style={{ background: `conic-gradient(${segments})` }} />
    <div className="absolute left-[206px] top-[22px] flex w-[150px] flex-col gap-4">
      {grades.map((item) => <div key={item.label} className="relative flex min-h-[34px] items-center gap-2 text-xs">
        <span className="absolute -left-6 top-1/2 w-6 border-t border-[#CBD5E1]" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="flex-1 font-medium">{item.label}级</span>
        <span className="shrink-0 font-medium">{item.value}人</span>
        <span className="shrink-0 text-text-secondary">{total ? Math.round(item.value / total * 100) : 0}%</span>
      </div>)}
    </div>
    <div className="absolute bottom-0 left-5 text-xs text-text-secondary">已分级 {total} 人</div>
  </div>
}

function ContractStatus({ contracts }) {
  const items = [{ label: '签署完成', value: contracts.active, color: '#52C41A' }, { label: '签署中', value: contracts.signing, color: '#1890FF' }, { label: '初始', value: contracts.incomplete, color: '#FAAD14' }]
  const total = items.reduce((sum, item) => sum + item.value, 0)
  return <div className="rounded bg-[#FBFCFE] p-2.5"><div className="mb-2 flex items-center justify-between text-xs"><span className="font-medium">合同状态分布</span><span className="text-text-secondary">有效统计 {total} 份</span></div><div className="flex h-2.5 overflow-hidden rounded bg-[#EEF2F6]">{items.map((item) => <span key={item.label} style={{ width: `${item.value / total * 100}%`, backgroundColor: item.color }} />)}</div><div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-text-secondary">{items.map((item) => <div key={item.label} className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.label} {item.value}</div>)}</div></div>
}

export default function HomeDashboard() {
  const [projectId, setProjectId] = useState('P001')
  const data = useMemo(() => getDashboardOverview(projectId), [projectId])
  const { overview, evaluation } = data
  const gradeTotal = evaluation.grades.reduce((total, item) => total + item.value, 0)
  const gradeA = evaluation.grades.find((item) => item.label === 'A')?.value || 0
  const aRate = gradeTotal ? Math.round(gradeA / gradeTotal * 1000) / 10 : 0
  const aiTotal = overview.ai.matched + overview.ai.stranger
  const aiMatchRate = aiTotal ? Math.round(overview.ai.matched / aiTotal * 1000) / 10 : 0
  const todayAiCount = data.aiTrend[data.aiTrend.length - 1]?.value || 0

  return <div className="dashboard-layout grid h-full min-h-[650px] grid-rows-[52px_104px_270px_minmax(0,1fr)] gap-3 overflow-hidden">
    <section className="flex min-w-0 items-center justify-between gap-3 rounded border border-border-gray bg-white px-4 shadow-sm"><div className="text-lg font-bold">首页看板</div><select aria-label="选择项目" value={projectId} onChange={(event) => setProjectId(event.target.value)} className="max-w-[260px] rounded border border-border-gray bg-white px-2.5 py-1.5 text-sm outline-none focus:border-primary">{dashboardProjects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></section>

    <section className="grid min-w-0 grid-cols-3 gap-3 xl:grid-cols-6"><MetricCard icon={UsersRound} tone="blue" title="在场人员" value={overview.workers.onSite} suffix="人" desc={`${overview.workers.teamCount} 个班组`} /><MetricCard icon={ClipboardCheck} tone="green" title="今日到场率" value={`${overview.attendance.rate}%`} desc={`实到 ${overview.attendance.present} / 应到 ${overview.attendance.expected}`} /><MetricCard icon={FileSignature} tone="indigo" title="合同签署率" value={`${overview.contracts.signRate}%`} desc={`签署完成 ${overview.contracts.active} · 签署中 ${overview.contracts.signing}`} /><MetricCard icon={Camera} tone="cyan" title="AI摄像头匹配率" value={`${aiMatchRate}%`} desc={`已匹配 ${overview.ai.matched} · 陌生人 ${overview.ai.stranger}`} /><MetricCard icon={Gauge} tone="purple" title="平均评价分" value={overview.evaluation.averageScore} suffix="分" desc={`正式评价覆盖 ${overview.evaluation.covered} 人`} /><MetricCard icon={BarChart3} tone="purple" title="A级工人占比" value={`${aRate}%`} desc={`综合评价为A级${gradeA}人`} /></section>

    <section className="grid min-h-0 grid-cols-1 gap-3 xl:grid-cols-6"><div className="dashboard-panel flex h-full min-h-0 flex-col rounded border border-border-gray bg-white p-4 shadow-sm xl:col-span-4"><PanelTitle icon={ClipboardCheck} title="人员与考勤统计" /><div className="grid min-h-0 flex-1 grid-cols-5 gap-4"><div className="col-span-3 flex min-h-0 min-w-0 flex-col"><div className="text-xs font-medium">近 7 日实际到场人数</div><ValueTrend items={data.attendanceTrend} color="#1890FF" className="h-[150px]" /></div><div className="col-span-2 flex min-h-0 flex-col"><div className="mb-2 text-xs font-medium">今日考勤数据</div><div className="grid grid-cols-3 gap-2"><DataStat label="实际到场" value={overview.attendance.present} suffix="人" tone="text-success-green" /><DataStat label="缺少进场" value={overview.attendance.missingEntry} suffix="人" /><DataStat label="缺少出场" value={overview.attendance.missingExit} suffix="人" /></div><div className="mt-3 min-w-0"><div className="mb-1.5 text-xs text-text-secondary">在场班组分布</div><DonutChart items={data.teamDistribution} /></div></div></div></div><div className="dashboard-panel flex h-full min-h-0 flex-col rounded border border-border-gray bg-white p-4 shadow-sm xl:col-span-2"><PanelTitle icon={Camera} title="AI识别统计" /><div className="grid min-h-0 flex-1 grid-cols-2 gap-4"><div className="flex min-w-0 flex-col items-center justify-center"><div className="relative flex h-28 w-28 items-center justify-center rounded-full" style={{ background: `conic-gradient(#13C2C2 0 ${aiMatchRate}%, #FF4D4F ${aiMatchRate}% 100%)` }}><div className="flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-white"><span className="text-xl font-bold">{aiMatchRate}%</span><span className="text-xs text-text-secondary">匹配率</span></div></div><div className="mt-3 w-full space-y-1.5 text-xs"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#13C2C2]" />已匹配</span><span className="font-medium">{overview.ai.matched}</span></div><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#FF4D4F]" />陌生人</span><span className="font-medium">{overview.ai.stranger}</span></div></div></div><div className="flex min-w-0 flex-col"><div className="grid grid-cols-2 gap-2"><DataStat label="设备在线" value={overview.ai.online} suffix={`/ ${overview.ai.totalDevices}`} tone="text-success-green" /><DataStat label="今日识别数量" value={todayAiCount} suffix="条" /></div><div className="mt-3 text-xs text-text-secondary">近 7 日识别量</div><ValueTrend items={data.aiTrend} color="#13C2C2" labelKey="date" className="h-[106px]" /></div></div></div></section>

    <section className="grid min-h-0 grid-cols-1 gap-3 xl:grid-cols-5"><div className="dashboard-panel flex h-full min-h-0 flex-col rounded border border-border-gray bg-white p-4 shadow-sm xl:col-span-2"><PanelTitle icon={FileSignature} title="电子合同统计" desc="合同覆盖与状态分布" /><div className="flex min-h-0 flex-1 flex-col gap-3"><div className="grid grid-cols-3 gap-2"><DataStat label="合同签署率" value={`${overview.contracts.signRate}%`} tone="text-[#4F46E5]" /><DataStat label="合同总量" value={overview.contracts.total} suffix="份" /><DataStat label="签署完成" value={overview.contracts.active} suffix="份" tone="text-success-green" /><DataStat label="签署中" value={overview.contracts.signing} suffix="份" /><DataStat label="初始" value={overview.contracts.incomplete} suffix="份" /><DataStat label="临近到期" value={overview.contracts.expiring} suffix="份" /></div><ContractStatus contracts={overview.contracts} /><div className="mt-auto min-h-0"><div className="mb-1.5 text-xs text-text-secondary">近 6 个月完成签署合同数量</div><ValueTrend items={data.contractTrend} color="#4F46E5" labelKey="month" className="h-[112px]" /></div></div></div><div className="dashboard-panel flex h-full min-h-0 flex-col rounded border border-border-gray bg-white p-4 shadow-sm xl:col-span-3"><PanelTitle icon={Gauge} title="工人评价统计" /><div className="grid min-h-0 flex-1 grid-cols-[minmax(200px,0.95fr)_minmax(0,1.05fr)] gap-5"><div className="flex min-h-0 flex-col"><div className="mb-2 text-xs font-medium">等级分布</div><div className="flex min-h-0 flex-1 items-center justify-center"><GradePieChart grades={evaluation.grades} /></div></div><div className="flex min-h-0 flex-col"><div className="mb-2 text-xs font-medium">五维平均分</div><div className="grid min-h-0 flex-1 grid-rows-5 gap-3">{evaluation.dimensions.map((item) => <ProgressRow key={item.label} label={item.label} value={item.value} color="#722ED1" />)}</div></div></div></div></section>
  </div>
}
