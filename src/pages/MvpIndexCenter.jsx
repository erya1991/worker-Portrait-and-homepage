import { useMemo, useState } from 'react'
import { FileText, Plus, SlidersHorizontal, Sparkles, Tag } from 'lucide-react'
import MvpModelCenter from './MvpModelCenter'
import MvpTagCenter from './MvpTagCenter'
import {
  Badge,
  dimensions,
  Drawer,
  FormInput,
  FormSelect,
  FormTextarea,
  SearchBox,
  SimpleTable,
  Stat,
  Tab
} from './mvpShared'

const dimensionCards = [
  { name: '职业资质', desc: '年龄、职业证书、项目经验和职业健康结果。', count: 5, color: '#2196F3' },
  { name: '履约能力', desc: '有效工时、出勤天数、连续缺勤和工作稳定性。', count: 4, color: '#52C41A' },
  { name: '安全行为', desc: '安全培训、安全奖励、安全处罚或整改记录。', count: 3, color: '#FA8C16' },
  { name: '工作效率', desc: '工作效率基础分、质量奖励和质量整改记录。', count: 3, color: '#13C2C2' },
  { name: '信用记录', desc: '考勤诚信异常、劳资纠纷、投诉和处罚记录。', count: 3, color: '#722ED1' }
]

const localDimensions = ['职业资质', '履约能力', '安全行为', '工作效率', '信用记录']
const dimensionOptions = dimensions?.every((item) => item.includes('�')) ? localDimensions : localDimensions
const algorithmTypes = ['基准分', '加分项', '扣分项', '权重计分']
const scoringMetrics = [
  { code: 'valid_certificate_count', name: '有效证书数量', unit: '本', definition: '评价周期截止时，工人持有且处于有效期内的职业资格及特种作业证书数量。' },
  { code: 'skill_award_count', name: '公司技能大赛获奖次数', unit: '次', definition: '评价周期内，已确认有效的公司技能大赛获奖记录数量。' },
  { code: 'valid_project_count', name: '有效参与项目数量', unit: '个', definition: '根据实名制用工、进退场或项目履历数据，按项目ID去重，统计工人实际参与过的有效项目数量。' },
  { code: 'health_unqualified_count', name: '体检不合格次数', unit: '次', definition: '评价周期内，已确认有效的体检不合格记录数量。' },
  { code: 'effective_work_ratio', name: '有效工时占比', unit: '%', definition: '评价周期内，有效工时天数占实际出勤总天数的比例。' },
  { code: 'monthly_attendance_completion_rate', name: '当月出勤完成率', unit: '%', definition: '截至模型执行日期，当月实际出勤天数占当月已过去自然日数的比例。' },
  { code: 'continuous_absence_days', name: '连续缺勤天数', unit: '天', definition: '评价周期内，工人最长一次连续缺勤的自然日天数。' },
  { code: 'labor_company_change_count_3m', name: '近3个月劳务公司变更次数', unit: '次', definition: '根据用工关系记录，统计评价日期向前3个月内劳务公司实际发生变化的次数。' },
  { code: 'safety_award_count', name: '安全之星奖励次数', unit: '次', definition: '评价周期内，已确认有效的“安全之星”奖励记录数量。' },
  { code: 'safety_rectification_count', name: '安全整改记录次数', unit: '次', definition: '读取处罚记录，筛选“处罚事项=安全整改”，统计评价周期内已确认有效的记录数量。' },
  { code: 'quality_award_count', name: '质量之星奖励次数', unit: '次', definition: '评价周期内，已确认有效的“质量之星”奖励记录数量。' },
  { code: 'quality_rectification_count', name: '质量整改记录次数', unit: '次', definition: '读取处罚记录，筛选“处罚事项=质量整改”，统计评价周期内已确认有效的记录数量。' },
  { code: 'attendance_integrity_exception_count', name: '考勤诚信异常次数', unit: '次', definition: '评价周期内，经核实确认有效的考勤诚信异常记录数量。' },
  { code: 'labor_dispute_count', name: '劳资纠纷记录数量', unit: '次', definition: '读取人工维护的劳资纠纷记录，统计评价周期内已确认有效的记录数量。' }
]
const metricOptions = scoringMetrics.map((item) => `${item.name}（${item.unit}）`)
const ruleOperators = ['大于', '大于等于', '等于', '小于等于', '小于']
const legacyMetricMap = {
  证书状态: '有效证书数量',
  奖励事项: '公司技能大赛获奖次数',
  历史参与项目数: '有效参与项目数量',
  是否合格: '体检不合格次数',
  考勤信息: '有效工时占比',
  出勤天数: '当月出勤完成率',
  连续缺勤天数: '连续缺勤天数',
  项目或班组变更次数: '近3个月劳务公司变更次数',
  处罚事项: '安全整改记录次数',
  考勤诚信异常次数: '考勤诚信异常次数',
  劳资纠纷记录: '劳资纠纷记录数量'
}

