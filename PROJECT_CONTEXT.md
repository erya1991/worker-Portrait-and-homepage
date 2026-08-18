# 项目上下文

## 项目定位

本项目是施工现场工人评价平台的 React + Vite 前端 MVP，当前用于业务验收和交互验证。它覆盖从数据采集、评价模型配置、模型执行到工人画像展示的最小闭环。

当前项目根目录：`D:\chen\codex\gongrenhuaxiang`

当前实际运行入口：`src/main.jsx` → `src/AppFixed.jsx`。

## 产品结构

左侧菜单包含五个模块：

1. **企业数据看板**：企业/组织范围内的只读多项目统计，提供“全公司/南京分公司/苏南分公司”等组织下拉，展示 7 项企业 KPI、项目运行对比、出勤率/合同签署率最低项目、企业工人库标签和 A/B/C/D 等级、近 7 日/近 15 日用工趋势；支持项目穿透到现有项目首页。
2. **首页看板**：固定单屏的项目级只读统计总览，展示人员、考勤、合同、AI 识别、评价与工人库数据；不展示待办、事件、人员明细或跨模块入口。
3. **数据采集中心**：十个平级业务页签，包括人员信息、用工信息、考勤信息、班组信息、企业信息、体检记录、奖励记录、处罚记录、证书记录和劳资纠纷；AI 智能采集作为五类业务记录页签内的操作；AI 结果在点击“完成”并确认后进入对应台账，再通过“待确认”状态和快捷筛选处理。
4. **工人评价模型**：评价维度、维度权重、指标管理、等级配置、标签分类、标签管理、模型执行、执行记录。
5. **工人画像与工人库**：工人卡片、五维雷达、综合评价、标签、项目履历和人工台账。

“标签预览”已经删除。标签分类、标签管理、模型执行和执行记录不再作为独立菜单，而是通过 `MvpIndexCenter.jsx` 嵌入“工人评价模型”页签。

## 评价指标配置规则

### 计分依据来源

评价指标不直接读取实名制、考勤或人工台账的原始字段，而是读取按“工人 + 项目 + 评价周期”生成的评价计算宽表指标。编辑评价指标时，字段名称为“计分依据来源”，并展示只读的计算口径。

当前字典包括：

- 有效证书数量
- 公司技能大赛获奖次数
- 有效参与项目数量
- 体检不合格次数
- 有效工时占比
- 当月出勤完成率
- 近3个月劳务公司变更次数
- 安全之星奖励次数
- 安全整改记录次数
- 质量之星奖励次数
- 质量整改记录次数
- 劳资纠纷记录数量
- 连续缺勤天数（兼容现有演示指标）
- 考勤诚信异常次数（兼容现有演示指标）

原始表单来源由数据采集中心负责维护，页面平级展示：

- 人员信息、用工信息、考勤信息、班组信息、企业信息；
- 体检记录、奖励记录、处罚记录、证书记录、劳资纠纷。

### 四类评分

- **基准分**：只配置指标名称、维度和默认基准分，不选择计分依据来源。
- **加分项**：选择计分依据来源，配置判定条件、单次加分值和最高加分上限。
- **扣分项**：选择计分依据来源，配置判定条件、单次扣分值和最大扣分上限。
- **权重计分**：选择计分依据来源，配置标准值和最大权重分值。规则固定为：`取值比例 = 计分依据来源值 / 标准值 × 100%`，`指标得分 = 取值比例 × 最大权重分值`，完成比例按业务规则限制在0%～100%。

表单结构为“基本信息 → 计分依据来源 → 算分规则”。“算法参数”已更名为“算分规则”。

## 权重保存约定

评价维度页签中的权重滑块只修改当前草稿。用户必须点击“保存权重配置”后才正式生效，且五个维度合计必须等于100%。存在未保存修改时，模型执行会被阻止。当前前端使用模块内存保存最近一次权重配置，刷新页面后仍会恢复初始演示数据；正式持久化由后端实现。

## 技术实现

