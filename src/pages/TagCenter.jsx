import { useMemo, useState } from 'react'
import { Edit, Plus, Search, Sparkles, Tag, Workflow, X } from 'lucide-react'

const categories = [
  { name: '能力标签', count: 4, desc: '技能证书、工种能力、项目经验' },
  { name: '履约标签', count: 3, desc: '考勤、连续出勤、履约表现' },
  { name: '安全标签', count: 4, desc: '安全培训、违章处罚、安全表彰' },
  { name: '健康标签', count: 2, desc: '体检合格、职业禁忌' },
  { name: '信用标签', count: 2, desc: '投诉、纠纷、黑名单记录' }
]

const initialTags = [
  { id: 'T-001', name: 'A级工人', category: '能力标签', method: '系统生成', rule: '综合评分 >= 90', hits: 126, color: '#2196F3', desc: '综合评分达到A级的优秀工人' },
  { id: 'T-002', name: '连续出勤', category: '履约标签', method: '系统生成', rule: '连续出勤 >= 180天', hits: 84, color: '#52C41A', desc: '长期稳定出勤的工人' },
  { id: 'T-003', name: '安全之星', category: '安全标签', method: 'AI/人工', rule: '获得安全之星奖励', hits: 32, color: '#FA8C16', desc: '获得项目安全奖励的工人' },
  { id: 'T-004', name: '重点关注', category: '安全标签', method: '系统生成', rule: '违章次数 >= 2', hits: 9, color: '#F5222D', desc: '存在安全或履约风险的工人' },
  { id: 'T-005', name: '健康合格', category: '健康标签', method: 'AI/人工', rule: '体检结果 = 合格', hits: 216, color: '#13C2C2', desc: '体检结论合格的工人' }
]

const previewWorkers = [
  { id: 1, name: '张建国', score: 94, tags: ['A级工人', '连续出勤', '安全之星', '健康合格'] },
  { id: 2, name: '李强', score: 85, tags: ['连续出勤', '健康合格'] },
  { id: 3, name: '王朝阳', score: 72, tags: ['重点关注', '健康合格'] }
]

const emptyTag = {
  id: '',
  name: '',
  category: '能力标签',
  method: '系统生成',
  rule: '',
  hits: 0,
  color: '#2196F3',
  desc: ''
}