const initialIndicators = [
  { id: 'I-001', name: '职业资质基础分', dimension: '职业资质', source: '系统计算', field: '评价周期开始', algorithm: '基准分', enabled: true, desc: '职业资质维度统一基础分', condition: '进入评价周期 = 是', baseScore: 60, score: 0, maxScore: 60 },
  { id: 'I-002', name: '职业资格指数', dimension: '职业资质', source: '评价数据采集', field: '证书状态', algorithm: '加分项', enabled: true, desc: '每本有效职业资格或特种作业证书加分', condition: '证书状态 = 有效', baseScore: 0, score: 10, maxScore: 20 },
  { id: 'I-003', name: '公司技能大赛', dimension: '职业资质', source: '评价数据采集', field: '奖励事项', algorithm: '加分项', enabled: true, desc: '公司技能大赛获奖记录加分', condition: '奖励事项 = 公司技能大赛', baseScore: 0, score: 10, maxScore: 20 },
  { id: 'I-004', name: '项目经验指数', dimension: '职业资质', source: '系统计算', field: '历史参与项目数', algorithm: '加分项', enabled: true, desc: '每参与一个有效项目加分', condition: '有效项目数 >= 1', baseScore: 0, score: 2, maxScore: 10 },
  { id: 'I-005', name: '职业健康', dimension: '职业资质', source: '评价数据采集', field: '是否合格', algorithm: '扣分项', enabled: true, desc: '最近一次有效体检不合格时扣分', condition: '是否合格 = 否', baseScore: 0, score: 50, maxScore: 50 },
  { id: 'I-006', name: '有效工时指数', dimension: '履约能力', source: '系统计算', field: '考勤信息', algorithm: '权重计分', enabled: true, desc: '按每日超过8小时的有效工时天数计算占比', condition: '每日实际工时 > 8小时；有效工时天数 / 出勤总天数 × 100%', baseScore: 100, score: 70, maxScore: 100 },
  { id: 'I-007', name: '累计施工时长指数', dimension: '履约能力', source: '系统计算', field: '出勤天数', algorithm: '权重计分', enabled: true, desc: '按评价周期内出勤天数与应出勤天数计算', condition: '实际出勤天数 / 当前评价周期应出勤天数 × 100%', baseScore: 100, score: 30, maxScore: 100 },
  { id: 'I-008', name: '连续缺勤指数', dimension: '履约能力', source: '系统计算', field: '连续缺勤天数', algorithm: '扣分项', enabled: true, desc: '连续缺勤达到3天时扣分', condition: '连续缺勤天数 >= 3', baseScore: 0, score: 10, maxScore: 10 },
  { id: 'I-009', name: '工作稳定性指数', dimension: '履约能力', source: '系统计算', field: '项目或班组变更次数', algorithm: '扣分项', enabled: true, desc: '近3个月内项目或班组变更达到2次时扣分', condition: '近3个月项目或班组变更次数 >= 2', baseScore: 0, score: 10, maxScore: 10 },
  { id: 'I-010', name: '安全行为基础分', dimension: '安全行为', source: '系统计算', field: '评价周期开始', algorithm: '基准分', enabled: true, desc: '安全行为维度统一基础分', condition: '进入评价周期 = 是', baseScore: 80, score: 0, maxScore: 80 },
  { id: 'I-011', name: '安全奖励指数', dimension: '安全行为', source: '评价数据采集', field: '奖励事项', algorithm: '加分项', enabled: true, desc: '安全之星奖励每条加分', condition: '奖励事项 = 安全之星', baseScore: 0, score: 10, maxScore: 20 },
  { id: 'I-012', name: '安全整改通知单', dimension: '安全行为', source: '评价数据采集', field: '处罚事项', algorithm: '扣分项', enabled: true, desc: '每条安全整改记录扣分', condition: '处罚事项 = 安全整改', baseScore: 0, score: 10, maxScore: 100 },
  { id: 'I-013', name: '工作效率基础分', dimension: '工作效率', source: '系统计算', field: '评价周期开始', algorithm: '基准分', enabled: true, desc: '工作效率维度统一基础分', condition: '进入评价周期 = 是', baseScore: 80, score: 0, maxScore: 80 },
  { id: 'I-014', name: '质量之星激励', dimension: '工作效率', source: '评价数据采集', field: '奖励事项', algorithm: '加分项', enabled: true, desc: '质量之星奖励每条加分', condition: '奖励事项 = 质量之星', baseScore: 0, score: 10, maxScore: 20 },
  { id: 'I-015', name: '质量整改通知单', dimension: '工作效率', source: '评价数据采集', field: '处罚事项', algorithm: '扣分项', enabled: true, desc: '每条质量整改记录扣分', condition: '处罚事项 = 质量整改', baseScore: 0, score: 10, maxScore: 100 },
  { id: 'I-016', name: '信用记录基础分', dimension: '信用记录', source: '系统计算', field: '评价周期开始', algorithm: '基准分', enabled: true, desc: '信用记录维度统一基础分', condition: '进入评价周期 = 是', baseScore: 100, score: 0, maxScore: 100 },
  { id: 'I-017', name: '考勤诚信指数', dimension: '信用记录', source: '系统计算', field: '考勤诚信异常次数', algorithm: '扣分项', enabled: true, desc: '每条确认有效的考勤诚信异常扣分', condition: '确认有效的考勤诚信异常次数 >= 1', baseScore: 0, score: 20, maxScore: 100 },
  { id: 'I-018', name: '劳资纠纷指数', dimension: '信用记录', source: '评价数据采集', field: '劳资纠纷记录', algorithm: '扣分项', enabled: true, desc: '存在劳资纠纷记录时扣分', condition: '劳资纠纷记录 >= 1', baseScore: 0, score: 50, maxScore: 50 }
]