- React 19、Vite 8、Tailwind CSS 4、lucide-react；
- `MvpDataAcquisitionCenter.jsx`：采集与人工台账；
- `MvpIndexCenter.jsx`：工人评价模型统一页签、指标字典和编辑表单；
- `MvpModelCenter.jsx`：维度权重、等级、执行和执行记录复用内容；
- `MvpTagCenter.jsx`：标签分类和标签管理复用内容；
- `MvpPortraitCenter.jsx`：工人画像与工人库；
- `EnterpriseDashboard.jsx`：企业级多项目汇总看板；
- `HomeDashboard.jsx`：项目级首页看板；
- `mock/dashboard.js`：项目维度首页 Mock 聚合数据；
- `mock/enterpriseDashboard.js`：企业级后端聚合结果 Mock，包含 7 项 KPI、项目对比、重点关注、工人标签/等级和趋势数据；
- `api/enterpriseDashboard.js`：企业看板 Mock/真实接口 adapter 边界；
- `mvpShared.jsx`：通用表单、抽屉、表格和模拟数据组件。

当前数据为浏览器内存 Mock 数据，不代表真实接口已接通。企业看板的项目数量、企业出勤、合同签署、工人库去重、评价平均分、AI 记录、AI 数据采集、项目最低 3 项、标签/等级和趋势数据均模拟后端聚合结果，前端不执行项目数据相加或百分比简单平均。正式接入时由后端统一聚合和权限过滤，页面不得直连实名制平台、海康设备或电子签章服务。首页看板中的考勤、AI、合同和评价同样只是项目级 Mock 聚合结果；实名制/闸机考勤是权威来源，AI 仅用于辅助核验；首页 AI 统计只展示“已匹配”和“陌生人”，“陌生人”仅表示当前项目人脸库比对无匹配，不得直接作为风险人员结论。企业看板不展示 AI 陌生人、风险人数、设备离线或综合项目排名。

企业数据看板使用 `activeMenu=enterprise-dashboard` 独立进入，顶部使用组织下拉选择一级“全公司”和二级分公司，显示“数据更新时间”，不提供项目选择。第二排项目运行情况对比约占 3/4 宽度，重点关注约占 1/4。项目运行情况表不展示数据状态字段，主屏固定展示前 5 项并使用适度字号、行高确保最后一行完整显示，另提供全部项目弹窗。重点关注只保留出勤率最低 3 项与合同签署率最低 3 项，使用红/橙色提醒卡和警示图标，不显示提醒数量或提示文字，指标数字在前、项目名称右对齐并在后，项目名称使用蓝色可点击样式，移除序号和查看按钮，整行点击穿透。项目运行情况表和重点关注中的项目名称调用 `onOpenProject(projectId)`，由 `AppFixed.jsx` 保存 `dashboardProjectId` 并切换到 `dashboard`，`HomeDashboard` 通过外部 `projectId` 默认选中对应项目，同时保留页面内部项目下拉。企业主屏最多展示 5 个项目，完整列表在抽屉内搜索和分页。企业工人库采用左侧带等级文字的环形图、右侧 2×2 标签卡布局，卡片高度与企业用工趋势面板对齐；用工趋势支持近 7 日/近 15 日切换，采用 React + SVG 的参考 ECharts 的企业数据图表视觉：浅灰独立画布、左右双 Y 轴、实线弱网格、渐变蓝色柱、紫色折线、节点、日期、悬浮十字线和 Tooltip。图例置于画布底部居中，可分别开关人数柱状图与出勤率折线图，默认两个指标同时展示；不常驻展示柱内人数或节点出勤率，近 7 日和近 15 日的全部具体指标均通过悬浮 Tooltip 查看；柱体按分类中心点布局避开左右坐标轴，左右轴名称对齐到各自刻度数字上方，底部不保留更新时间行。

数据采集中心的批量 AI 采集当前使用页面内存 Mock：从当前业务记录页签选择多个附件，限制为 PDF、Word、PNG，单文件不超过 20MB、批次总大小不超过 100MB；模拟异步识别状态，并按当前台账类型填充对应字段。识别结果在上传抽屉内暂存，用户点击“完成”并确认后，成功或部分识别结果才进入当前台账并标记“待确认”；当本批上传多个文件时，Mock 固定模拟其中 1 个文件识别失败，失败文件可重新上传或手动录入。手动新增记录标记“无需确认”，管理人员通过勾选“仅看待确认”筛选和左右对照确认弹窗编辑后确认，状态变为“已确认”。不再存在独立待确认列表、驳回状态或驳回操作。真实文件存储、OCR 服务、识别置信度、人员/项目匹配和去重接口仍待后端联调。

