import { useMemo, useState } from 'react'
import { Plus, Sparkles, Tag } from 'lucide-react'
import {
  Badge,
  Drawer,
  FormInput,
  FormSelect,
  FormTextarea,
  SearchBox,
  SimpleTable,
  Stat
} from './mvpShared'

const initialCategories = [
  { id: 'C-001', name: '职业资质', desc: '证书、工种、项目经验等职业能力类标签', enabled: true },
  { id: 'C-002', name: '履约能力', desc: '出勤、稳定性、连续履约表现类标签', enabled: true },
  { id: 'C-003', name: '安全行为', desc: '安全奖励、处罚、培训和风险类标签', enabled: true },
  { id: 'C-004', name: '工作效率', desc: '有效工时、质量奖励、整改记录类标签', enabled: true },
  { id: 'C-005', name: '信用记录', desc: '投诉、劳资纠纷、诚信异常类标签', enabled: true },
  { id: 'C-006', name: '综合评价', desc: 'A级工人、重点关注等综合评价标签', enabled: true }
]

// 标签分类为静态字典，标签管理仅允许选择已发布的分类。
const tagCategoryOptions = initialCategories.map((item) => item.name)

const initialTags = [
  { id: 'T-001', name: 'A级工人', category: '综合评价', property: '正向', color: '#2196F3', desc: '综合评价达到A级的优秀工人', enabled: true, ruleConfig: { logic: 'AND', conditions: [{ source: '综合评分', field: '综合评分', operator: '大于等于', value: '90' }, { source: '综合评分', field: '评价等级', operator: '等于', value: 'A' }] } },
  { id: 'T-002', name: '履约稳定', category: '履约能力', property: '正向', color: '#2196F3', desc: '出勤稳定且连续出勤表现优秀', enabled: true, ruleConfig: { logic: 'AND', conditions: [{ source: '系统计算', field: '有效工时占比', operator: '大于等于', value: '96' }, { source: '系统计算', field: '连续缺勤天数', operator: '小于等于', value: '0' }] } },
  { id: 'T-003', name: '安全之星', category: '安全行为', property: '正向', color: '#2196F3', desc: '获得项目安全奖励的工人', enabled: true, ruleConfig: { logic: 'AND', conditions: [{ source: '评价数据采集', field: '奖励事项', operator: '等于', value: '安全之星' }] } },
  { id: 'T-004', name: '重点关注', category: '安全行为', property: '警示', color: '#F5222D', desc: '存在安全或履约风险，需要项目关注', enabled: true, ruleConfig: { logic: 'AND', conditions: [{ source: '评价数据采集', field: '处罚事项', operator: '等于', value: '安全整改' }] } },
  { id: 'T-005', name: '健康合格', category: '职业资质', property: '正向', color: '#2196F3', desc: '最新体检结论合格', enabled: true, ruleConfig: { logic: 'AND', conditions: [{ source: '评价数据采集', field: '是否合格', operator: '等于', value: '是' }] } }
]

const emptyTag = { id: '', name: '', category: '综合评价', property: '正向', color: '#2196F3', desc: '', enabled: true, ruleConfig: { logic: 'AND', conditions: [{ source: '综合评分', field: '综合评分', operator: '大于等于', value: '' }] } }

// 分类页签已移除，以下仅保留静态字典兼容旧数据结构，不提供分类编辑入口。
const categoryDrawerOpen = false
const editingCategoryId = null
const categoryForm = { id: '', name: '', desc: '', enabled: true }
const setCategoryDrawerOpen = () => {}
const setCategoryForm = () => {}
const saveCategory = () => {}