const emptyIndicator = {
  id: '',
  name: '',
  dimension: '职业资质',
  source: '工人评价宽表',
  field: '',
  algorithm: '基准分',
  enabled: true,
  desc: '',
  condition: '',
  rule: { field: '', operator: '大于', value: '0' },
  baseScore: 2,
  score: 1,
  maxScore: 2
}

const algorithmHelp = {
  基准分: {
    desc: '进入评价周期后直接赋予该指标的默认分值，不需要选择计分依据来源。',
    fields: ['baseScore']
  },
  加分项: {
    desc: '计分依据来源满足判定条件时，按其数值和单次加分值累计，并受最高加分限制。',
    fields: ['condition', 'score', 'maxScore']
  },
  扣分项: {
    desc: '计分依据来源满足判定条件时，按其数值和单次扣分值累计，并受最大扣分限制。',
    fields: ['condition', 'score', 'maxScore']
  },
  权重计分: {
    desc: '读取计分依据来源的数值，按标准值换算完成比例，再乘以最大权重分值得到指标得分。',
    fields: ['condition', 'baseScore', 'score']
  }
}

function metricNameForIndicator(item) {
  if (item.name.includes('安全奖励')) return '安全之星奖励次数'
  if (item.name.includes('质量之星')) return '质量之星奖励次数'
  if (item.name.includes('安全整改')) return '安全整改记录次数'
  if (item.name.includes('质量整改')) return '质量整改记录次数'
  return legacyMetricMap[item.field] || item.field
}

