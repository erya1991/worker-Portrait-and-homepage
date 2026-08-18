import { useEffect, useMemo, useState } from 'react'
import { Award, Briefcase, Calendar, FileText, Search, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Badge, Grade, Stars, Stat, Tab } from './mvpShared'

const workers = [
  {
    id: 1,
    name: '张建国',
    idCard: '3701021980******56',
    gender: '男',
    age: 44,
    phone: '138****2356',
    education: '高中',
    job: '钢筋工',
    team: '钢筋一班',
    company: '中建一局集团',
    project: '北京CBD东区超高层项目',
    entryDate: '2026-01-12',
    leaveDate: '-',
    status: '在场',
    score: 94,
    grade: 'A',
    stars: 5,
    tags: ['A级工人', '履约稳定', '安全之星', '健康合格'],
    radar: { 职业资质: 92, 履约能力: 96, 安全行为: 95, 工作效率: 91, 信用记录: 97 },
    aiSummary: '该工人履约稳定，近三个月出勤率较高，持有有效技能证书，近一年无安全处罚记录，综合评价为A级。建议优先用于对安全和稳定性要求较高的重点项目。',
    history: ['2026.01 入场北京CBD东区超高层项目', '2026.05 完成三级安全教育并考试合格', '2026.06 获评项目安全之星', '2026.07 完成模型评价并生成A级标签']
  },
  {
    id: 2,
    name: '李强',
    idCard: '4201061988******90',
    gender: '男',
    age: 38,
    phone: '139****8090',
    education: '中专',
    job: '架子工',
    team: '架子二班',
    company: '中建一局集团',
    project: '北京CBD东区超高层项目',
    entryDate: '2026-02-03',
    leaveDate: '-',
    status: '在场',
    score: 85,
    grade: 'B',
    stars: 4,
    tags: ['履约稳定', '健康合格'],
    radar: { 职业资质: 84, 履约能力: 88, 安全行为: 82, 工作效率: 86, 信用记录: 85 },
    aiSummary: '该工人出勤稳定，健康状态良好，当前综合评价为B级。建议继续补充专项安全培训记录，提升安全行为维度得分。',
    history: ['2026.02 入场北京CBD东区超高层项目', '2026.06 完成架子工专项培训', '2026.07 获得B级综合评价']
  },
  {
    id: 3,
    name: '王朝阳',
    idCard: '1301021992******67',
    gender: '男',
    age: 34,
    phone: '137****9267',
    education: '初中',
    job: '泥工',
    team: '泥工一班',
    company: '中铁十一局',
    project: '轨道交通8号线项目',
    entryDate: '2026-03-18',
    leaveDate: '-',
    status: '在场',
    score: 72,
    grade: 'C',
    stars: 3,
    tags: ['重点关注', '健康合格'],
    radar: { 职业资质: 75, 履约能力: 70, 安全行为: 65, 工作效率: 74, 信用记录: 76 },
    aiSummary: '该工人存在一般安全处罚记录，当前综合评价为C级。建议项目部加强安全教育和现场行为纠偏，后续重新执行评价模型。',
    history: ['2026.03 入场轨道交通8号线项目', '2026.07 发生一般违章处罚', '2026.07 生成重点关注标签']
  },
  {
    id: 4,
    name: '赵铁柱',
    idCard: '2101031975******78',
    gender: '男',
    age: 51,
    phone: '136****5678',
    education: '高中',
    job: '电焊工',
    team: '机电安装班',
    company: '上海建工集团',
    project: '城市剧院机电安装项目',
    entryDate: '2025-12-02',
    leaveDate: '2026-06-28',
    status: '已退场',
    score: 81,
    grade: 'B',
    stars: 4,
    tags: ['证书有效', '健康合格'],
    radar: { 职业资质: 90, 履约能力: 82, 安全行为: 78, 工作效率: 80, 信用记录: 82 },
    aiSummary: '该工人职业资质较完整，电焊证书有效，综合评价为B级。建议在证书到期前提前复审。',
    history: ['2025.12 入场城市剧院机电安装项目', '2026.04 完成特种作业证复核', '2026.06 正常退场']
  }
]

