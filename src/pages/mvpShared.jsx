/* eslint-disable react/only-export-components */
import { X } from 'lucide-react'

export const dimensions = ['职业资质', '履约能力', '安全行为', '工作效率', '信用记录']

export const workers = [
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
    tags: ['A级工人', '铁军排头兵', '安全之星', '健康合格'],
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

export const projects = [...new Set(workers.map((item) => item.project))]
export const companies = [...new Set(workers.map((item) => item.company))]

export function Stat({ title, value, desc, icon: Icon }) {
  return (
    <div className="rounded border border-border-gray bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-text-secondary">{title}</div>
          <div className="mt-2 text-2xl font-bold text-text-dark">{value}</div>
        </div>
        {Icon && (
          <div className="rounded bg-[#E6F7FF] p-2 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-1 text-xs text-text-secondary">{desc}</div>
    </div>
  )
}

export function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-3 py-1.5 text-sm ${
        active ? 'bg-primary text-white' : 'bg-[#F5F7FA] text-text-dark hover:bg-[#E6F7FF]'
      }`}
    >
      {children}
    </button>
  )
}

export function SearchBox({ value, onChange, placeholder }) {
  return (
    <input
      className="w-full rounded border border-border-gray px-3 py-2 text-sm outline-none focus:border-primary"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  )
}

export function Progress({ value, color = '#2196F3' }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 rounded bg-[#EDF2F7]">
        <div className="h-2 rounded" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold">{value}%</span>
    </div>
  )
}

export function Badge({ children, tone = 'blue' }) {
  const styles = {
    blue: 'bg-[#E6F7FF] text-primary',
    green: 'bg-[#F6FFED] text-success-green',
    orange: 'bg-[#FFF7E6] text-warning-orange',
    red: 'bg-[#FFF1F0] text-danger-red',
    gray: 'bg-[#F5F5F5] text-text-secondary'
  }
  return <span className={`rounded px-2 py-1 text-xs font-medium ${styles[tone]}`}>{children}</span>
}

export function Grade({ grade }) {
  const tone = grade === 'A' ? 'green' : grade === 'B' ? 'blue' : grade === 'C' ? 'orange' : 'red'
  return <Badge tone={tone}>{grade}级</Badge>
}

export function Drawer({ title, onClose, children, width = '520px' }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20">
      <div className="h-full overflow-y-auto bg-white shadow-xl" style={{ width }}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-gray bg-white px-5 py-4">
          <div className="font-bold">{title}</div>
          <button type="button" onClick={onClose} aria-label="关闭">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">{children}</div>
      </div>
    </div>
  )
}

export function FormInput({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-secondary">
        {required && <span className="mr-1 text-danger-red">*</span>}
        {label}
      </span>
      <input
        type={type}
        className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary"
        value={value}
        onChange={(event) => onChange(type === 'number' ? Number(event.target.value) : event.target.value)}
      />
    </label>
  )
}

export function FormSelect({ label, value, onChange, options, required = false }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-secondary">
        {required && <span className="mr-1 text-danger-red">*</span>}
        {label}
      </span>
      <select
        className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  )
}

export function FormTextarea({ label, value, onChange }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-secondary">{label}</span>
      <textarea
        className="min-h-24 w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export function InfoLine({ label, value }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-3 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function SimpleTable({ headers, rows }) {
  return (
    <div className="overflow-auto rounded border border-border-gray">
      <table className="b-table">
        <thead>
          <tr>
            {headers.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="py-10 text-center text-text-secondary">
                暂无数据
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Stars({ count }) {
  return <span className="text-warning-orange">{'★'.repeat(count)}{'☆'.repeat(Math.max(0, 5 - count))}</span>
}