## 本地验证

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
```

当前已验证 `npm.cmd run build` 成功。`npm.cmd run lint` 通过并保留 `DataCenter.jsx` 的既有 8 条未使用导入警告；企业数据看板新增代码未产生 lint 报错。

2026-08-04 已将首页看板收敛为单屏只读统计版，并按确认意见放大字号、重排底部卡片、增加班组圆环占比图，AI 统计调整为“已匹配/陌生人”两类。2026-08-04 追加修正了班组圆环图的高度约束，底部合同、评价和数据范围卡片改为状态条、均衡进度区和数据标签布局，并增加低高度窗口的紧凑网格规则。2026-08-04 再次调整中部横向比例为人员与考勤约三分之二、AI 识别约三分之一，班组图例支持长名称换行；当前首页工人评价等级暂只展示 A、B、C、D 四个等级。2026-08-04 按 V3 确认方案移除首页统计周期、刷新和数据范围卡片，考勤/AI/合同趋势统一改为带日期和具体数量的单系列柱状图，评价区域改为 A-D 饼图与五维评分；`npm.cmd run build` 通过，`npm.cmd run lint` 仅保留 `DataCenter.jsx` 的既有未使用导入警告。2026-08-04 按本轮确认补充 A 级人数说明，班组图例增加人数与占比，并将评价等级图改为更大的实心饼图，图例通过连接线关联。
评价等级饼图在桌面断点预留 360px 左侧空间，避免放大图表及连接线图例挤压右侧五维评分。
考勤卡片右侧统计区采用紧凑间距、较小班组圆环图和自适应图例，人数与占比同一行展示，确保“今日考勤数据”及“在场班组分布”不超出中部固定高度卡片。

## 后续开发约束

- 不要将计分规则重新设计为直接读取原始表字段；新增指标应先明确评价计算宽表指标及其计算口径。
- 修改计分依据字典时，应同步更新 `MvpIndexCenter.jsx` 的字典、旧指标兼容映射和计算口径。
- 修改模型权重时，保留保存按钮、100%合计校验和未保存执行拦截。
- 新增后端接入前，应明确区分 Mock 数据、计算宽表接口和真实原始数据接口。
- 企业数据看板必须继续保持只读和多项目汇总定位，不增加审批、数据维护、风险处置、敏感人员明细或项目经营指标。
- 企业级指标必须由后端统一聚合；前端只展示、排序、处理加载/空态/错误并完成项目穿透。
- 无正式评价时企业工人库平均分显示“暂无评价”，等级区显示“暂无正式评价”，不得用 0 分或 D 级代替。

## Latest adjustments

- The “标签分类” tab is removed from the Worker Evaluation Model page.
- Tag categories are static dictionary values; there is no category CRUD entry.
- Tag management create/edit forms select “所属分类” from the static dictionary.

## Latest adjustments

- Manual data maintenance supports worker name, ID number, project, and occurrence date-range queries.
- Manual maintenance list uses “工人姓名” as the worker column label.

- The occurrence date filter is presented as one date-range query item with start and end values.

## Latest adjustments

- Data acquisition center now uses ten flat business tabs; the former “实名制数据”, “AI智能采集”, “待确认数据” and “人工数据维护” tabs are removed.
- The five ledger tabs are placed after the five real-name tabs and use underline tabs matching the confirmed reference image.
- AI batch collection is available inside the five ledger tabs. Successful and partial results write directly into the current ledger with `reviewStatus: 待确认`; manual records use `无需确认`, and confirmation changes the same row to `已确认`.
- Ledger toolbars place action buttons and query controls on separate rows, provide the `仅看待确认` checkbox filter, clickable attachment previews, and a centered two-column review modal with only `取消` and `确认` actions.
- The enterprise trend SVG uses an approximately 4.8:1 proportional canvas and must fill the trend card horizontally while keeping axes, labels, and chart geometry undistorted.
- The enterprise trend X-axis must show every available date in both the 7-day and 15-day views; detailed values remain hover-only.
