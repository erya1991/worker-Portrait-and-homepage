import { useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, Building2, Camera, ChevronLeft, ChevronRight, ClipboardCheck, Database, FileSignature, Search, UsersRound, X } from 'lucide-react'
import { getEnterpriseDashboardOverview, organizationOptions } from '../api/enterpriseDashboard'

const metricTones = {
  blue: 'bg-[#E6F7FF] text-primary',
  green: 'bg-[#F6FFED] text-success-green',
  indigo: 'bg-[#EEF0FF] text-[#4F46E5]',
  cyan: 'bg-[#E6FFFB] text-[#08979C]',
  purple: 'bg-[#F9F0FF] text-[#722ED1]',
  orange: 'bg-[#FFF7E6] text-[#D46B08]'
}

function formatNumber(value) {
  return typeof value === 'number' ? value.toLocaleString('zh-CN') : value
}

function PanelTitle({ icon: Icon, title, action }) {
  return <div className="enterprise-panel-title mb-3 flex items-center justify-between gap-2"><div className="flex min-w-0 items-center gap-2"><div className="rounded bg-[#F0F7FF] p-1.5 text-primary"><Icon className="h-4 w-4" /></div><div className="truncate text-base font-bold leading-5">{title}</div></div>{action}</div>
}

function MetricCard({ icon: Icon, tone, title, value, suffix, desc, onClick }) {
  const className = `enterprise-metric-card min-w-0 rounded border border-border-gray bg-white px-3 py-2.5 shadow-sm ${onClick ? 'cursor-pointer text-left transition hover:border-[#91CAFF] hover:shadow-md' : ''}`
  const content = <><div className="flex items-center justify-between gap-2"><span className="truncate text-xs text-text-secondary">{title}</span><span className={`rounded p-1 ${metricTones[tone]}`}><Icon className="h-3.5 w-3.5" /></span></div><div className="mt-2 flex min-w-0 items-baseline gap-1"><span className="truncate text-[21px] font-bold leading-none tracking-tight">{value}</span>{suffix && <span className="shrink-0 text-[11px] text-text-secondary">{suffix}</span>}</div><div className="mt-1.5 truncate text-[11px] text-text-secondary">{desc}</div></>
  return onClick ? <button type="button" title="进入企业工人库" onClick={onClick} className={className}>{content}</button> : <div className={className}>{content}</div>
}

function ProgressValue({ value, color = '#1890FF' }) {
  return <div className="enterprise-progress-value flex min-w-[108px] items-center gap-2"><div className="h-2 flex-1 overflow-hidden rounded bg-[#EEF2F6]"><div className="h-full rounded" style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} /></div><span className="w-10 text-right text-xs font-semibold">{value}%</span></div>
}

function ProjectTable({ projects, total, onOpenProject, onOpenDrawer }) {
  return <div className="flex min-h-0 flex-1 flex-col overflow-hidden"><div className="mb-2 flex items-center justify-between gap-2"><span className="text-sm text-text-secondary">共 {total} 个在管项目，主屏展示前 5 项</span><button type="button" onClick={onOpenDrawer} className="shrink-0 text-sm font-medium text-primary hover:underline">查看全部项目</button></div>{projects.length ? <div className="enterprise-table-wrap min-h-0 flex-1 overflow-hidden rounded border border-border-gray"><table className="enterprise-table enterprise-project-table w-full table-fixed"><thead><tr><th className="w-[25%] text-left">项目名称</th><th className="w-[15%] text-left">所属分公司</th><th className="w-[10%] text-right">当前在场</th><th className="w-[14%] text-left">今日出勤率</th><th className="w-[14%] text-left">合同签署率</th><th className="w-[14%] text-left">评价覆盖率</th><th className="w-[8%] text-right">A级占比</th></tr></thead><tbody>{projects.slice(0, 5).map((item) => <tr key={item.projectId}><td className="max-w-0"><button type="button" title={`进入${item.projectName}项目首页`} onClick={() => onOpenProject(item.projectId)} className="block max-w-full truncate text-left font-medium text-primary hover:underline">{item.projectName}</button></td><td className="truncate text-text-secondary" title={item.branchName}>{item.branchName}</td><td className="text-right font-medium">{formatNumber(item.onSiteWorkerCount)}人</td><td><ProgressValue value={item.attendanceRate} color="#1890FF" /></td><td><ProgressValue value={item.contractSignRate} color="#4F46E5" /></td><td><ProgressValue value={item.evaluationCoverageRate} color="#722ED1" /></td><td className="text-right font-medium">{item.aRate}%</td></tr>)}</tbody></table></div> : <div className="flex min-h-0 flex-1 items-center justify-center rounded border border-dashed border-border-gray text-sm text-text-secondary">当前组织范围暂无在管项目</div>}</div>
}

