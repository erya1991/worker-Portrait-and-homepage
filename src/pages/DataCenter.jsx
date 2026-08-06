import { useState } from 'react'
import {
  Database,
  RefreshCw,
  Pause,
  Play,
  FileText,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Sliders,
  Trash2,
  Edit3,
  X,
  Check,
  Percent
} from 'lucide-react'

// Initial mock data for Data Sources
const INITIAL_SOURCES = [
  { id: 's1', name: '全国实名制系统数据对接端口', type: '实名制核心数据', syncMethod: '自动同步 (每小时)', updated: '2026-07-09 13:00:00', status: '正常' },
  { id: 's2', name: '项目现场闸机端刷卡数据流', type: '现场考勤打卡', syncMethod: '实时推送', updated: '2026-07-09 13:40:02', status: '正常' },
  { id: 's3', name: 'AI智能OCR单据采集微服务', type: '附件文档OCR识别', syncMethod: '自动同步 (每次上传)', updated: '2026-07-09 11:20:15', status: '正常' },
  { id: 's4', name: '外部合作医院体检中心数据同步盘', type: '体检健康数据', syncMethod: '手动同步 (批量)', updated: '2026-07-08 18:30:00', status: '异常' },
  { id: 's5', name: '分包商二级培训考勤打卡终端', type: '安全三级培训记录', syncMethod: '手动同步 (按周)', updated: '2026-07-05 17:00:00', status: '正常' }
];

// Initial mock data for Sync Logs
const INITIAL_LOGS = [
  { id: 'l1', time: '2026-07-09 13:00:00', target: '全国实名制系统接口', added: 12, updated: 84, failed: 0, duration: '2.4s', details: { status: 'success', info: '常规轮询同步完成', records: 96 } },
  { id: 'l2', time: '2026-07-09 12:00:00', target: '现场考勤打卡接口', added: 340, updated: 0, failed: 5, duration: '8.1s', details: { status: 'warning', info: '部分打卡人脸识别置信度偏低', records: 345, errors: [{ name: '李朝阳', err: '人脸库无特征点匹配(已记录待补充采集)' }, { name: '赵大海', err: '打卡时间异常偏早' }] } },
  { id: 'l3', time: '2026-07-09 11:20:15', target: 'AI智能OCR单据识别', added: 1, updated: 0, failed: 0, duration: '1.8s', details: { status: 'success', file: '20260709_体检报告_张建国.pdf', confidence: '99.4%' } },
  { id: 'l4', time: '2026-07-08 18:30:00', target: '体检中心数据同步盘', added: 0, updated: 14, failed: 3, duration: '4.6s', details: { status: 'error', info: '有3条工人档案在实名库中未匹配', records: 17, errors: [{ name: '王本善', err: '未在参建人员名单中建档' }, { name: '孙连理', err: '身份证号不存在' }] } },
  { id: 'l5', time: '2026-07-05 17:00:00', target: '分包商二级培训终端', added: 42, updated: 5, failed: 0, duration: '3.1s', details: { status: 'success', info: '安全月度主题培训考勤同步', records: 47 } }
];

// Initial mock data for Quality Dashboard
const INITIAL_ANOMALIES = [
  { id: 'a1', name: '王志强', enterprise: '北京城建劳务有限公司', type: '身份证号位数错误 (15位旧身份证)', time: '2026-07-09 10:14:22', currentValue: '370102750821234', field: 'idCard', placeholder: '请输入18位二代身份证' },
  { id: 'a2', name: '赵国栋', enterprise: '中铁建工集团劳务队', type: '手机号码格式错误 (少一位数)', time: '2026-07-09 09:30:15', currentValue: '1381234567', field: 'phone', placeholder: '请输入合法的11位手机号码' },
  { id: 'a3', name: '钱利民', enterprise: '上海建工第一劳务分包公司', type: '核心工种数据缺失', time: '2026-07-08 16:45:11', currentValue: '未指定', field: 'jobType', placeholder: '请选择或输入工种名称(如：钢筋工)' },
  { id: 'a4', name: '孙胜利', enterprise: '中铁十一局市政工程分包部', type: '考勤逻辑冲突 (退场时间早于进场)', time: '2026-07-08 14:20:00', currentValue: '进场:2026-07-09 / 退场:2026-07-08', field: 'dates', placeholder: '请重新核定进退场日期' }
];