function normalizeIndicator(item) {
  if (item.algorithm === '基准分') return { ...item, source: '', field: '', condition: '', rule: null }
  const field = metricNameForIndicator(item)
  if (item.algorithm === '权重计分') return { ...item, source: '工人评价宽表', field, condition: weightFormula(), rule: null }
  const specialRule = field === '连续缺勤天数'
    ? { field, operator: '大于等于', value: '3' }
    : field === '近3个月劳务公司变更次数'
      ? { field, operator: '大于等于', value: '2' }
      : { field, operator: '大于', value: '0' }
  return { ...item, source: '工人评价宽表', field, rule: specialRule, condition: formatRule(specialRule) }
}

export default function MvpIndexCenter({ triggerNotification }) {
  const [tab, setTab] = useState('dimension')
  const [keyword, setKeyword] = useState('')
  const [indicators, setIndicators] = useState(() => initialIndicators.map(normalizeIndicator))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [indicatorForm, setIndicatorForm] = useState(emptyIndicator)
  const [editingId, setEditingId] = useState(null)

  const filteredIndicators = useMemo(() => {
    return indicators.filter((item) =>
      [item.id, item.name, item.dimension, item.field, item.algorithm, item.condition].some((value) => String(value).includes(keyword))
    )
  }, [indicators, keyword])

  const openAdd = () => {
    setEditingId(null)
    setIndicatorForm({ ...emptyIndicator, id: `I-${String(indicators.length + 1).padStart(3, '0')}`, rule: { ...emptyIndicator.rule } })
    setDrawerOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setIndicatorForm({ ...item, condition: item.algorithm === '权重计分' ? weightFormula() : item.condition, rule: item.algorithm === '权重计分' ? null : (item.rule || parseRule(item.condition, item.field)) })
    setDrawerOpen(true)
  }

  const saveIndicator = () => {
    const isBase = indicatorForm.algorithm === '基准分'
    const needsRule = ['加分项', '扣分项'].includes(indicatorForm.algorithm)
    if (!indicatorForm.name || (!isBase && (!indicatorForm.field || (needsRule && !indicatorForm.rule?.value)))) {
      triggerNotification(isBase ? '请补充指标名称和默认基准分' : '请补充指标名称、计分依据来源和算分规则', 'warning')
      return
    }
    const saved = isBase
      ? { ...indicatorForm, source: '', field: '', condition: '', rule: null }
      : { ...indicatorForm, source: '工人评价宽表', condition: needsRule ? formatRule(indicatorForm.rule) : weightFormula() }
    setIndicators((prev) => (editingId ? prev.map((item) => (item.id === editingId ? saved : item)) : [saved, ...prev]))
    setDrawerOpen(false)
    triggerNotification(editingId ? '评价指标已更新' : '评价指标已新增')
  }

  const setAlgorithm = (algorithm) => {
    const defaultMetric = scoringMetrics[0].name
    setIndicatorForm((prev) => ({
      ...prev,
      algorithm,
      source: algorithm === '基准分' ? '' : '工人评价宽表',
      field: algorithm === '基准分' ? '' : (prev.field || defaultMetric),
      condition: algorithm === '基准分' ? '' : (algorithm === '权重计分' ? weightFormula() : formatRule(prev.rule || { field: prev.field || defaultMetric, operator: '大于', value: '0' })),
      rule: algorithm === '基准分' || algorithm === '权重计分' ? null : (prev.rule || { field: prev.field || defaultMetric, operator: '大于', value: '0' }),
      baseScore: algorithm === '基准分' ? (prev.baseScore || 0) : prev.baseScore,
      score: algorithm === '加分项' || algorithm === '扣分项' ? 10 : prev.score,
      maxScore: algorithm === '基准分' ? 0 : prev.maxScore
    }))
  }

  const setMetric = (option) => {
    const field = metricNameFromOption(option)
    setIndicatorForm((prev) => {
      const rule = prev.algorithm === '权重计分' ? null : { ...(prev.rule || {}), field, operator: prev.rule?.operator || '大于', value: prev.rule?.value || '0' }
      return { ...prev, source: '工人评价宽表', field, rule, condition: prev.algorithm === '权重计分' ? weightFormula() : formatRule(rule) }
    })
  }

  const toggleIndicator = (id) => {
    setIndicators((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)))
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-7">
        <Stat icon={SlidersHorizontal} title="评价维度" value="5" desc="MVP固定五维，不新增删除" />
        <Stat icon={FileText} title="评价指标" value={indicators.length} desc="覆盖核心验收指标" />
        <Stat title="评分类型" value="4" desc="在指标管理中直接配置" />
        <Stat title="启用指标" value={indicators.filter((item) => item.enabled).length} desc="停用指标不参与模型计算" />
        <Stat icon={Tag} title="标签数量" value="5" desc="已配置的评价标签" />
        <Stat title="标签分类" value="6" desc="用于归类管理标签" />
        <Stat icon={Sparkles} title="已启用标签" value="5" desc="参与标签规则执行" />
      </section>

      <section className="rounded border border-border-gray bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border-gray p-4">
          <Tab active={tab === 'dimension'} onClick={() => setTab('dimension')}>评价维度</Tab>
          <Tab active={tab === 'indicator'} onClick={() => setTab('indicator')}>指标管理</Tab>
          <Tab active={tab === 'level'} onClick={() => setTab('level')}>等级配置</Tab>
          <Tab active={tab === 'tags'} onClick={() => setTab('tags')}>标签管理</Tab>
          <Tab active={tab === 'run'} onClick={() => setTab('run')}>模型执行</Tab>
          <Tab active={tab === 'records'} onClick={() => setTab('records')}>执行记录</Tab>
        </div>

        {tab === 'dimension' && (
          <div className="p-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {dimensionCards.map((item) => (
              <div key={item.name} className="rounded border border-border-gray p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <Badge tone="gray">{item.count}个指标</Badge>
                </div>
                <div className="text-lg font-bold">{item.name}</div>
                <div className="mt-2 min-h-16 text-sm leading-6 text-text-secondary">{item.desc}</div>
                <div className="mt-3 text-xs text-text-secondary">维度固定，可在下方配置权重。</div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-border-gray pt-5">
            <div className="mb-3 text-base font-bold">维度权重配置</div>
            <MvpModelCenter key="weight" triggerNotification={triggerNotification} activeTab="weight" embedded />
          </div>
          </div>
        )}

        {tab === 'indicator' && (
          <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="w-full max-w-xl">
                <SearchBox value={keyword} onChange={setKeyword} placeholder="搜索指标、维度、计分依据来源、评分类型或算分规则" />
              </div>
              <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white" onClick={openAdd}>
                <Plus className="h-4 w-4" /> 新增指标
              </button>
            </div>
            <SimpleTable
              headers={['指标编号', '指标名称', '所属维度', '计分依据来源', '评分类型', '算分规则', '状态', '操作']}
              rows={filteredIndicators.map((item) => [
                item.id,
                <b key="name">{item.name}</b>,
                item.dimension,
                item.field || '-',
                <Badge key="algorithm">{item.algorithm}</Badge>,
                scoreRuleSummary(item),
                <Badge key="enabled" tone={item.enabled ? 'green' : 'gray'}>{item.enabled ? '启用' : '停用'}</Badge>,
                <div key="actions" className="flex gap-3">
                  <button className="text-primary" onClick={() => openEdit(item)}>编辑</button>
                  <button className="text-text-secondary" onClick={() => toggleIndicator(item.id)}>{item.enabled ? '停用' : '启用'}</button>
                </div>
              ])}
            />
          </div>
        )}

        {tab === 'level' && <MvpModelCenter key="level" triggerNotification={triggerNotification} activeTab="level" embedded />}
        {tab === 'tags' && <MvpTagCenter key="tags" triggerNotification={triggerNotification} activeTab="tags" embedded showStats={false} />}
        {tab === 'run' && <MvpModelCenter key="run" triggerNotification={triggerNotification} activeTab="run" embedded />}
        {tab === 'records' && <MvpModelCenter key="records" triggerNotification={triggerNotification} activeTab="records" embedded />}
      </section>

      {drawerOpen && (
        <Drawer title={`${editingId ? '编辑' : '新增'}评价指标`} onClose={() => setDrawerOpen(false)} width="720px">
          <FormSection title="基本信息">
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput label="指标编号" value={indicatorForm.id} onChange={(v) => setIndicatorForm({ ...indicatorForm, id: v })} required />
              <FormInput label="指标名称" value={indicatorForm.name} onChange={(v) => setIndicatorForm({ ...indicatorForm, name: v })} required />
              <FormSelect label="所属维度" value={indicatorForm.dimension} onChange={(v) => setIndicatorForm({ ...indicatorForm, dimension: v })} options={dimensionOptions} required />
              <FormSelect label="评分类型" value={indicatorForm.algorithm} onChange={setAlgorithm} options={algorithmTypes} required />
            </div>
            <FormTextarea label="指标说明" value={indicatorForm.desc} onChange={(v) => setIndicatorForm({ ...indicatorForm, desc: v })} />
          </FormSection>
          {indicatorForm.algorithm !== '基准分' && <MetricSource form={indicatorForm} onChange={setMetric} />}
          <AlgorithmParams form={indicatorForm} onChange={setIndicatorForm} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={indicatorForm.enabled} onChange={(event) => setIndicatorForm({ ...indicatorForm, enabled: event.target.checked })} />
            启用该指标
          </label>
          <div className="flex justify-end gap-2">
            <button className="rounded border border-border-gray px-4 py-2" onClick={() => setDrawerOpen(false)}>取消</button>
            <button className="rounded bg-primary px-4 py-2 text-white" onClick={saveIndicator}>保存指标</button>
          </div>
        </Drawer>
      )}
    </div>
  )
}