export default function MvpTagCenter({ triggerNotification, showStats = true }) {
  const [keyword, setKeyword] = useState('')
  const [tags, setTags] = useState(() => initialTags.map((item) => ({ ...item, ruleConfig: normalizeRuleConfig(item.ruleConfig) })))
  const [tagDrawerOpen, setTagDrawerOpen] = useState(false)
  const [tagForm, setTagForm] = useState(emptyTag)
  const [editingTagId, setEditingTagId] = useState(null)

  const filteredTags = useMemo(() => {
    return tags.filter((item) => [item.id, item.name, item.category, item.property, item.desc].some((value) => value.includes(keyword)))
  }, [tags, keyword])

  const openAddTag = () => {
    setEditingTagId(null)
    setTagForm({ ...emptyTag, id: `T-${String(tags.length + 1).padStart(3, '0')}`, category: tagCategoryOptions[0], ruleConfig: normalizeRuleConfig(emptyTag.ruleConfig) })
    setTagDrawerOpen(true)
  }

  const openEditTag = (record) => {
    setEditingTagId(record.id)
    setTagForm({ ...record, ruleConfig: normalizeRuleConfig(record.ruleConfig || emptyTag.ruleConfig) })
    setTagDrawerOpen(true)
  }

  const saveTag = () => {
    if (!tagForm.name || !tagForm.ruleConfig?.conditions?.every((item) => item.basis && item.value)) {
      triggerNotification('请填写标签名称和完整标签规则', 'warning')
      return
    }
    const saved = { ...tagForm, color: tagForm.property === '警示' ? '#F5222D' : '#2196F3' }
    setTags((prev) => (editingTagId ? prev.map((item) => (item.id === editingTagId ? saved : item)) : [saved, ...prev]))
    setTagDrawerOpen(false)
    triggerNotification(editingTagId ? '标签已更新' : '标签已新增')
  }

  return (
    <div className="flex flex-col gap-5">
      {showStats && <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat icon={Tag} title="标签数量" value={tags.length} desc="" />
        <Stat title="标签分类" value={tagCategoryOptions.length} desc="静态字典分类" />
        <Stat icon={Sparkles} title="已启用标签" value={tags.filter((item) => item.enabled).length} desc="" />
      </section>}

      <section className="rounded border border-border-gray bg-white shadow-sm">
        <div>
          <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="w-full max-w-xl">
                <SearchBox value={keyword} onChange={setKeyword} placeholder="搜索标签名称、分类、属性或说明" />
              </div>
              <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white" onClick={openAddTag}>
                <Plus className="h-4 w-4" /> 新增标签
              </button>
            </div>
            <SimpleTable
              headers={['标签编号', '标签名称', '分类', '属性', '标签规则', '说明', '状态', '操作']}
              rows={filteredTags.map((item) => [
                item.id,
                <span key="name" className="rounded px-2 py-1 text-xs font-semibold text-white" style={{ backgroundColor: item.color }}>{item.name}</span>,
                item.category,
                <Badge key="property" tone={item.property === '警示' ? 'red' : 'green'}>{item.property}</Badge>,
                ruleSummary(item.ruleConfig),
                item.desc,
                <Badge key="enabled" tone={item.enabled ? 'green' : 'gray'}>{item.enabled ? '启用' : '停用'}</Badge>,
                <button key="edit" className="text-primary" onClick={() => openEditTag(item)}>编辑</button>
              ])}
            />
          </div>
        </div>

      </section>

      {categoryDrawerOpen && (
        <Drawer title={`${editingCategoryId ? '编辑' : '新增'}标签分类`} onClose={() => setCategoryDrawerOpen(false)}>
          <FormInput label="分类编号" value={categoryForm.id} onChange={(v) => setCategoryForm({ ...categoryForm, id: v })} required />
          <FormInput label="分类名称" value={categoryForm.name} onChange={(v) => setCategoryForm({ ...categoryForm, name: v })} required />
          <FormTextarea label="分类说明" value={categoryForm.desc} onChange={(v) => setCategoryForm({ ...categoryForm, desc: v })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={categoryForm.enabled} onChange={(event) => setCategoryForm({ ...categoryForm, enabled: event.target.checked })} />
            启用该分类
          </label>
          <div className="flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setCategoryDrawerOpen(false)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={saveCategory}>保存分类</button>
          </div>
        </Drawer>
      )}

      {tagDrawerOpen && (
        <Drawer title={`${editingTagId ? '编辑' : '新增'}标签`} onClose={() => setTagDrawerOpen(false)}>
          <FormInput label="标签编号" value={tagForm.id} onChange={(v) => setTagForm({ ...tagForm, id: v })} required />
          <FormInput label="标签名称" value={tagForm.name} onChange={(v) => setTagForm({ ...tagForm, name: v })} required />
          <FormSelect label="所属分类" value={tagForm.category} onChange={(v) => setTagForm({ ...tagForm, category: v })} options={tagCategoryOptions} required />
          <FormSelect label="标签属性" value={tagForm.property} onChange={(v) => setTagForm({ ...tagForm, property: v, color: v === '警示' ? '#F5222D' : '#2196F3' })} options={['正向', '警示']} required />
          <TagRuleBuilder config={tagForm.ruleConfig} onChange={(ruleConfig) => setTagForm({ ...tagForm, ruleConfig })} />
          <FormTextarea label="标签说明" value={tagForm.desc} onChange={(v) => setTagForm({ ...tagForm, desc: v })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={tagForm.enabled} onChange={(event) => setTagForm({ ...tagForm, enabled: event.target.checked })} />
            启用该标签
          </label>
          <div className="flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setTagDrawerOpen(false)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={saveTag}>保存标签</button>
          </div>
        </Drawer>
      )}

    </div>
  )
}

const ruleBasisOptions = [
  '有效证书数量',
  '公司技能大赛获奖次数',
  '有效参与项目数量',
  '体检不合格次数',
  '有效工时占比',
  '当月出勤完成率',
  '近3个月劳务公司变更次数',
  '安全之星奖励次数',
  '安全整改记录次数',
  '质量之星奖励次数',
  '质量整改记录次数',
  '劳资纠纷记录数量',
  '连续缺勤天数',
  '考勤诚信异常次数',
  '综合评分',
  '评价等级',
  '职业资质得分',
  '履约能力得分',
  '安全行为得分',
  '工作效率得分',
  '信用记录得分'
]
const tagRuleOperators = ['等于', '不等于', '大于等于', '大于', '小于等于', '小于', '包含', '不包含']

function normalizeRuleConfig(config) {
  const conditions = (config?.conditions || []).map((condition) => ({
    basis: condition.basis || legacyRuleBasis(condition.source, condition.field, condition.value),
    operator: condition.operator || '等于',
    value: condition.value || ''
  }))
  return { logic: config?.logic || 'AND', conditions: conditions.length ? conditions : [{ basis: '综合评分', operator: '大于等于', value: '' }] }
}

function legacyRuleBasis(source, field, value) {
  if (source === '综合评分') return field || '综合评分'
  if (field === '有效工时占比') return '有效工时占比'
  if (field === '连续缺勤天数') return '连续缺勤天数'
  if (field === '考勤诚信异常次数') return '考勤诚信异常次数'
  if (field === '是否合格') return '体检不合格次数'
  if (field === '证书状态') return '有效证书数量'
  if (field === '奖励事项') return value === '安全之星' ? '安全之星奖励次数' : value === '质量之星' ? '质量之星奖励次数' : '公司技能大赛获奖次数'
  if (field === '处罚事项') return value === '质量整改' ? '质量整改记录次数' : '安全整改记录次数'
  if (field === '劳资纠纷记录') return '劳资纠纷记录数量'
  if (field === '有效项目数量' || field === '历史参与项目数') return '有效参与项目数量'
  if (field === '出勤天数') return '当月出勤完成率'
  if (field === '项目或班组变更次数') return '近3个月劳务公司变更次数'
  return field || '综合评分'
}

function TagRuleBuilder({ config, onChange }) {
  const conditions = config?.conditions || []
  const updateCondition = (index, key, value) => {
    const next = conditions.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item)
    onChange({ logic: 'AND', conditions: next })
  }
  const updateBasis = (index, basis) => {
    const next = conditions.map((item, itemIndex) => itemIndex === index ? { ...item, basis } : item)
    onChange({ logic: 'AND', conditions: next })
  }
  const addCondition = () => onChange({ logic: 'AND', conditions: [...conditions, { basis: '综合评分', operator: '等于', value: '' }] })
  const removeCondition = (index) => onChange({ logic: 'AND', conditions: conditions.filter((_, itemIndex) => itemIndex !== index) })
  return <div className="rounded bg-[#F6FAFF] p-4"><div className="mb-3 font-semibold">标签规则</div><div className="mb-3 max-w-xs"><FormSelect label="多条规则之间的关系" value={config?.logic || 'AND'} onChange={(v) => onChange({ logic: v, conditions })} options={['AND', 'OR']} required /></div><div className="space-y-3">{conditions.map((condition, index) => <div key={`${index}-${condition.basis}`} className="rounded border border-border-gray bg-white p-3"><div className="grid gap-3 md:grid-cols-3"><FormSelect label="规则依据" value={condition.basis} onChange={(v) => updateBasis(index, v)} options={ruleBasisOptions} required /><FormSelect label="运算符" value={condition.operator} onChange={(v) => updateCondition(index, 'operator', v)} options={tagRuleOperators} required /><FormInput label="条件值" value={condition.value} onChange={(v) => updateCondition(index, 'value', v)} required /></div>{conditions.length > 1 && <button className="mt-2 text-sm text-danger-red" onClick={() => removeCondition(index)}>删除此条件</button>}</div>)}</div><button className="mt-3 rounded border border-primary px-3 py-2 text-sm text-primary" onClick={addCondition}>+ 增加条件</button><div className="mt-3 rounded border border-dashed border-border-gray bg-white px-3 py-2 text-xs leading-6 text-text-secondary">自动生成：{ruleSummary(config)}</div></div>
}

function ruleSummary(config) {
  const conditions = config?.conditions || []
  if (!conditions.length) return '未配置规则'
  return conditions.map((item) => `${item.basis} ${item.operator} ${item.value || '待填写'}`).join(config.logic === 'OR' ? ' 或 ' : ' 且 ')
}