const facts = {
  health: { headers: ['发生日期', '体检结果', '是否合格'], rows: [['2026-07-08', '体检合格，无职业禁忌', '是'], ['2026-06-01', '入场体检合格', '是']] },
  reward: { headers: ['发生日期', '奖励事项', '奖励内容'], rows: [['2026-06-25', '安全之星', '月度安全表彰'], ['2026-05-18', '质量之星', '班组推荐']] },
  punish: { headers: ['发生日期', '处罚事项', '处罚内容'], rows: [['2026-07-05', '安全整改', '未佩戴安全帽'], ['-', '无记录', '-']] },
  cert: { headers: ['发生日期', '证书类别', '证书名称'], rows: [['2026-06-20', '特殊工种证书', '钢筋工技能证书'], ['2025-11-08', '普通证书', '特种作业证']] },
  laborDispute: { headers: ['发生日期', '纠纷事项'], rows: [['-', '暂无劳资纠纷记录']] }
}

const factTabs = [
  { key: 'health', label: '体检记录' },
  { key: 'reward', label: '奖励记录' },
  { key: 'punish', label: '处罚记录' },
  { key: 'cert', label: '证书记录' },
  { key: 'laborDispute', label: '劳资纠纷' }
]

export default function MvpPortraitCenter({ workerPoolFilter }) {
  const [keyword, setKeyword] = useState('')
  const [gradeFilter, setGradeFilter] = useState('全部')
  const [tagFilter, setTagFilter] = useState('全部')
  const [selectedId, setSelectedId] = useState(1)
  const [factTab, setFactTab] = useState('health')

  useEffect(() => {
    const tag = workerPoolFilter?.tag || '全部'
    const matchedWorker = tag === '全部' ? workers[0] : workers.find((item) => item.tags.includes(tag)) || workers[0]
    setKeyword('')
    setGradeFilter('全部')
    setTagFilter(tag)
    setSelectedId(matchedWorker.id)
  }, [workerPoolFilter?.tag, workerPoolFilter?.version])

  const allTags = ['全部', ...new Set(workers.flatMap((item) => item.tags))]
  const filteredWorkers = useMemo(() => {
    return workers.filter((item) => {
      const matchKeyword = [item.name, item.idCard, item.job, item.company, item.project, item.status].some((value) => value.includes(keyword))
      const matchGrade = gradeFilter === '全部' || item.grade === gradeFilter
      const matchTag = tagFilter === '全部' || item.tags.includes(tagFilter)
      return matchKeyword && matchGrade && matchTag
    })
  }, [keyword, gradeFilter, tagFilter])

  const activeWorker = workers.find((item) => item.id === selectedId) || workers[0]

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat icon={Users} title="工人总数" value="1,265" desc="实名制同步人员" />
        <Stat icon={Award} title="A级工人数" value="126" desc="综合评价90分以上" />
        <Stat icon={ShieldCheck} title="风险标签人数" value="18" desc="存在警示类标签" />
        <Stat icon={FileText} title="已生成画像" value="1,102" desc="完成模型评价人员" />
      </section>

      <section className="grid min-h-[720px] gap-5 xl:grid-cols-[430px_1fr]">
        <div className="rounded border border-border-gray bg-white shadow-sm">
          <div className="border-b border-border-gray p-4">
            <div className="mb-3 flex items-center gap-2 font-bold"><Users className="h-5 w-5 text-primary" /> 企业工人库</div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded border border-border-gray px-3 py-2">
                <Search className="h-4 w-4 text-text-secondary" />
                <input className="w-full outline-none" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索姓名、身份证、工种、企业或项目" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select className="rounded border border-border-gray px-3 py-2" value={gradeFilter} onChange={(event) => setGradeFilter(event.target.value)}>
                  <option value="全部">请选择等级</option>
                  {['A', 'B', 'C', 'D'].map((item) => <option key={item} value={item}>{item}级</option>)}
                </select>
                <select className="rounded border border-border-gray px-3 py-2" value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
                  <option value="全部">请选择标签</option>
                  {allTags.filter((item) => item !== '全部').map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="divide-y divide-border-gray">
            {filteredWorkers.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full p-3 text-left hover:bg-[#F6FAFF] ${selectedId === item.id ? 'bg-[#E6F7FF]' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={item.name} compact />
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2"><span className="shrink-0 font-bold">{item.name}</span><div className="flex min-w-0 gap-1 overflow-hidden">{item.tags.slice(0, 2).map((tag) => <TagPill key={tag} tone={tag === '重点关注' ? 'red' : 'blue'} compact>{tag}</TagPill>)}{item.tags.length > 2 && <span className="shrink-0 text-xs text-text-secondary">+{item.tags.length - 2}</span>}</div></div>
                      <div className="mt-1 grid grid-cols-2 gap-x-3 text-xs text-text-secondary"><span className="truncate">{item.job}</span><span className="truncate">{item.company}</span></div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary"><span className="truncate">{item.project}</span><Badge tone={item.status === '在场' ? 'green' : 'gray'}>{item.status}</Badge></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1"><Grade grade={item.grade} /><div className="flex h-9 w-12 items-center justify-center rounded bg-[#F6FAFF] text-lg font-bold text-primary">{item.score}</div></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded border border-border-gray bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-border-gray pb-5">
            <div className="flex items-center gap-4">
              <Avatar name={activeWorker.name} size="large" />
              <div>
                <div className="text-2xl font-bold">{activeWorker.name}</div>
                <div className="mt-1 text-sm text-text-secondary">{activeWorker.job} / {activeWorker.company}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge>{activeWorker.status}</Badge>
                  <Badge tone="gray">{activeWorker.project}</Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-secondary">综合评分</div>
              <div className="text-5xl font-bold text-primary">{activeWorker.score}</div>
              <div className="mt-1"><Grade grade={activeWorker.grade} /> <Stars count={activeWorker.stars} /></div>
            </div>
          </div>

          <div className="grid gap-5 2xl:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <section className="rounded border border-border-gray p-4">
                <div className="mb-4 flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4 text-primary" /> 五维评价雷达</div>
                <RadarChart data={activeWorker.radar} />
              </section>

              <section className="rounded border border-border-gray p-4">
                <div className="mb-3 flex items-center gap-2 font-bold"><Sparkles className="h-4 w-4 text-primary" /> 智能综合评价</div>
                <p className="leading-7 text-text-dark">{buildSmartSummary(activeWorker)}</p>
              </section>

              <section className="rounded border border-border-gray p-4">
                <div className="mb-3 flex items-center gap-2 font-bold"><Award className="h-4 w-4 text-primary" /> 工人标签</div>
                <div className="flex flex-wrap gap-2">
                  {activeWorker.tags.map((tag) => <TagPill key={tag} tone={tag === '重点关注' ? 'red' : 'blue'}>{tag}</TagPill>)}
                </div>
              </section>

              <section className="rounded border border-border-gray p-4">
                <div className="mb-4 flex flex-wrap gap-2">
                  {factTabs.map((item) => (
                    <Tab key={item.key} active={factTab === item.key} onClick={() => setFactTab(item.key)}>{item.label}</Tab>
                  ))}
                </div>
                <div className="overflow-auto rounded border border-border-gray">
                  <table className="b-table">
                    <thead><tr>{facts[factTab].headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
                    <tbody>
                      {facts[factTab].rows.map((row) => (
                        <tr key={row.join('-')}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded border border-border-gray p-4">
                <div className="mb-3 flex items-center gap-2 font-bold"><Briefcase className="h-4 w-4 text-primary" /> 基础信息</div>
                <Info label="性别/年龄" value={`${activeWorker.gender} / ${activeWorker.age}岁`} />
                <Info label="联系方式" value={activeWorker.phone} />
                <Info label="身份证号" value={activeWorker.idCard} />
                <Info label="学历" value={activeWorker.education} />
                <Info label="当前班组" value={activeWorker.team} />
                <Info label="进退场" value={`${activeWorker.entryDate} 至 ${activeWorker.leaveDate}`} />
              </section>

              <section className="rounded border border-border-gray p-4">
                <div className="mb-4 flex items-center gap-2 font-bold"><Calendar className="h-4 w-4 text-primary" /> 项目履历</div>
                <div className="space-y-4">
                  {activeWorker.history.filter((item) => item.includes('入场') || item.includes('退场')).map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                      <div className="text-sm leading-6">{item}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function RadarChart({ data }) {
  const entries = Object.entries(data)
  const center = 150
  const radius = 96
  const rings = [20, 40, 60, 80, 100]
  const points = entries.map(([, value], index) => polarPoint(center, radius * (value / 100), index, entries.length))
  const polygon = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <div className="flex justify-center">
        <svg viewBox="0 0 300 300" className="h-[300px] w-[300px]">
          {rings.map((ring) => (
            <polygon
              key={ring}
              points={entries.map(([,], index) => {
                const point = polarPoint(center, radius * (ring / 100), index, entries.length)
                return `${point.x},${point.y}`
              }).join(' ')}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          {entries.map(([label], index) => {
            const axis = polarPoint(center, radius, index, entries.length)
            const labelPoint = polarPoint(center, radius + 28, index, entries.length)
            return (
              <g key={label}>
                <line x1={center} y1={center} x2={axis.x} y2={axis.y} stroke="#E5E7EB" strokeWidth="1" />
                <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" className="fill-text-secondary text-[12px]">
                  {label}
                </text>
              </g>
            )
          })}
          <polygon points={polygon} fill="#2196F3" fillOpacity="0.18" stroke="#2196F3" strokeWidth="2" />
          {points.map((point, index) => (
            <circle key={entries[index][0]} cx={point.x} cy={point.y} r="4" fill="#2196F3" />
          ))}
        </svg>
      </div>
      <div className="grid content-center gap-3 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="rounded bg-[#FAFAFA] p-3">
            <div className="text-sm text-text-secondary">{key}</div>
            <div className="mt-1 text-2xl font-bold text-primary">{value}<span className="ml-1 text-sm font-normal">分</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function polarPoint(center, radius, index, total) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle)
  }
}

function Avatar({ name, size = 'normal', compact = false }) {
  const sizeClass = size === 'large' ? 'h-16 w-16 text-2xl' : compact ? 'h-9 w-9 text-sm' : 'h-11 w-11 text-base'
  return <div className={`flex shrink-0 items-center justify-center rounded bg-primary font-bold text-white ${sizeClass}`}>{name.slice(0, 1)}</div>
}

function TagPill({ children, tone = 'blue', compact = false }) {
  const style = tone === 'red' ? 'bg-[#FFF1F0] text-danger-red' : 'bg-[#E6F7FF] text-primary'
  return <span className={`whitespace-nowrap rounded-full ${compact ? 'px-1.5 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'} ${style}`}>{children}</span>
}

function Info({ label, value }) {
  return (
    <div className="mb-3 grid grid-cols-[80px_1fr] gap-3 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function buildSmartSummary(worker) {
  const strongest = Object.entries(worker.radar).sort((a, b) => b[1] - a[1])[0]
  const warning = worker.tags.find((tag) => tag === '重点关注')
  const gradeText = worker.grade === 'A' ? '综合表现优秀' : worker.grade === 'B' ? '综合表现良好' : worker.grade === 'C' ? '综合表现合格，仍有提升空间' : '需要重点关注'
  const tagText = warning ? `当前存在“${warning}”警示标签，建议加强现场跟踪。` : `当前已生成${worker.tags.slice(0, 2).map((tag) => `“${tag}”`).join('、')}等标签。`
  return `${worker.name}综合评分${worker.score}分，评价等级为${worker.grade}级，${gradeText}。${strongest[0]}表现较好，${tagText}`
}