function FormSection({ title, children }) {
  return <section className="rounded border border-border-gray bg-white p-4"><div className="mb-3 font-semibold">{title}</div><div className="space-y-3">{children}</div></section>
}

function MetricSource({ form, onChange }) {
  const metric = scoringMetrics.find((item) => item.name === form.field) || scoringMetrics[0]
  return (
    <FormSection title="计分依据来源">
      <FormSelect label="计分依据来源" value={metricOption(metric.name)} onChange={onChange} options={metricOptions} required />
      <div className="rounded bg-[#F6FAFF] p-3 text-sm">
        <InfoItem label="计算口径" value={metric.definition} />
      </div>
      <div className="text-xs leading-5 text-text-secondary">计分依据来源取自按工人、项目和评价周期生成的评价计算宽表。</div>
    </FormSection>
  )
}

function InfoItem({ label, value }) {
  return <div><div className="mb-1 text-xs text-text-secondary">{label}</div><div className="font-medium text-text-dark">{value}</div></div>
}

function metricOption(name) {
  const metric = scoringMetrics.find((item) => item.name === name)
  return metric ? `${metric.name}（${metric.unit}）` : metricOptions[0]
}

function metricNameFromOption(option) {
  return scoringMetrics.find((item) => metricOption(item.name) === option)?.name || scoringMetrics[0].name
}

