import { useMemo, useState } from 'react'
import { Search, Users, Sparkles, Briefcase, Award, Calendar, ShieldCheck } from 'lucide-react'

const workers = [
  {
    id: 1,
    name: '张建国',
    job: '钢筋工',
    company: '中建一局集团',
    project: '北京CBD东区超高层项目',
    score: 94,
    grade: 'A',
    status: '在岗',
    tags: ['A级工人', '连续出勤', '安全之星', '健康合格'],
    radar: { 职业能力: 92, 履约能力: 96, 安全能力: 95, 健康能力: 90, 信用能力: 97 },
    profile: '连续出勤表现突出，近一年无安全处罚，技能证书完整，建议作为重点培养对象。',
    history: ['2026.01 入场北京CBD东区超高层项目', '2026.06 获评安全之星', '2026.07 体检合格并完成模型评价']
  },
  {
    id: 2,
    name: '李强',
    job: '架子工',
    company: '中建一局集团',
    project: '北京CBD东区超高层项目',
    score: 85,
    grade: 'B',
    status: '在岗',
    tags: ['连续出勤', '健康合格'],
    radar: { 职业能力: 84, 履约能力: 88, 安全能力: 82, 健康能力: 90, 信用能力: 86 },
    profile: '履约稳定，健康状态良好，安全能力仍有提升空间，建议继续参加专项安全培训。',
    history: ['2026.02 入场北京CBD东区超高层项目', '2026.06 完成架子工专项培训', '2026.07 获得B级评价']
  },
  {
    id: 3,
    name: '王朝阳',
    job: '泥工',
    company: '中铁十一局',
    project: '轨道交通18号线项目',
    score: 72,
    grade: 'C',
    status: '在岗',
    tags: ['重点关注', '健康合格'],
    radar: { 职业能力: 75, 履约能力: 70, 安全能力: 65, 健康能力: 82, 信用能力: 76 },
    profile: '存在安全处罚记录，当前评价为C级，建议项目部加强安全教育和现场行为纠偏。',
    history: ['2026.03 入场轨道交通18号线项目', '2026.07 发生一般违章处罚', '2026.07 生成重点关注标签']
  }
]

export default function PortraitCenter() {
  const [keyword, setKeyword] = useState('')
  const [selectedId, setSelectedId] = useState(1)
  const [levelFilter, setLevelFilter] = useState('全部')

  const filteredWorkers = useMemo(() => {
    return workers.filter((item) => {
      const matchKeyword = [item.name, item.job, item.company, item.project, item.grade].some((v) => v.includes(keyword))
      const matchLevel = levelFilter === '全部' || item.grade === levelFilter
      return matchKeyword && matchLevel
    })
  }, [keyword, levelFilter])

  const activeWorker = workers.find((item) => item.id === selectedId) || workers[0]

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat title="人才库工人" value="1,265" desc="实名制同步人员" />
        <Stat title="A级工人" value="126" desc="综合评价90分以上" />
        <Stat title="重点关注" value="18" desc="安全或信用风险" />
        <Stat title="已生成画像" value="1,102" desc="完成模型评价人员" />
      </section>

      <section className="grid min-h-[680px] gap-5 lg:grid-cols-[430px_1fr]">
        <div className="rounded border border-border-gray bg-white shadow-sm">
          <div className="border-b border-border-gray p-4">
            <div className="mb-3 flex items-center gap-2 font-bold"><Users className="h-5 w-5 text-primary" /> 企业人才库</div>
            <div className="flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded border border-border-gray px-3 py-2">
                <Search className="h-4 w-4 text-text-secondary" />
                <input className="w-full outline-none" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜索姓名、工种、企业、项目" />
              </div>
              <select className="rounded border border-border-gray px-3" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                <option>全部</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>
          </div>
          <div className="divide-y divide-border-gray">
            {filteredWorkers.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full p-4 text-left hover:bg-[#F6FAFF] ${selectedId === item.id ? 'bg-[#E6F7FF]' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{item.name} <span className="ml-1 text-sm font-normal text-text-secondary">{item.job}</span></div>
                    <div className="mt-1 text-xs text-text-secondary">{item.company} / {item.project}</div>
                  </div>
                  <Grade grade={item.grade} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>综合评分 <b className="text-primary">{item.score}</b></span>
                  <span className="text-text-secondary">{item.status}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded border border-border-gray bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-border-gray pb-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded bg-primary text-2xl font-bold text-white">{activeWorker.name.slice(0, 1)}</div>
                <div>
                  <div className="text-2xl font-bold">{activeWorker.name}</div>
                  <div className="mt-1 text-sm text-text-secondary">{activeWorker.job} / {activeWorker.company}</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-secondary">综合评分</div>
              <div className="text-4xl font-bold text-primary">{activeWorker.score}</div>
              <Grade grade={activeWorker.grade} />
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <section className="rounded border border-border-gray p-4">
                <div className="mb-4 flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4 text-primary" /> 五维能力雷达</div>
                <div className="space-y-3">
                  {Object.entries(activeWorker.radar).map(([key, value]) => (
                    <div key={key}>
                      <div className="mb-1 flex justify-between text-sm"><span>{key}</span><span>{value}</span></div>
                      <div className="h-2 rounded bg-[#EDF2F7]"><div className="h-2 rounded bg-primary" style={{ width: `${value}%` }} /></div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded border border-border-gray p-4">
                <div className="mb-3 flex items-center gap-2 font-bold"><Sparkles className="h-4 w-4 text-primary" /> AI综合评价</div>
                <p className="leading-7 text-text-dark">{activeWorker.profile}</p>
              </section>

              <section className="rounded border border-border-gray p-4">
                <div className="mb-3 flex items-center gap-2 font-bold"><Award className="h-4 w-4 text-primary" /> 工人标签</div>
                <div className="flex flex-wrap gap-2">
                  {activeWorker.tags.map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded border border-border-gray p-4">
                <div className="mb-3 flex items-center gap-2 font-bold"><Briefcase className="h-4 w-4 text-primary" /> 基础信息</div>
                <Info label="当前项目" value={activeWorker.project} />
                <Info label="所属企业" value={activeWorker.company} />
                <Info label="当前状态" value={activeWorker.status} />
                <Info label="评价等级" value={`${activeWorker.grade}级`} />
              </section>

              <section className="rounded border border-border-gray p-4">
                <div className="mb-4 flex items-center gap-2 font-bold"><Calendar className="h-4 w-4 text-primary" /> 成长履历</div>
                <div className="space-y-4">
                  {activeWorker.history.map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
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

function Stat({ title, value, desc }) {
  return (
    <div className="rounded border border-border-gray bg-white p-4 shadow-sm">
      <div className="text-sm text-text-secondary">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-text-secondary">{desc}</div>
    </div>
  )
}

function Grade({ grade }) {
  const color = grade === 'A' ? '#52C41A' : grade === 'B' ? '#2196F3' : grade === 'C' ? '#FA8C16' : '#F5222D'
  return <span className="rounded px-2 py-1 text-xs font-bold text-white" style={{ backgroundColor: color }}>{grade}级</span>
}

function TagPill({ children }) {
  return <span className="rounded-full bg-[#E6F7FF] px-2.5 py-1 text-xs text-primary">{children}</span>
}

function Info({ label, value }) {
  return <div className="mb-3 grid grid-cols-[80px_1fr] gap-3 text-sm"><span className="text-text-secondary">{label}</span><span className="font-medium">{value}</span></div>
}