export default function TagCenter({ triggerNotification }) {
  const [tab, setTab] = useState('category')
  const [keyword, setKeyword] = useState('')
  const [tagsData, setTagsData] = useState(initialTags)
  const [tagForm, setTagForm] = useState(emptyTag)
  const [editingTagId, setEditingTagId] = useState(null)
  const [tagDrawerOpen, setTagDrawerOpen] = useState(false)
  const [ruleDrawerOpen, setRuleDrawerOpen] = useState(false)
  const [conditionA, setConditionA] = useState('综合评分')
  const [conditionAValue, setConditionAValue] = useState('90')
  const [conditionB, setConditionB] = useState('违章次数')
  const [conditionBValue, setConditionBValue] = useState('0')
  const [outputTag, setOutputTag] = useState('A级工人')
  const [previewId, setPreviewId] = useState(1)

  const tags = useMemo(() => {
    return tagsData.filter((item) => [item.id, item.name, item.category, item.rule].some((v) => v.includes(keyword)))
  }, [keyword, tagsData])

  const previewWorker = previewWorkers.find((item) => item.id === Number(previewId)) || previewWorkers[0]

  const openAddTag = () => {
    setEditingTagId(null)
    setTagForm({ ...emptyTag, id: `T-${String(tagsData.length + 1).padStart(3, '0')}` })
    setTagDrawerOpen(true)
  }

  const openEditTag = (item) => {
    setEditingTagId(item.id)
    setTagForm(item)
    setTagDrawerOpen(true)
  }

  const saveTag = () => {
    setTagsData((prev) => editingTagId ? prev.map((item) => (item.id === editingTagId ? tagForm : item)) : [tagForm, ...prev])
    setTagDrawerOpen(false)
    triggerNotification(editingTagId ? '标签已更新' : '标签已新增')
  }

  const saveRule = () => {
    setRuleDrawerOpen(false)
    triggerNotification('标签规则已保存')
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat title="标签数量" value={tagsData.length} desc="MVP核心标签" />
        <Stat title="标签分类" value={categories.length} desc="对应五维评价" />
        <Stat title="规则数量" value="4" desc="IF-AND-THEN" />
        <Stat title="标签预览" value="已启用" desc="支持选择工人模拟" />
      </section>

      <section className="rounded border border-border-gray bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border-gray p-4">
          <Tab active={tab === 'category'} onClick={() => setTab('category')}>标签分类</Tab>
          <Tab active={tab === 'tags'} onClick={() => setTab('tags')}>标签管理</Tab>
          <Tab active={tab === 'rule'} onClick={() => setTab('rule')}>规则配置</Tab>
          <Tab active={tab === 'preview'} onClick={() => setTab('preview')}>标签预览</Tab>
        </div>

        {tab === 'category' && (
          <div className="grid gap-4 p-4 md:grid-cols-5">
            {categories.map((item) => (
              <div key={item.name} className="rounded border border-border-gray p-4">
                <div className="mb-3 flex items-center gap-2 text-primary"><Tag className="h-4 w-4" /><span className="font-bold">{item.name}</span></div>
                <div className="text-sm text-text-secondary">{item.desc}</div>
                <div className="mt-4 text-xs text-text-secondary">{item.count} 个标签</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'tags' && (
          <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex max-w-md items-center gap-2 rounded border border-border-gray px-3 py-2">
                <Search className="h-4 w-4 text-text-secondary" />
                <input className="w-full outline-none" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜索标签、分类、规则" />
              </div>
              <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white" onClick={openAddTag}>
                <Plus className="h-4 w-4" /> 新增标签
              </button>
            </div>
            <div className="overflow-auto rounded border border-border-gray">
              <table className="b-table">
                <thead><tr><th>标签编号</th><th>标签名称</th><th>分类</th><th>生成方式</th><th>规则</th><th>命中人数</th><th>操作</th></tr></thead>
                <tbody>
                  {tags.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td><span className="rounded px-2 py-1 text-white" style={{ backgroundColor: item.color }}>{item.name}</span></td>
                      <td>{item.category}</td>
                      <td>{item.method}</td>
                      <td>{item.rule}</td>
                      <td>{item.hits}</td>
                      <td><button className="text-primary" onClick={() => openEditTag(item)}><Edit className="inline h-4 w-4" /> 编辑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'rule' && (
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_360px]">
            <div className="rounded border border-border-gray p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-bold"><Workflow className="h-5 w-5 text-primary" /> IF-AND-THEN 标签规则</div>
                <button className="rounded bg-primary px-4 py-2 text-white" onClick={() => setRuleDrawerOpen(true)}>编辑规则</button>
              </div>
              <div className="rounded bg-[#FAFAFA] p-4 text-sm">
                IF {conditionA} ≥ {conditionAValue} AND {conditionB} = {conditionBValue} THEN 生成“{outputTag}”
              </div>
            </div>
            <div className="rounded border border-border-gray bg-[#F6FAFF] p-5">
              <div className="mb-3 flex items-center gap-2 font-bold text-primary"><Sparkles className="h-4 w-4" /> 规则翻译</div>
              <p className="text-sm leading-6">
                当工人的 <b>{conditionA}</b> 满足 <b>{conditionAValue}</b>，并且 <b>{conditionB}</b> 满足 <b>{conditionBValue}</b> 时，系统自动生成 <b>{outputTag}</b> 标签。
              </p>
            </div>
          </div>
        )}

        {tab === 'preview' && (
          <div className="grid gap-4 p-4 lg:grid-cols-[300px_1fr]">
            <div className="rounded border border-border-gray p-5">
              <label className="text-sm">
                <span className="mb-1 block text-text-secondary">选择工人</span>
                <select className="w-full rounded border border-border-gray px-3 py-2" value={previewId} onChange={(e) => setPreviewId(e.target.value)}>
                  {previewWorkers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <button className="mt-5 rounded bg-primary px-4 py-2 text-white" onClick={() => triggerNotification('已根据当前规则生成标签预览')}>生成预览</button>
            </div>
            <div className="rounded border border-border-gray p-5">
              <div className="mb-2 text-lg font-bold">{previewWorker.name}</div>
              <div className="mb-4 text-sm text-text-secondary">综合评分：{previewWorker.score} 分</div>
              <div className="flex flex-wrap gap-2">
                {previewWorker.tags.map((item) => <span key={item} className="rounded-full bg-[#E6F7FF] px-3 py-1 text-sm text-primary">{item}</span>)}
              </div>
            </div>
          </div>
        )}
      </section>

      {tagDrawerOpen && (
        <Drawer title={`${editingTagId ? '编辑' : '新增'}标签`} onClose={() => setTagDrawerOpen(false)}>
          <FormInput label="标签编号" value={tagForm.id} onChange={(v) => setTagForm({ ...tagForm, id: v })} />
          <FormInput label="标签名称" value={tagForm.name} onChange={(v) => setTagForm({ ...tagForm, name: v })} />
          <FormSelect label="所属分类" value={tagForm.category} onChange={(v) => setTagForm({ ...tagForm, category: v })} options={categories.map((item) => item.name)} />
          <FormSelect label="生成方式" value={tagForm.method} onChange={(v) => setTagForm({ ...tagForm, method: v })} options={['系统生成', 'AI/人工', '人工维护']} />
          <FormInput label="生成规则" value={tagForm.rule} onChange={(v) => setTagForm({ ...tagForm, rule: v })} />
          <FormInput label="标签颜色" value={tagForm.color} onChange={(v) => setTagForm({ ...tagForm, color: v })} />
          <FormTextarea label="标签说明" value={tagForm.desc} onChange={(v) => setTagForm({ ...tagForm, desc: v })} />
          <div className="mt-5 flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setTagDrawerOpen(false)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={saveTag}>保存标签</button>
          </div>
        </Drawer>
      )}

      {ruleDrawerOpen && (
        <Drawer title="编辑标签生成规则" onClose={() => setRuleDrawerOpen(false)}>
          <FormSelect label="IF 条件一" value={conditionA} onChange={setConditionA} options={['综合评分', '连续出勤天数', '体检结果', '获得奖励']} />
          <FormInput label="条件一取值" value={conditionAValue} onChange={setConditionAValue} />
          <FormSelect label="AND 条件二" value={conditionB} onChange={setConditionB} options={['违章次数', '安全培训', '证书数量', '投诉次数']} />
          <FormInput label="条件二取值" value={conditionBValue} onChange={setConditionBValue} />
          <FormSelect label="THEN 生成标签" value={outputTag} onChange={setOutputTag} options={tagsData.map((item) => item.name)} />
          <div className="mt-5 flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setRuleDrawerOpen(false)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={saveRule}>保存规则</button>
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

function FormInput({ label, value, onChange }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-secondary">{label}</span>
      <input className="w-full rounded border border-border-gray px-3 py-2 outline-none focus:border-primary" value={value} onChange={(e) => onChange(e.target.value)} />
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