function scoreRuleSummary(item) {
  if (item.algorithm === '基准分') return `默认基准分 ${item.baseScore} 分`
  if (item.algorithm === '权重计分') return `依据值 / 标准值 × ${item.score} 分`
  const action = item.algorithm === '加分项' ? '加' : '扣'
  return `${item.condition}；每次${action}${item.score}分，上限${item.maxScore}分`
}

function AlgorithmParams({ form, onChange }) {
  const config = algorithmHelp[form.algorithm]
  const labels = {
    condition: form.algorithm === '权重计分' ? '计算规则' : '判定条件',
    baseScore: form.algorithm === '权重计分' ? '标准值' : '默认基准分',
    score: form.algorithm === '权重计分' ? '最大权重分值' : (form.algorithm === '加分项' ? '单次加分值' : '单次扣分值'),
    maxScore: form.algorithm === '扣分项' ? '最大扣分上限' : '最高加分上限'
  }

  return (
    <div className="rounded border border-border-gray bg-[#F6FAFF] p-4">
      <div className="mb-2 font-semibold">算分规则</div>
      <p className="mb-3 text-sm leading-6 text-text-secondary">{config.desc}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {config.fields.includes('condition') && (form.algorithm === '权重计分' ? <div className="md:col-span-2 rounded border border-dashed border-border-gray bg-white p-3 text-sm"><div className="mb-1 text-text-secondary">{labels.condition}</div><div className="font-medium">取值比例 = {weightFormula()}</div><div className="mt-1 text-xs text-text-secondary">指标得分 = 取值比例 × 最大权重分值，最高不超过最大权重分值</div></div> : <RuleBuilder form={form} onChange={onChange} label={labels.condition} />)}
        {config.fields.includes('baseScore') && (
          <FormInput label={labels.baseScore} type="number" value={form.baseScore} onChange={(v) => onChange({ ...form, baseScore: v })} />
        )}
        {config.fields.includes('score') && (
          <FormInput label={labels.score} type="number" value={form.score} onChange={(v) => onChange({ ...form, score: v })} />
        )}
        {config.fields.includes('maxScore') && (
          <FormInput label={labels.maxScore} type="number" value={form.maxScore} onChange={(v) => onChange({ ...form, maxScore: v })} />
        )}
      </div>
      {['加分项', '扣分项'].includes(form.algorithm) && <div className="mt-3 rounded bg-white p-3 text-xs leading-6 text-text-secondary">{form.algorithm === '加分项' ? '加分' : '扣分'} = min（计分依据来源值 × {labels.score}，{labels.maxScore}）。只有满足判定条件时才参与计算。</div>}
    </div>
  )
}