function AttentionGroup({ title, items, color, background, onOpenProject }) {
  return <div className="enterprise-attention-group rounded border p-2" style={{ borderColor: color, backgroundColor: background }}><div className="mb-1.5 flex items-center gap-2"><span className="enterprise-attention-icon flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: color }}><AlertTriangle className="h-3.5 w-3.5" /></span><span className="truncate text-xs font-bold" style={{ color }}>{title}</span></div><div className="space-y-0.5">{items.length ? items.map((item) => <button type="button" key={item.projectId} title={`进入${item.projectName}项目首页`} onClick={() => onOpenProject(item.projectId)} className="enterprise-attention-row flex w-full cursor-pointer items-center gap-3 rounded px-1.5 py-1.5 text-left"><span className="w-16 shrink-0 text-right text-lg font-bold leading-none" style={{ color }}>{item.value}%</span><span className="min-w-0 flex-1 truncate text-right text-[15px] font-semibold text-primary hover:underline">{item.projectName}</span></button>) : <div className="px-1 py-2 text-xs text-text-secondary">当前暂无提醒项目</div>}</div></div>
}

function GradeChart({ grades }) {
  const total = grades.reduce((sum, item) => sum + item.value, 0)
  if (!total) return <div className="flex h-full min-h-[142px] items-center justify-center rounded bg-[#FBFCFE] text-xs text-text-secondary">暂无正式评价</div>
  const donutSize = 144
  const center = donutSize / 2
  const radius = 52
  const circumference = 2 * Math.PI * radius
  let cursor = 0
  const segments = grades.map((item) => {
    const fraction = item.value / total
    const segmentLength = fraction * circumference
    const start = cursor
    const middleAngle = (cursor + fraction / 2) * Math.PI * 2 - Math.PI / 2
    cursor += fraction
    return { ...item, segmentLength, offset: start * circumference, labelX: center + Math.cos(middleAngle) * radius, labelY: center + Math.sin(middleAngle) * radius }
  })
  return <div className="flex min-h-0 items-center gap-3 rounded bg-[#FBFCFE] px-2.5 py-2"><div className="relative h-[142px] w-[142px] shrink-0"><svg viewBox={`0 0 ${donutSize} ${donutSize}`} className="h-full w-full" role="img" aria-label="A/B/C/D 等级分布"><circle cx={center} cy={center} r={radius} fill="none" stroke="#EEF2F6" strokeWidth="28" />{segments.map((item) => <g key={item.label}><circle cx={center} cy={center} r={radius} fill="none" stroke={item.color} strokeWidth="28" strokeDasharray={`${item.segmentLength} ${circumference - item.segmentLength}`} strokeDashoffset={-item.offset} transform={`rotate(-90 ${center} ${center})`} /><text x={item.labelX} y={item.labelY + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">{item.label}</text></g>)}</svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-lg font-bold">{formatNumber(total)}</span><span className="text-[11px] text-text-secondary">已评价</span></div></div><div className="min-w-0 flex-1 space-y-2">{grades.map((item) => <div key={item.label} className="flex items-center gap-1.5 text-xs"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} /><span className="w-7 font-medium">{item.label}级</span><span className="min-w-0 flex-1 text-right text-text-secondary">{formatNumber(item.value)}人</span><span className="w-9 text-right font-medium">{Math.round(item.value / total * 1000) / 10}%</span></div>)}</div></div>
}

function WorkerPoolPanel({ workerPool, onOpenWorkerPool }) {
  return <div className="enterprise-panel flex h-full min-h-0 flex-col rounded border border-border-gray bg-white p-3.5 shadow-sm"><PanelTitle icon={UsersRound} title="企业工人库" action={<button type="button" onClick={() => onOpenWorkerPool()} className="text-xs font-medium text-primary hover:underline">进入工人库</button>} /><div className="grid min-h-0 flex-1 grid-cols-[minmax(205px,0.95fr)_minmax(220px,1.05fr)] gap-3"><div className="flex min-h-0 flex-col"><div className="mb-2 text-xs font-medium">A/B/C/D 等级分布</div><div className="min-h-0 flex-1"><GradeChart grades={workerPool.grades} /></div></div><div className="flex min-h-0 flex-col"><div className="mb-2 text-xs font-medium">标签人数</div><div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2">{workerPool.tags.slice(0, 4).map((tag) => <button type="button" key={tag.tagId} title={`查看${tag.name}工人`} onClick={() => onOpenWorkerPool(tag.name)} className={`enterprise-tag-stat flex min-h-0 flex-col justify-center rounded border px-2.5 py-2 text-left transition hover:shadow-sm ${tag.property === '警示' ? 'border-[#FFCCC7] bg-[#FFF1F0] hover:border-[#FF7875]' : 'border-[#D6E4FF] bg-[#F6FAFF] hover:border-[#91CAFF]'}`}><div className="truncate text-[11px] text-text-secondary">{tag.name}</div><div className={`mt-1 text-lg font-bold ${tag.property === '警示' ? 'text-danger-red' : 'text-primary'}`}>{formatNumber(tag.value)}<span className="ml-0.5 text-[10px] font-normal text-text-secondary">人</span></div></button>)}</div></div></div></div>
}

function TrendPeriodSwitch({ value, onChange }) {
  return <div className="enterprise-trend-switch flex items-center rounded border border-border-gray bg-[#F8FAFC] p-0.5" role="group" aria-label="趋势周期"><button type="button" onClick={() => onChange(7)} className={`rounded px-2 py-1 text-[11px] ${value === 7 ? 'bg-white font-medium text-primary shadow-sm' : 'text-text-secondary'}`}>近7日</button><button type="button" onClick={() => onChange(15)} className={`rounded px-2 py-1 text-[11px] ${value === 15 ? 'bg-white font-medium text-primary shadow-sm' : 'text-text-secondary'}`}>近15日</button></div>
}

function AttendanceTrend({ items }) {
  const [visibleSeries, setVisibleSeries] = useState({ present: true, rate: true })
  const [hoverIndex, setHoverIndex] = useState(null)
  const toggleSeries = (key) => {
    setVisibleSeries((current) => {
      if (current[key] && Object.values(current).filter(Boolean).length === 1) return current
      return { ...current, [key]: !current[key] }
    })
  }
  if (!items.length) return <div className="flex flex-1 items-center justify-center rounded bg-[#FBFCFE] text-xs text-text-secondary">当前组织范围暂无出勤趋势数据</div>
  const width = 1280
  const height = 266
  const padding = { top: 34, right: 58, bottom: 40, left: 62 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const maxPresent = Math.max(...items.map((item) => item.present), 1)
  const presentStep = Math.max(500, Math.ceil(maxPresent / 4 / 500) * 500)
  const presentAxisMax = presentStep * 4
  const presentTicks = [0, presentStep, presentStep * 2, presentStep * 3, presentAxisMax]
  const rateTicks = [0, 25, 50, 75, 100]
  const x = (index) => padding.left + (items.length === 1 ? chartWidth / 2 : (index + 0.5) / items.length * chartWidth)
  const yPresent = (value) => padding.top + chartHeight - value / presentAxisMax * chartHeight
  const yRate = (value) => padding.top + chartHeight - value / 100 * chartHeight
  const points = items.map((item, index) => `${x(index)},${yRate(item.rate)}`).join(' ')
  const labelIndexes = items.map((_, index) => index)
  const barWidth = Math.max(20, Math.min(34, chartWidth / items.length * 0.56))
  const activeHoverIndex = hoverIndex !== null && hoverIndex < items.length ? hoverIndex : null
  const tooltipWidth = 154
  const tooltipHeight = 70
  const tooltipX = activeHoverIndex === null ? 0 : Math.min(width - padding.right - tooltipWidth, Math.max(padding.left, x(activeHoverIndex) - tooltipWidth / 2))
  const tooltipY = padding.top + 12
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-[#E8EEF5] bg-[#FAFCFF] p-1.5">
        <svg viewBox={"0 0 " + width + " " + height} preserveAspectRatio="xMidYMid meet" className="h-full w-full" role="img" aria-label="企业用工趋势双轴组合图">
          <defs>
            <linearGradient id="enterprise-trend-bar" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8FC1FF" />
              <stop offset="100%" stopColor="#1677FF" />
            </linearGradient>
          </defs>
          {activeHoverIndex !== null && <rect x={x(activeHoverIndex) - chartWidth / items.length / 2} y={padding.top} width={chartWidth / items.length} height={chartHeight} fill="#EDF5FF" />}
          {rateTicks.map((tick, index) => {
            const y = padding.top + chartHeight - tick / 100 * chartHeight
            return (
              <g key={tick}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#E5EDF6" />
                {visibleSeries.present && <text x={padding.left - 10} y={y + 4} textAnchor="end" fill="#7B8798" fontSize="10">{formatNumber(presentTicks[index])}</text>}
                {visibleSeries.rate && <text x={width - padding.right + 10} y={y + 4} textAnchor="start" fill="#7B8798" fontSize="10">{tick}%</text>}
              </g>
            )
          })}
          {visibleSeries.present && <text x={padding.left - 10} y="18" textAnchor="end" fill="#1677FF" fontSize="10" fontWeight="600">实际出勤人数</text>}
          {visibleSeries.rate && <text x={width - padding.right + 10} y="18" textAnchor="start" fill="#7C3AED" fontSize="10" fontWeight="600">出勤率</text>}
          <line x1={padding.left} y1={padding.top + chartHeight} x2={width - padding.right} y2={padding.top + chartHeight} stroke="#CBD5E1" />
          {visibleSeries.present && items.map((item, index) => (
            <g key={item.date + "-bar"}>
              <rect x={x(index) - barWidth / 2} y={yPresent(item.present)} width={barWidth} height={padding.top + chartHeight - yPresent(item.present)} rx="4" fill="url(#enterprise-trend-bar)" />
            </g>
          ))}
          {visibleSeries.rate && <polyline points={points} fill="none" stroke="#7C3AED" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />}
          {visibleSeries.rate && items.map((item, index) => <circle key={item.date + "-rate"} cx={x(index)} cy={yRate(item.rate)} r="4.2" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2" />)}
          {items.map((item, index) => (
            <rect
              key={item.date + "-hit"}
              x={x(index) - chartWidth / items.length / 2}
              y={padding.top}
              width={chartWidth / items.length}
              height={chartHeight}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseMove={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <title>{item.date + "\n实际出勤：" + formatNumber(item.present) + " 人\n出勤率：" + item.rate + "%"}</title>
            </rect>
          ))}
          {labelIndexes.map((index) => (
            <g key={items[index].date + "-date"}>
              <line x1={x(index)} y1={padding.top + chartHeight} x2={x(index)} y2={padding.top + chartHeight + 4} stroke="#CBD5E1" />
              <text x={x(index)} y={height - 11} textAnchor="middle" fill="#7B8798" fontSize="10">{items[index].date}</text>
            </g>
          ))}
          {activeHoverIndex !== null && (
            <g pointerEvents="none">
              <line x1={x(activeHoverIndex)} y1={padding.top} x2={x(activeHoverIndex)} y2={padding.top + chartHeight} stroke="#94A3B8" strokeDasharray="4 4" />
              <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipHeight} rx="6" fill="#FFFFFF" stroke="#D7E1EC" />
              <text x={tooltipX + 12} y={tooltipY + 18} fill="#1F2937" fontSize="11" fontWeight="700">{items[activeHoverIndex].date}</text>
              {visibleSeries.present && <><circle cx={tooltipX + 16} cy={tooltipY + 36} r="3" fill="#1677FF" /><text x={tooltipX + 25} y={tooltipY + 40} fill="#64748B" fontSize="10">实际出勤 {formatNumber(items[activeHoverIndex].present)} 人</text></>}
              {visibleSeries.rate && <><circle cx={tooltipX + 16} cy={tooltipY + 55} r="3" fill="#7C3AED" /><text x={tooltipX + 25} y={tooltipY + 59} fill="#64748B" fontSize="10">出勤率 {items[activeHoverIndex].rate}%</text></>}
            </g>
          )}
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-center gap-5" role="group" aria-label="趋势指标切换">
        <button type="button" aria-pressed={visibleSeries.present} onClick={() => toggleSeries('present')} title="切换实际出勤人数" className={visibleSeries.present ? 'flex items-center gap-1.5 text-[11px] font-medium text-[#1668DC]' : 'flex items-center gap-1.5 text-[11px] text-text-secondary opacity-50'}>
          <span className="h-2.5 w-3 rounded-sm bg-[#1677FF]" />
          实际出勤人数
        </button>
        <button type="button" aria-pressed={visibleSeries.rate} onClick={() => toggleSeries('rate')} title="切换出勤率" className={visibleSeries.rate ? 'flex items-center gap-1.5 text-[11px] font-medium text-[#6D28D9]' : 'flex items-center gap-1.5 text-[11px] text-text-secondary opacity-50'}>
          <span className="h-2.5 w-2.5 rounded-full border-2 border-[#7C3AED] bg-white" />
          出勤率
        </button>
      </div>
    </div>
  )
}

function ProjectListDrawer({ projects, onClose, onOpenProject }) {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 5
  const filteredProjects = useMemo(() => projects.filter((item) => item.projectName.includes(keyword) || item.branchName.includes(keyword)), [projects, keyword])
  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const updateKeyword = (value) => { setKeyword(value); setPage(1) }
  return <div className="fixed inset-0 z-40 flex justify-end"><button type="button" aria-label="关闭项目列表" onClick={onClose} className="absolute inset-0 cursor-default bg-black/20" /><aside className="enterprise-project-drawer relative z-10 flex h-full w-full max-w-5xl flex-col border-l border-border-gray bg-white shadow-2xl"><div className="flex shrink-0 items-center justify-between border-b border-border-gray px-5 py-4"><div><div className="text-base font-bold">全部项目</div><div className="mt-1 text-xs text-text-secondary">当前组织范围内的在管项目，共 {projects.length} 个</div></div><button type="button" onClick={onClose} aria-label="关闭" className="rounded p-1.5 text-text-secondary hover:bg-[#F5F7FA] hover:text-text-dark"><X className="h-5 w-5" /></button></div><div className="border-b border-border-gray p-4"><div className="flex items-center gap-2 rounded border border-border-gray px-3 py-2"><Search className="h-4 w-4 text-text-secondary" /><input value={keyword} onChange={(event) => updateKeyword(event.target.value)} placeholder="搜索项目名称或分公司" className="w-full text-sm outline-none" /></div></div><div className="min-h-0 flex-1 overflow-auto p-4"><table className="enterprise-table w-full min-w-[880px] text-xs"><thead><tr><th className="text-left">项目名称</th><th className="text-left">所属分公司</th><th className="text-right">当前在场</th><th className="text-right">出勤率</th><th className="text-right">合同签署率</th><th className="text-right">评价覆盖率</th><th className="text-right">A级占比</th></tr></thead><tbody>{pageItems.map((item) => <tr key={item.projectId}><td><button type="button" onClick={() => onOpenProject(item.projectId)} title={`进入${item.projectName}项目首页`} className="max-w-[250px] truncate text-left font-medium text-primary hover:underline">{item.projectName}</button></td><td className="text-text-secondary">{item.branchName}</td><td className="text-right">{formatNumber(item.onSiteWorkerCount)}人</td><td className="text-right">{item.attendanceRate}%</td><td className="text-right">{item.contractSignRate}%</td><td className="text-right">{item.evaluationCoverageRate}%</td><td className="text-right">{item.aRate}%</td></tr>)}</tbody></table>{!pageItems.length && <div className="py-12 text-center text-sm text-text-secondary">暂无匹配项目</div>}</div><div className="flex shrink-0 items-center justify-between border-t border-border-gray px-4 py-3 text-xs text-text-secondary"><span>共 {filteredProjects.length} 个项目</span><div className="flex items-center gap-2"><button type="button" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded border border-border-gray p-1 disabled:cursor-not-allowed disabled:opacity-40" aria-label="上一页"><ChevronLeft className="h-3.5 w-3.5" /></button><span>{currentPage} / {pageCount}</span><button type="button" disabled={currentPage >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="rounded border border-border-gray p-1 disabled:cursor-not-allowed disabled:opacity-40" aria-label="下一页"><ChevronRight className="h-3.5 w-3.5" /></button></div></div></aside></div>
}

export default function EnterpriseDashboard({ onOpenProject = () => {}, onOpenWorkerPool = () => {} }) {
  const [orgId, setOrgId] = useState('ORG001')
  const [trendPeriod, setTrendPeriod] = useState(7)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const data = useMemo(() => getEnterpriseDashboardOverview({ orgId }), [orgId])
  const summary = data.summary
  const displayedProjects = data.projects.items.slice(0, 5)
  const trendItems = data.attendanceTrend.slice(-trendPeriod)
  const metrics = [
    { icon: Building2, tone: 'blue', title: '在管项目', value: formatNumber(summary.activeProjectCount), suffix: '个', desc: '当前组织权限范围' },
    { icon: UsersRound, tone: 'green', title: '当前在场', value: formatNumber(summary.onSiteWorkerCount), suffix: '人', desc: '所有在管项目合计' },
    { icon: ClipboardCheck, tone: 'indigo', title: '今日出勤率', value: `${summary.attendance.rate}%`, desc: `今日出勤 ${formatNumber(summary.attendance.presentCount)} 人` },
    { icon: FileSignature, tone: 'purple', title: '合同签署率', value: `${summary.contracts.signRate}%`, desc: `完成签署 ${formatNumber(summary.contracts.signedWorkerCount)} 人` },
    { icon: UsersRound, tone: 'blue', title: '工人库人数', value: formatNumber(summary.workerPool.totalWorkerCount), suffix: '人', desc: summary.workerPool.scoreAvailable ? `平均分 ${summary.workerPool.averageScore}` : '暂无评价', onClick: () => onOpenWorkerPool() },
    { icon: Camera, tone: 'cyan', title: 'AI摄像头识别', value: formatNumber(summary.cameraAi.totalRecordCount), suffix: '条', desc: `已匹配 ${formatNumber(summary.cameraAi.matchedCount)} 条` },
    { icon: Database, tone: 'orange', title: 'AI数据采集', value: formatNumber(summary.aiCollection.totalCount), suffix: '条', desc: `已确认 ${formatNumber(summary.aiCollection.confirmedCount)} 条` }
  ]
  const handleOpenProject = (projectId) => { setDrawerOpen(false); onOpenProject(projectId) }

  return <div className="enterprise-dashboard-layout grid h-full min-h-[650px] grid-rows-[52px_104px_minmax(0,1.28fr)_minmax(0,1fr)] gap-3 overflow-hidden"><section className="flex min-w-0 items-center justify-between gap-3 rounded border border-border-gray bg-white px-4 shadow-sm"><div className="flex min-w-0 items-center gap-3"><div className="truncate text-lg font-bold">企业数据看板</div><label className="flex shrink-0 items-center gap-2 text-xs text-text-secondary"><span>选择组织</span><select aria-label="选择组织" value={orgId} onChange={(event) => setOrgId(event.target.value)} className="enterprise-org-select rounded border border-border-gray bg-white px-2.5 py-1.5 text-sm text-text-dark outline-none focus:border-primary"><optgroup label="一级组织"><option value="ORG001">全公司</option></optgroup><optgroup label="二级组织">{organizationOptions.filter((item) => item.level === 2).map((item) => <option key={item.orgId} value={item.orgId}>{item.name}</option>)}</optgroup></select></label></div><div className="shrink-0 text-xs text-text-secondary">数据更新时间 {data.scope.updatedAt}</div></section><section className="enterprise-kpi-grid grid min-w-0 grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">{metrics.map((metric) => <MetricCard key={metric.title} {...metric} />)}</section><section className="grid min-h-0 grid-cols-1 gap-3 xl:grid-cols-8"><div className="enterprise-panel flex min-h-0 flex-col rounded border border-border-gray bg-white p-3.5 shadow-sm xl:col-span-6"><PanelTitle icon={BarChart3} title="项目运行情况对比" action={<span className="text-xs font-normal text-text-secondary">项目指标仅供企业横向查看</span>} /><ProjectTable projects={displayedProjects} total={data.projects.total} onOpenProject={handleOpenProject} onOpenDrawer={() => setDrawerOpen(true)} /></div><div className="enterprise-attention-panel flex min-h-0 flex-col rounded border border-[#FFCCC7] bg-[#FFF9F8] p-3.5 shadow-sm xl:col-span-2"><PanelTitle icon={AlertTriangle} title="重点关注" /><div className="grid min-h-0 flex-1 content-center gap-2.5"><AttentionGroup title="出勤率偏低" items={data.attention.lowAttendanceProjects.slice(0, 3)} color="#CF1322" background="#FFF1F0" onOpenProject={handleOpenProject} /><AttentionGroup title="合同签署率低" items={data.attention.lowContractProjects.slice(0, 3)} color="#D46B08" background="#FFF7E6" onOpenProject={handleOpenProject} /></div></div></section><section className="grid min-h-0 grid-cols-1 gap-3 xl:grid-cols-5"><div className="h-full xl:col-span-2"><WorkerPoolPanel workerPool={data.workerPool} onOpenWorkerPool={onOpenWorkerPool} /></div><div className="enterprise-panel flex min-h-0 flex-col rounded border border-border-gray bg-white p-3.5 shadow-sm xl:col-span-3"><PanelTitle icon={ClipboardCheck} title="企业用工趋势" action={<TrendPeriodSwitch value={trendPeriod} onChange={setTrendPeriod} />} /><AttendanceTrend items={trendItems} /></div></section>{drawerOpen && <ProjectListDrawer projects={data.projects.items} onClose={() => setDrawerOpen(false)} onOpenProject={handleOpenProject} />}</div>
}