export default function DataCenter({ triggerNotification }) {
  const [activeTab, setActiveTab] = useState('quality') // sources, logs, quality

  // Data Sources state
  const [sources, setSources] = useState(INITIAL_SOURCES)
  const [syncingSourceId, setSyncingSourceId] = useState(null)

  // Logs state
  const [logs] = useState(INITIAL_LOGS)
  const [selectedLog, setSelectedLog] = useState(null)

  // Quality dashboard stats state
  const [kpis, setKpis] = useState({
    workerCompleteness: 98.4,
    jobTypeCompleteness: 96.2,
    phoneCompleteness: 92.8,
    idCardCompleteness: 99.1,
    attendanceAnomaly: 14,
    duplicates: 8,
    totalAnomalies: 22
  })

  // Anomalies state
  const [anomalies, setAnomalies] = useState(INITIAL_ANOMALIES)
  const [fixingAnomaly, setFixingAnomaly] = useState(null)
  const [fixedValue, setFixedValue] = useState('')

  // Sync actions
  const handleSyncSource = (id, name) => {
    setSyncingSourceId(id)
    triggerNotification(`已向端口发送手动同步请求: 「${name}」...`, 'info')
    
    setTimeout(() => {
      setSyncingSourceId(null)
      setSources(prev => prev.map(s => {
        if (s.id === id) {
          return { ...s, updated: new Date().toLocaleString(), status: '正常' }
        }
        return s
      }))
      triggerNotification(`「${name}」同步完成！成功更新数据。`, 'success')
    }, 2000)
  }

  const handleTogglePause = (id, currentStatus, name) => {
    setSources(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = currentStatus === '挂起' ? '正常' : '挂起'
        triggerNotification(`已${nextStatus === '挂起' ? '暂停' : '恢复'}数据接口: 「${name}」`, 'warning')
        return { ...s, status: nextStatus }
      }
      return s
    }))
  }

  // Anomaly Correction Actions
  const openFixModal = (anomaly) => {
    setFixingAnomaly(anomaly)
    setFixedValue(anomaly.currentValue === '未指定' ? '' : anomaly.currentValue)
  }

  const handleSaveCorrection = (e) => {
    e.preventDefault()
    if (!fixedValue.trim()) {
      triggerNotification('修正值不能为空', 'error')
      return
    }

    // Process correction locally
    setAnomalies(prev => prev.filter(item => item.id !== fixingAnomaly.id))
    
    // Update KPI indicators
    setKpis(prev => {
      const nextTotal = prev.totalAnomalies - 1
      let updatedKpi = { ...prev, totalAnomalies: nextTotal }
      
      // Dynamically improve percentages depending on field fixed
      if (fixingAnomaly.field === 'idCard') {
        updatedKpi.idCardCompleteness = Math.min(100, parseFloat((prev.idCardCompleteness + 0.2).toFixed(1)))
      } else if (fixingAnomaly.field === 'phone') {
        updatedKpi.phoneCompleteness = Math.min(100, parseFloat((prev.phoneCompleteness + 0.6).toFixed(1)))
      } else if (fixingAnomaly.field === 'jobType') {
        updatedKpi.jobTypeCompleteness = Math.min(100, parseFloat((prev.jobTypeCompleteness + 0.5).toFixed(1)))
      }
      
      return updatedKpi
    })

    triggerNotification(`工人「${fixingAnomaly.name}」的 ${fixingAnomaly.field === 'idCard' ? '身份证' : fixingAnomaly.field === 'phone' ? '手机号' : '业务数据'} 已修正，数据合规审查通过！`, 'success')
    setFixingAnomaly(null)
  }

  const handleIgnoreAnomaly = (id, name) => {
    setAnomalies(prev => prev.filter(item => item.id !== id))
    setKpis(prev => ({
      ...prev,
      totalAnomalies: prev.totalAnomalies - 1
    }))
    triggerNotification(`已将工人「${name}」的该项异常数据标记为“忽略”`, 'warning')
  }

  return (
    <div className="flex-grow flex flex-col gap-6">
      
      {/* Upper Navigation Tabs */}
      <div className="bg-white border border-border-gray rounded shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            数据源与质量审计中心
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            监控平台核心数据流接口对接状态，审计底层拉取日志，清洗修正不合规字段以维护评价画像准确度。
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'quality' ? 'bg-[#11356A] text-white shadow-sm' : 'text-text-secondary hover:text-primary'
            }`}
          >
            📊 数据质量监控
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'sources' ? 'bg-[#11356A] text-white shadow-sm' : 'text-text-secondary hover:text-primary'
            }`}
          >
            🔌 数据来源管理
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'logs' ? 'bg-[#11356A] text-white shadow-sm' : 'text-text-secondary hover:text-primary'
            }`}
          >
            📋 同步日志审计
          </button>
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="flex-1 bg-white border border-border-gray rounded shadow-sm flex flex-col min-h-[450px]">
        
        {/* ================= Tab 1: 数据质量监控 Dashboard ================= */}
        {activeTab === 'quality' && (
          <div className="p-6 flex flex-col gap-6 flex-grow">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              
              {/* 1. 人员完整率 */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded flex flex-col justify-between shadow-sm">
                <div className="text-[11px] text-text-secondary font-bold">人员完整率</div>
                <div className="text-lg font-black text-text-dark my-1">{kpis.workerCompleteness}%</div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                  <div className="bg-success-green h-1.5 rounded-full" style={{ width: `${kpis.workerCompleteness}%` }}></div>
                </div>
              </div>

              {/* 2. 工种完整率 */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded flex flex-col justify-between shadow-sm">
                <div className="text-[11px] text-text-secondary font-bold">工种完整率</div>
                <div className="text-lg font-black text-text-dark my-1">{kpis.jobTypeCompleteness}%</div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                  <div className="bg-success-green h-1.5 rounded-full" style={{ width: `${kpis.jobTypeCompleteness}%` }}></div>
                </div>
              </div>

              {/* 3. 手机号完整率 */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded flex flex-col justify-between shadow-sm">
                <div className="text-[11px] text-text-secondary font-bold">手机号完整率</div>
                <div className="text-lg font-black text-text-dark my-1">{kpis.phoneCompleteness}%</div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                  <div className="bg-warning-orange h-1.5 rounded-full" style={{ width: `${kpis.phoneCompleteness}%` }}></div>
                </div>
              </div>

              {/* 4. 身份证完整率 */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded flex flex-col justify-between shadow-sm">
                <div className="text-[11px] text-text-secondary font-bold">身份证完整率</div>
                <div className="text-lg font-black text-text-dark my-1">{kpis.idCardCompleteness}%</div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                  <div className="bg-success-green h-1.5 rounded-full" style={{ width: `${kpis.idCardCompleteness}%` }}></div>
                </div>
              </div>

              {/* 5. 考勤异常数 */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded flex flex-col justify-between shadow-sm">
                <div className="text-[11px] text-text-secondary font-bold">考勤异常数</div>
                <div className="text-lg font-black text-warning-orange my-1">{kpis.attendanceAnomaly} 项</div>
                <span className="text-[10px] text-text-secondary">本月采集数据</span>
              </div>

              {/* 6. 重复人员数 */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded flex flex-col justify-between shadow-sm">
                <div className="text-[11px] text-text-secondary font-bold">重复人员数</div>
                <div className="text-lg font-black text-warning-orange my-1">{kpis.duplicates} 人</div>
                <span className="text-[10px] text-text-secondary">涉及跨班组/复建</span>
              </div>

              {/* 7. 异常总数量 */}
              <div className="bg-red-50 border border-red-200 p-3 rounded flex flex-col justify-between shadow-sm">
                <div className="text-[11px] text-red-800 font-bold">待修正总异常</div>
                <div className="text-lg font-black text-danger-red my-1">{kpis.totalAnomalies} 条</div>
                <div className="flex items-center gap-1 text-[9px] text-red-600 font-medium">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>数据评测权重降低</span>
                </div>
              </div>

            </div>

            {/* Bottom: Anomaly Data List Table */}
            <div className="flex-1 flex flex-col gap-3 min-h-[300px]">
              <div className="text-xs font-bold text-text-dark flex items-center gap-2 border-l-4 border-danger-red pl-2.5">
                <span>系统异常合规排查清单 (清洗池)</span>
                <span className="text-[10px] font-normal text-text-secondary bg-slate-100 px-2 py-0.5 rounded">
                  实时捕捉不规范数据
                </span>
              </div>

              <div className="border border-border-gray rounded-lg overflow-hidden flex-1 overflow-x-auto">
                <table className="b-table">
                  <thead>
                    <tr>
                      <th>工人姓名</th>
                      <th>劳务所属分包企业</th>
                      <th>异常类型说明</th>
                      <th>异常当前字段值</th>
                      <th>检测捕捉时间</th>
                      <th className="text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anomalies.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12">
                          <div className="flex flex-col items-center gap-2 text-success-green">
                            <CheckCircle className="h-8 w-8" />
                            <span className="text-sm font-bold text-text-dark">所有同步数据均符合国家与集团规范，数据清洗池已空！</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      anomalies.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="font-bold text-text-dark">{item.name}</td>
                          <td className="text-xs max-w-[200px] truncate" title={item.enterprise}>{item.enterprise}</td>
                          <td>
                            <span className="bg-red-50 text-danger-red border border-red-100 text-[11px] px-2 py-0.5 rounded font-medium inline-flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 shrink-0" />
                              {item.type}
                            </span>
                          </td>
                          <td className="font-mono text-xs text-text-secondary">{item.currentValue}</td>
                          <td className="text-xs text-text-secondary">{item.time}</td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openFixModal(item)}
                                className="text-white bg-primary hover:bg-primary-hover px-2.5 py-1 text-xs rounded font-bold transition-colors cursor-pointer"
                              >
                                一键修正
                              </button>
                              <button
                                onClick={() => handleIgnoreAnomaly(item.id, item.name)}
                                className="text-text-secondary hover:text-text-dark border border-slate-200 px-2 py-1 text-xs rounded font-semibold bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                忽略
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= Tab 2: 数据来源管理页 ================= */}
        {activeTab === 'sources' && (
          <div className="p-6 flex flex-col gap-6 flex-grow">
            <div className="text-xs font-bold text-text-dark flex items-center justify-between border-b pb-2">
              <span>数据采集与对接通道管理</span>
              <span className="text-[10px] text-text-secondary font-normal">绿色指示灯代表通道通畅，红色为连接异常</span>
            </div>

            <div className="border border-border-gray rounded-lg overflow-x-auto">
              <table className="b-table">
                <thead>
                  <tr>
                    <th>来源系统名称</th>
                    <th>同步数据范围</th>
                    <th>配置同步频率</th>
                    <th>最近拉取同步时间</th>
                    <th>接口连接状态</th>
                    <th className="text-right">通道操作</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="font-bold text-text-dark">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-[#11356A]/75 shrink-0" />
                          {s.name}
                        </div>
                      </td>
                      <td>{s.type}</td>
                      <td className="text-xs font-medium text-text-secondary">{s.syncMethod}</td>
                      <td className="text-xs text-text-secondary font-mono">{s.updated}</td>
                      <td>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                          s.status === '正常' ? 'bg-emerald-50 text-success-green border border-emerald-100' :
                          s.status === '挂起' ? 'bg-amber-50 text-warning-orange border border-amber-100' :
                          'bg-red-50 text-danger-red border border-red-100'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            s.status === '正常' ? 'bg-success-green animate-pulse' :
                            s.status === '挂起' ? 'bg-warning-orange' :
                            'bg-danger-red animate-ping'
                          }`}></span>
                          {s.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={syncingSourceId === s.id || s.status === '挂起'}
                            onClick={() => handleSyncSource(s.id, s.name)}
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold border rounded transition-colors ${
                              s.status === '挂起'
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                : syncingSourceId === s.id
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-wait'
                                : 'bg-white border-slate-200 text-[#11356A] hover:bg-slate-50 cursor-pointer'
                            }`}
                          >
                            <RefreshCw className={`h-3 w-3 ${syncingSourceId === s.id ? 'animate-spin' : ''}`} />
                            {syncingSourceId === s.id ? '拉取中' : '手动同步'}
                          </button>
                          
                          <button
                            onClick={() => handleTogglePause(s.id, s.status, s.name)}
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold border rounded transition-colors cursor-pointer ${
                              s.status === '挂起'
                                ? 'bg-amber-50 border-amber-200 text-warning-orange hover:bg-amber-100'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {s.status === '挂起' ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                            {s.status === '挂起' ? '启动通道' : '挂起通道'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= Tab 3: 同步日志审计页 ================= */}
        {activeTab === 'logs' && (
          <div className="p-6 flex flex-col gap-6 flex-grow">
            <div className="text-xs font-bold text-text-dark flex items-center justify-between border-b pb-2">
              <span>系统运维同步行为日志 (按时间降序)</span>
              <span className="text-[10px] text-text-secondary font-normal">记录每一次拉取的数据完整率与报错审计</span>
            </div>

            <div className="border border-border-gray rounded-lg overflow-x-auto">
              <table className="b-table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>数据同步源名称</th>
                    <th>新增记录</th>
                    <th>覆写更新</th>
                    <th>失败条数</th>
                    <th>同步耗时</th>
                    <th className="text-right">详情审计</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="font-mono text-xs text-text-secondary">{log.time}</td>
                      <td className="font-bold text-text-dark">{log.target}</td>
                      <td className="font-semibold text-emerald-800">+{log.added}</td>
                      <td className="text-slate-700">{log.updated}</td>
                      <td>
                        <span className={`font-bold ${log.failed > 0 ? 'text-danger-red bg-red-50 px-2 py-0.5 rounded font-black border border-red-100' : 'text-slate-400'}`}>
                          {log.failed}
                        </span>
                      </td>
                      <td className="text-xs font-mono text-text-secondary">{log.duration}</td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-primary hover:text-primary-hover font-bold text-xs bg-primary/5 hover:bg-primary/10 border border-primary/20 px-2 py-1 rounded transition-colors cursor-pointer"
                        >
                          查看报文
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ==================== ANOMALY CORRECTION MODAL ==================== */}
      {fixingAnomaly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFixingAnomaly(null)}></div>
          <form
            onSubmit={handleSaveCorrection}
            className="relative bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col z-10 overflow-hidden animate-zoom-in"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-dark flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-primary" />
                <span>数据异常一键修正</span>
              </h3>
              <button type="button" onClick={() => setFixingAnomaly(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Fields */}
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-danger-red flex flex-col gap-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  异常详情: {fixingAnomaly.type}
                </div>
                <div>当前错误值: <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border ml-1">{fixingAnomaly.currentValue}</span></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">被修正人</label>
                <input
                  type="text"
                  disabled
                  value={`${fixingAnomaly.name} (${fixingAnomaly.enterprise})`}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-text-secondary cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark mb-1">修正输入录入</label>
                {fixingAnomaly.field === 'jobType' ? (
                  <select
                    value={fixedValue}
                    onChange={(e) => setFixedValue(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-text-dark focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- 请选择规范工种 --</option>
                    <option value="钢筋工">钢筋工</option>
                    <option value="架子工">架子工</option>
                    <option value="泥工">泥工</option>
                    <option value="电焊工">电焊工</option>
                    <option value="木工">木工</option>
                    <option value="普工">普工</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={fixedValue}
                    onChange={(e) => setFixedValue(e.target.value)}
                    placeholder={fixingAnomaly.placeholder}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark font-mono focus:ring-1 focus:ring-primary"
                  />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFixingAnomaly(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-text-dark text-xs font-bold rounded shadow-sm"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#52C41A] hover:bg-emerald-600 text-white text-xs font-bold rounded shadow cursor-pointer transition-colors"
              >
                确认修正
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== SYNC LOG JSON POPOVER ==================== */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedLog(null)}></div>
          <div className="relative bg-[#0d1117] rounded-lg shadow-2xl w-full max-w-lg flex flex-col z-10 overflow-hidden animate-zoom-in border border-slate-800">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-[#161b22] flex items-center justify-between text-slate-300">
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                <span>同步审计明细报文 (JSON 视图)</span>
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* JSON Code Area */}
            <div className="p-6 overflow-y-auto max-h-[60vh] bg-[#0d1117]">
              <pre className="text-xs text-emerald-400 font-mono overflow-x-auto leading-relaxed">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#161b22] flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-slate-300 text-xs font-bold rounded shadow border border-slate-700 cursor-pointer"
              >
                关闭审计报文
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