function RuleBuilder({ form, onChange, label }) {
  const rule = form.rule || { field: form.field || '', operator: '大于', value: '0' }
  const updateRule = (key, value) => {
    const nextRule = { ...rule, field: form.field, [key]: value }
    onChange({ ...form, rule: nextRule, condition: formatRule(nextRule) })
  }
  return <div className="md:col-span-2"><div className="mb-1 text-sm text-text-secondary">{label}</div><div className="grid gap-3 md:grid-cols-3"><ReadOnlyField label="计分依据来源" value={metricOption(form.field)} /><FormSelect label="运算符" value={rule.operator} onChange={(v) => updateRule('operator', v)} options={ruleOperators} required /><FormInput label="条件值" value={rule.value} onChange={(v) => updateRule('value', v)} required /></div><div className="mt-2 rounded border border-dashed border-border-gray bg-white px-3 py-2 text-xs text-text-secondary">当前规则：{formatRule({ ...rule, field: form.field }) || '请填写判定条件'}</div></div>
}

function ReadOnlyField({ label, value }) {
  return <div className="text-sm"><div className="mb-1 text-text-secondary">{label}</div><div className="min-h-9 rounded border border-border-gray bg-[#F5F7FA] px-3 py-2 text-text-dark">{value}</div></div>
}

function formatRule(rule) {
  if (!rule?.field || !rule?.value) return ''
  return `${rule.field} ${rule.operator} ${rule.value}`
}

function parseRule(condition, field) {
  const operators = ['大于等于', '小于等于', '不等于', '包含', '等于', '大于', '小于']
  const operator = operators.find((item) => condition?.includes(` ${item} `))
  if (!operator) return { field, operator: '等于', value: '' }
  const [ruleField, ...rest] = condition.split(` ${operator} `)
  return { field: ruleField || field, operator, value: rest.join(` ${operator} `) }
}

function weightFormula() {
  return '计分依据来源值 / 标准值 × 100%'
}
