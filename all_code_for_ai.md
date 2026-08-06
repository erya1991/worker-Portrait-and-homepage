# Worker Evaluation Platform Code Base for AI Review

This document contains the core React pages and routing logic for the construction worker evaluation system.

## File: src/App.jsx

```javascript
import { useState, useRef } from 'react'
import {
  Users,
  Building2,
  Briefcase,
  UserCheck,
  HardHat,
  FileText,
  Cpu,
  Edit,
  Plus,
  Upload,
  Download,
  Check,
  AlertTriangle,
  Search,
  FileUp,
  X,
  Filter,
  Trash2,
  Calendar,
  ClipboardList,
  Award,
  Heart,
  HelpCircle,
  RefreshCw,
  Clock,
  ExternalLink,
  ShieldCheck,
  Activity,
  FileSpreadsheet,
  AlertCircle,
  Database,
  Sliders,
  Layers
} from 'lucide-react'
import DataCenter from './pages/DataCenter'
import IndexCenter from './pages/IndexCenter'
import ModelCenter from './pages/ModelCenter'
import TagCenter from './pages/TagCenter'
import PortraitCenter from './pages/PortraitCenter'
import DataAcquisitionCenter from './pages/DataAcquisitionCenter'

// Initial Mock Data
const INITIAL_WORKERS = [
  { id: '1', name: '张建国', idCard: '370102198010123456', jobType: '钢筋工', team: '钢筋一班', enterprise: '中建一局集团', status: '在场', updateTime: '2026-07-09 10:15:30', entryDate: '2026-01-10', exitDate: '-', sex: '男', age: 46, certificate: '特种作业操作证(钢筋工)', safetyStatus: '已培训且合格' },
  { id: '2', name: '李强', idCard: '420106198805247890', jobType: '架子工', team: '架子二班', enterprise: '中建一局集团', status: '在场', updateTime: '2026-07-09 09:30:12', entryDate: '2026-02-15', exitDate: '-', sex: '男', age: 38, certificate: '特种作业操作证(高处作业)', safetyStatus: '已培训且合格' },
  { id: '3', name: '王朝阳', idCard: '130102199203154567', jobType: '泥工', team: '泥工一班', enterprise: '中铁十一局', status: '在场', updateTime: '2026-07-08 17:45:00', entryDate: '2026-03-01', exitDate: '-', sex: '男', age: 34, certificate: '普通工种上岗证', safetyStatus: '已培训且合格' },
  { id: '4', name: '赵铁柱', idCard: '210103197508215678', jobType: '电焊工', team: '机电安装队', enterprise: '上海建工集团', status: '已退场', updateTime: '2026-07-05 16:20:11', entryDate: '2026-01-05', exitDate: '2026-07-05', sex: '男', age: 51, certificate: '焊接与热切割特种作业证', safetyStatus: '已培训且合格' },
  { id: '5', name: '孙红梅', idCard: '510105198511082345', jobType: '信号工', team: '塔吊班组', enterprise: '中铁十一局', status: '在场', updateTime: '2026-07-09 11:00:22', entryDate: '2026-04-10', exitDate: '-', sex: '女', age: 41, certificate: '建筑起重信号司索工证', safetyStatus: '已培训且合格' }
];

const INITIAL_ATTENDANCE = [
  { name: '张建国', date: '2026-07-09', clockIn: '07:15:32', clockOut: '17:35:10', status: '正常', location: '1号大门闸机', deviceId: 'ZJ-GATE-01' },
  { name: '李强', date: '2026-07-09', clockIn: '07:22:04', clockOut: '17:40:55', status: '正常', location: '2号大门闸机', deviceId: 'ZJ-GATE-02' },
  { name: '王朝阳', date: '2026-07-09', clockIn: '07:45:12', clockOut: '--:--:--', status: '缺卡', location: '1号大门闸机', deviceId: 'ZJ-GATE-01' },
  { name: '赵铁柱', date: '2026-07-09', clockIn: '--:--:--', clockOut: '--:--:--', status: '请假', location: '未打卡', deviceId: '无' },
  { name: '孙红梅', date: '2026-07-09', clockIn: '08:02:15', clockOut: '17:05:44', status: '迟到', location: '1号大门闸机', deviceId: 'ZJ-GATE-01' }
];

const INITIAL_EMPLOYMENT = [
  { name: '张建国', project: '北京CBD东区超高层项目', enterprise: '中建一局集团', team: '钢筋一班', jobType: '钢筋工', entryDate: '2026-01-10', exitDate: '2027-12-31' },
  { name: '李强', project: '北京CBD东区超高层项目', enterprise: '中建一局集团', team: '架子二班', jobType: '架子工', entryDate: '2026-02-15', exitDate: '2027-10-30' },
  { name: '王朝阳', project: '北京轨道交通28号线项目', enterprise: '中铁十一局', team: '泥工一班', jobType: '泥工', entryDate: '2026-03-01', exitDate: '2026-12-31' },
  { name: '赵铁柱', project: '城市绿心剧院机电安装项目', enterprise: '上海建工集团', team: '机电安装队', jobType: '电焊工', entryDate: '2026-01-05', exitDate: '2026-07-05' },
  { name: '孙红梅', project: '北京轨道交通28号线项目', enterprise: '中铁十一局', team: '塔吊班组', jobType: '信号工', entryDate: '2026-04-10', exitDate: '2027-06-30' }
];

const INITIAL_TEAMS = [
  { teamName: '钢筋一班', count: 42, leader: '雷建军', enterprise: '中建一局集团' },
  { teamName: '架子二班', count: 28, leader: '李大山', enterprise: '中建一局集团' },
  { teamName: '泥工一班', count: 35, leader: '王顺德', enterprise: '中铁十一局' },
  { teamName: '机电安装队', count: 50, leader: '钱有才', enterprise: '上海建工集团' },
  { teamName: '塔吊班组', count: 12, leader: '周小松', enterprise: '中铁十一局' }
];

const INITIAL_ENTERPRISES = [
  { enterpriseName: '中建一局集团有限公司', leader: '陈国强', workerCount: 450 },
  { enterpriseName: '中铁十一局集团有限公司', leader: '刘志军', workerCount: 380 },
  { enterpriseName: '上海建工集团股份有限公司', leader: '张海波', workerCount: 290 },
  { enterpriseName: '北京建工集团有限责任公司', leader: '赵鹏飞', workerCount: 145 }
];

// AI Sub-module Mock Data
const INITIAL_AI_HISTORY = [
  { id: '1', fileName: '20260709_体检报告_张建国.pdf', uploadTime: '2026-07-09 11:20:15', status: '待确认', type: '体检记录', size: '1.2 MB', data: { name: '张建国', idCard: '370102198010123456', date: '2026-07-08', result: '合格(符合高空作业条件)', agency: '北京市朝阳区第二医院职业健康体检中心', reward: '-', punishment: '-', confidence: 99.4 } },
  { id: '2', fileName: '20260708_百日安全个人表彰_李强.jpg', uploadTime: '2026-07-08 15:44:32', status: '已确认', type: '奖励记录', size: '3.4 MB', data: { name: '李强', idCard: '420106198805247890', date: '2026-07-08', result: '突出表现奖励', agency: '中建一局集团项目部', reward: '安全百日优秀工人表彰', punishment: '-', confidence: 97.2 } },
  { id: '3', fileName: '20260705_违规处罚通报_王朝阳.png', uploadTime: '2026-07-05 09:12:44', status: '待确认', type: '处罚记录', size: '2.1 MB', data: { name: '王朝阳', idCard: '130102199203154567', date: '2026-07-05', result: '违规进入吊装警戒区', agency: '项目安全监察部', reward: '-', punishment: '通报批评并罚款200元', confidence: 95.8 } },
  { id: '4', fileName: '20260703_三级安全教育培训_赵铁柱.docx', uploadTime: '2026-07-03 14:22:00', status: '已确认', type: '培训记录', size: '4.8 MB', data: { name: '赵铁柱', idCard: '210103197508215678', date: '2026-07-03', result: '考试分数：92分(合格)', agency: '项目部安全教育部', reward: '-', punishment: '-', confidence: 98.9 } }
];

const INITIAL_AI_TO_CONFIRM = [
  { id: 'c1', worker: '张建国', idCard: '370102198010123456', type: '体检记录', detail: '体检结果：合格；体检机构：北京市朝阳区第二医院', time: '2026-07-09 11:20:15', status: '待确认', conf: '99.4%', fileId: '1' },
  { id: 'c2', worker: '王朝阳', idCard: '130102199203154567', type: '处罚记录', detail: '违规进入吊装警戒区，罚款200元', time: '2026-07-05 09:12:44', status: '待确认', conf: '95.8%', fileId: '3' }
];

const INITIAL_AI_TEMPLATES = [
  { id: 't1', name: '标准入场体检表', format: 'PDF/图片', fields: ['姓名', '身份证号', '体检时间', '结论'], status: '启用中', updated: '2026-05-12' },
  { id: 't2', name: '违规处罚通知单', format: 'PDF/Word', fields: ['姓名', '身份证号', '违规事实', '处罚金额', '处罚时间'], status: '启用中', updated: '2026-06-01' },
  { id: 't3', name: '安全培训考评表', format: 'Excel/图片', fields: ['姓名', '工种', '培训课程', '考试成绩', '结论'], status: '启用中', updated: '2026-06-18' },
  { id: 't4', name: '技能竞赛获奖公示', format: 'Word', fields: ['姓名', '竞赛名称', '获得名次', '发证机关', '时间'], status: '待配置', updated: '2026-07-02' }
];

// Manual Sub-module Mock Data
const INITIAL_MANUAL_DATA = {
  exam: [
    { id: 'e1', name: '张建国', idCard: '370102198010123456', project: '北京CBD东区超高层项目', date: '2026-07-08', institution: '朝阳区第二医院', result: '合格', attachment: '20260708_体检报告.pdf', remarks: '复检合格' },
    { id: 'e2', name: '李强', idCard: '420106198805247890', project: '北京CBD东区超高层项目', date: '2026-06-15', institution: '建工疗养院体检中心', result: '合格', attachment: '20260615_体检表.pdf', remarks: '血压偏高，建议复查' },
    { id: 'e3', name: '王朝阳', idCard: '130102199203154567', project: '北京轨道交通28号线项目', date: '2026-05-20', institution: '中铁中心医院', result: '合格', attachment: '20260520_体检单.pdf', remarks: '无异常' }
  ],
  rewards: [
    { id: 'r1', name: '李强', idCard: '420106198805247890', title: '季度百日安全无事故先进个人', level: '项目部级', money: '500', date: '2026-07-08', agency: '中建一局项目部', attachment: '百日安全证书.pdf', remarks: '安全模范示范' },
    { id: 'r2', name: '张建国', idCard: '370102198010123456', title: '生产安全卫士奖', level: '企业级', money: '1000', date: '2026-06-01', agency: '中建一局集团', attachment: '安全卫士.pdf', remarks: '发现重大安全隐患并上报' }
  ],
  punishments: [
    { id: 'p1', name: '王朝阳', idCard: '130102199203154567', reason: '未佩戴安全帽进入施工区域', action: '通报批评并罚款', money: '200', date: '2026-07-05', recorder: '刘巡检', attachment: '罚款单20260705.pdf', remarks: '首次违规进行批评教育' }
  ],
  trainings: [
    { id: 'tr1', name: '张建国', idCard: '370102198010123456', course: '夏季防暑降温与高空防坠落安全教育', hours: '4', result: '合格', date: '2026-07-02', instructor: '赵安全', attachment: '培训签到表.pdf', remarks: '全员培训' },
    { id: 'tr2', name: '李强', idCard: '420106198805247890', course: '脚手架搭设资质复审理论与实操培训', hours: '12', result: '优秀', date: '2026-06-10', instructor: '陈高工', attachment: '特种培训证书.pdf', remarks: '特种作业专项培训' }
  ],
  contests: [
    { id: 'c1', name: '张建国', idCard: '370102198010123456', nameOfContest: '北京市第七届建筑产业工人技能竞赛', jobType: '钢筋绑扎', rank: '二等奖', date: '2026-05-18', prizeMoney: '2000', attachment: '获奖证书.pdf', remarks: '代表集团出赛' }
  ],
  honors: [
    { id: 'h1', name: '张建国', idCard: '370102198010123456', honorName: '首都杰出工匠称号', level: '省级', date: '2026-05-01', agency: '北京市总工会', attachment: '工匠证书.pdf', remarks: '重磅省级荣誉' }
  ]
};

function App() {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState('evaluation-center')
  
  // Evaluation Center Master Tab State: 1 = Realname, 2 = AI, 3 = Manual
  const [masterTab, setMasterTab] = useState(1)

  // Sub-module 1: Real-name Sub-Tabs (1 to 5)
  const [realnameSubTab, setRealnameSubTab] = useState(1)
  const [selectedWorkerDetails, setSelectedWorkerDetails] = useState(null)
  const [isWorkerDrawerOpen, setIsWorkerDrawerOpen] = useState(false)
  const [attendanceDetail, setAttendanceDetail] = useState(null)

  // Sub-module 2: AI Sub-Tabs (1 to 4)
  const [aiSubTab, setAiSubTab] = useState(1)
  const [aiHistory, setAiHistory] = useState(INITIAL_AI_HISTORY)
  const [aiToConfirm, setAiToConfirm] = useState(INITIAL_AI_TO_CONFIRM)
  const [selectedAiRecord, setSelectedAiRecord] = useState(null)
  const [isAiViewOpen, setIsAiViewOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const [checkedConfirmIds, setCheckedConfirmIds] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  // Sub-module 3: Manual Sub-Tabs/Types (1=exam, 2=rewards, 3=punishments, 4=trainings, 5=contests, 6=honors)
  const [manualTab, setManualTab] = useState(1)
  const [manualData, setManualData] = useState(INITIAL_MANUAL_DATA)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)

  // Alert/Message State
  const [notifications, setNotifications] = useState([])

  const triggerNotification = (message, type = 'success') => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 4000)
  }

  // --- AI Sub-module handlers ---
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0])
    }
  }

  const processUploadedFile = (file) => {
    setIsUploading(true)
    triggerNotification(`文件「${file.name}」上传成功，AI正在结构化提取中...`, 'info')
    
    // Simulate OCR delay
    setTimeout(() => {
      setIsUploading(false)
      const newId = (aiHistory.length + 1).toString()
      const newRecord = {
        id: newId,
        fileName: file.name,
        uploadTime: new Date().toLocaleString(),
        status: '待确认',
        type: file.name.includes('体检') ? '体检记录' : file.name.includes('奖') ? '奖励记录' : file.name.includes('罚') ? '处罚记录' : '培训记录',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        data: {
          name: '张建国', // Mock extract
          idCard: '370102198010123456',
          date: '2026-07-09',
          result: '合格(符合岗位规范要求)',
          agency: '中国建筑工程职工医院',
          reward: file.name.includes('奖') ? '安全优胜奖' : '-',
          punishment: file.name.includes('罚') ? '安全违规处罚' : '-',
          confidence: parseFloat((93 + Math.random() * 6).toFixed(1))
        }
      }
      setAiHistory(prev => [newRecord, ...prev])
      setAiToConfirm(prev => [
        {
          id: `c${Date.now()}`,
          worker: newRecord.data.name,
          idCard: newRecord.data.idCard || '370102198010123456',
          type: newRecord.type,
          detail: `AI结构化识别「${newRecord.type}」结论：${newRecord.data.result}`,
          time: newRecord.uploadTime,
          status: '待确认',
          conf: `${newRecord.data.confidence}%`,
          fileId: newId
        },
        ...prev
      ])
      triggerNotification(`AI结构化提取完毕！置信度 ${newRecord.data.confidence}%，已生成待确认台账。`, 'success')
    }, 2000)
  }

  const handleConfirmEntry = (record) => {
    // 1. Update AI History Status to '已确认'
    setAiHistory(prev => prev.map(item => item.id === record.id ? { ...item, status: '已确认' } : item))
    // 2. Remove from AI待确认
    setAiToConfirm(prev => prev.filter(item => item.fileId !== record.id))
    // 3. Add to manual maintenance ledger
    const targetType = record.type
    const resolvedIdCard = record.data.idCard || '370102198010123456'

    if (targetType === '体检记录') {
      const newRecord = {
        id: `e${Date.now()}`,
        name: record.data.name,
        idCard: resolvedIdCard,
        project: '北京CBD东区超高层项目',
        date: record.data.date,
        institution: record.data.agency,
        result: '合格',
        attachment: record.fileName,
        remarks: 'AI智能识别同步入库'
      }
      setManualData(prev => ({ ...prev, exam: [newRecord, ...prev.exam] }))
    } else if (targetType === '奖励记录') {
      const newRecord = {
        id: `r${Date.now()}`,
        name: record.data.name,
        idCard: resolvedIdCard,
        title: record.data.reward !== '-' ? record.data.reward : '安全模范奖励',
        level: '项目部级',
        money: '200',
        date: record.data.date,
        agency: record.data.agency,
        attachment: record.fileName,
        remarks: 'AI智能识别同步入库'
      }
      setManualData(prev => ({ ...prev, rewards: [newRecord, ...prev.rewards] }))
    } else if (targetType === '处罚记录') {
      const newRecord = {
        id: `p${Date.now()}`,
        name: record.data.name,
        idCard: resolvedIdCard,
        reason: record.data.punishment !== '-' ? record.data.punishment : '习惯性违章',
        action: '罚款并通报',
        money: '200',
        date: record.data.date,
        recorder: 'AI安全监控系统',
        attachment: record.fileName,
        remarks: 'AI智能识别同步入库'
      }
      setManualData(prev => ({ ...prev, punishments: [newRecord, ...prev.punishments] }))
    }

    setIsAiViewOpen(false)
    triggerNotification(`文件「${record.fileName}」数据已成功审核并同步至对应人工台账！`, 'success')
  }

  const handleBatchConfirm = () => {
    if (checkedConfirmIds.length === 0) return
    
    // Simulate batch confirm
    setAiToConfirm(prev => prev.filter(item => {
      const isChecked = checkedConfirmIds.includes(item.id)
      if (isChecked) {
        // Also update the matching record in aiHistory
        setAiHistory(h => h.map(hist => hist.id === item.fileId ? { ...hist, status: '已确认' } : hist))
        
        // Add to manual ledger
        const histItem = aiHistory.find(h => h.id === item.fileId)
        if (histItem) {
          const resolvedIdCard = histItem.data.idCard || '370102198010123456'
          if (histItem.type === '体检记录') {
            setManualData(d => ({
              ...d,
              exam: [{
                id: `e${Date.now()}_${Math.random()}`,
                name: histItem.data.name,
                idCard: resolvedIdCard,
                project: '北京CBD东区超高层项目',
                date: histItem.data.date,
                institution: histItem.data.agency,
                result: '合格',
                attachment: histItem.fileName,
                remarks: 'AI批量入库'
              }, ...d.exam]
            }))
          }
        }
      }
      return !isChecked
    }))

    setCheckedConfirmIds([])
    triggerNotification('已批量将选中识别结果审核入库！', 'success')
  }

  // --- Manual Sub-module handlers ---
  const [formData, setFormData] = useState({
    name: '张建国',
    project: '北京CBD东区超高层项目',
    date: '2026-07-09',
    institution: '',
    result: '合格',
    remarks: '',
    title: '',
    level: '项目部级',
    money: '',
    reason: '',
    action: '',
    course: '',
    hours: '',
    instructor: '',
    nameOfContest: '',
    jobType: '',
    rank: '',
    prizeMoney: '',
    honorName: '',
    agency: ''
  })

  const openAddModal = (record = null) => {
    if (record) {
      setEditingRecord(record)
      setFormData({ ...record })
    } else {
      setEditingRecord(null)
      // Reset defaults
      setFormData({
        name: '张建国',
        project: '北京CBD东区超高层项目',
        date: '2026-07-09',
        institution: '北京市朝阳区第二医院',
        result: '合格',
        remarks: '',
        title: '月度安全标兵',
        level: '项目部级',
        money: '300',
        reason: '进入现场未戴安全帽',
        action: '警告并扣减劳务积分',
        course: '三级安全入场培训',
        hours: '8',
        instructor: '雷安全员',
        nameOfContest: '北京市泥水工高空技能比武',
        jobType: '泥工',
        rank: '第三名',
        prizeMoney: '1000',
        honorName: '先进生产者',
        agency: '北京市建筑业协会'
      })
    }
    setIsAddModalOpen(true)
  }

  const handleSaveManualRecord = (e) => {
    e.preventDefault()
    
    const tabsMap = {
      1: 'exam',
      2: 'rewards',
      3: 'punishments',
      4: 'trainings',
      5: 'contests',
      6: 'honors'
    }
    const currentKey = tabsMap[manualTab]

    // Resolve idCard from INITIAL_WORKERS
    const workerObj = INITIAL_WORKERS.find(w => w.name === formData.name)
    const resolvedIdCard = workerObj ? workerObj.idCard : '370102198010123456'

    if (editingRecord) {
      setManualData(prev => ({
        ...prev,
        [currentKey]: prev[currentKey].map(item => item.id === editingRecord.id ? { ...formData, id: item.id, idCard: resolvedIdCard } : item)
      }))
      triggerNotification('台账记录修改成功', 'success')
    } else {
      const newRecord = {
        ...formData,
        id: `m_${Date.now()}`,
        idCard: resolvedIdCard,
        attachment: 'manual_upload.pdf'
      }
      setManualData(prev => ({
        ...prev,
        [currentKey]: [newRecord, ...prev[currentKey]]
      }))
      triggerNotification('新增台账记录成功', 'success')
    }
    setIsAddModalOpen(false)
  }

  const handleDeleteRecord = (id) => {
    if (confirm('确认删除此条台账记录？此操作无法撤销。')) {
      const tabsMap = {
        1: 'exam',
        2: 'rewards',
        3: 'punishments',
        4: 'trainings',
        5: 'contests',
        6: 'honors'
      }
      const currentKey = tabsMap[manualTab]
      setManualData(prev => ({
        ...prev,
        [currentKey]: prev[currentKey].filter(item => item.id !== id)
      }))
      triggerNotification('台账记录删除成功', 'warning')
    }
  }

  const handleExport = () => {
    triggerNotification('正在导出台账数据...', 'info')
    setTimeout(() => {
      triggerNotification('台账数据已成功导出为 Excel 文件！', 'success')
    }, 1500)
  }

  const handleImport = () => {
    setIsImportModalOpen(true)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-gray">
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-center gap-3 px-4 py-3 rounded shadow-lg text-white border min-w-80 animate-fade-in ${
              n.type === 'success' ? 'bg-[#52C41A] border-[#389e0d]' :
              n.type === 'warning' ? 'bg-[#FA8C16] border-[#d46b08]' :
              n.type === 'info' ? 'bg-[#1890FF] border-[#096dd9]' : 'bg-[#F5222D] border-[#cf1322]'
            }`}
          >
            {n.type === 'success' && <Check className="h-5 w-5 shrink-0" />}
            {n.type === 'warning' && <AlertTriangle className="h-5 w-5 shrink-0" />}
            {n.type === 'info' && <RefreshCw className="h-5 w-5 shrink-0 animate-spin" />}
            {n.type === 'error' && <AlertCircle className="h-5 w-5 shrink-0" />}
            <span className="font-medium text-sm">{n.message}</span>
          </div>
        ))}
      </div>

      {/* LEFT NAVIGATION BAR - White Sidebar Style (matching existing system) */}
      <aside className="w-56 bg-white flex flex-col shrink-0 border-r border-[#E8E8E8] shadow-sm">
        {/* User Profile Area */}
        <div className="p-4 border-b border-[#E8E8E8] flex items-center gap-3">
          <div className="h-10 w-10 bg-[#E6F7FF] rounded-full flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-[#2196F3]" />
          </div>
          <div>
            <h1 className="font-bold text-[13px] text-[#333] leading-tight">系统管理员</h1>
            <p className="text-[11px] text-[#999] leading-tight">中建一局安全部</p>
          </div>
        </div>

        {/* Status badges */}
        <div className="px-4 py-3 border-b border-[#E8E8E8] flex items-center gap-4 text-[12px]">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 bg-[#F5222D] rounded-full"></span>
            <span className="text-[#666]">待办</span>
            <span className="font-bold text-[#2196F3]">6</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 bg-[#FA8C16] rounded-full"></span>
            <span className="text-[#666]">通知</span>
            <span className="font-bold text-[#2196F3]">3</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-2 overflow-y-auto">
          <div className="px-4 py-2 text-[11px] font-bold text-[#999] tracking-wider">评价体系</div>

          <a
            href="#"
            onClick={() => setActiveMenu('evaluation-center')}
            className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-150 border-r-3 cursor-pointer ${
              activeMenu === 'evaluation-center' || activeMenu === 'home' ? 'bg-[#E6F7FF] text-[#2196F3] font-bold border-r-[#2196F3]' : 'text-[#333] hover:bg-[#F5F5F5] border-r-transparent'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>评价数据采集中心</span>
          </a>

          <a
            href="#"
            onClick={() => setActiveMenu('datacenter')}
            className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-150 border-r-3 cursor-pointer ${
              activeMenu === 'datacenter' ? 'bg-[#E6F7FF] text-[#2196F3] font-bold border-r-[#2196F3]' : 'text-[#333] hover:bg-[#F5F5F5] border-r-transparent'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>数据源审计中心</span>
          </a>

          <a
            href="#"
            onClick={() => setActiveMenu('indexcenter')}
            className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-150 border-r-3 cursor-pointer ${
              activeMenu === 'indexcenter' ? 'bg-[#E6F7FF] text-[#2196F3] font-bold border-r-[#2196F3]' : 'text-[#333] hover:bg-[#F5F5F5] border-r-transparent'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>评价指标配置中心</span>
          </a>

          <a
            href="#"
            onClick={() => setActiveMenu('evaluation-model')}
            className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-150 border-r-3 cursor-pointer ${
              activeMenu === 'evaluation-model' ? 'bg-[#E6F7FF] text-[#2196F3] font-bold border-r-[#2196F3]' : 'text-[#333] hover:bg-[#F5F5F5] border-r-transparent'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>工人评价模型</span>
          </a>

          <a
            href="#"
            onClick={() => setActiveMenu('tagcenter')}
            className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-150 border-r-3 cursor-pointer ${
              activeMenu === 'tagcenter' ? 'bg-[#E6F7FF] text-[#2196F3] font-bold border-r-[#2196F3]' : 'text-[#333] hover:bg-[#F5F5F5] border-r-transparent'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>智能标签配置中心</span>
          </a>

          <div className="px-4 py-2 text-[11px] font-bold text-[#999] tracking-wider mt-2">实名台账</div>

          <a
            href="#"
            onClick={() => setActiveMenu('portraitcenter')}
            className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-150 border-r-3 cursor-pointer ${
              activeMenu === 'portraitcenter' ? 'bg-[#E6F7FF] text-[#2196F3] font-bold border-r-[#2196F3]' : 'text-[#333] hover:bg-[#F5F5F5] border-r-transparent'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>人员画像与人才库</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#333] hover:bg-[#F5F5F5] border-r-3 border-r-transparent cursor-pointer"
          >
            <Clock className="h-4 w-4" />
            <span>智能考勤查询</span>
          </a>

          <div className="px-4 py-2 text-[11px] font-bold text-[#999] tracking-wider mt-2">系统安全</div>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#333] hover:bg-[#F5F5F5] border-r-3 border-r-transparent cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>实名接口监控</span>
          </a>
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-[#E8E8E8] text-[11px] text-[#999] flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-[#52C41A] rounded-full animate-pulse"></span>
            <span>接口联调：已连接</span>
          </div>
          <div className="text-[10px] text-[#BBB]">版本：v2.4.12</div>
        </div>
      </aside>

      {/* RIGHT WORK AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP STATUS BAR - Blue Header (matching existing system) */}
        <header className="h-12 bg-[#2196F3] flex items-center justify-between px-5 shrink-0 z-10 shadow-sm">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-white/20 rounded flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-bold text-[14px] tracking-wide">建筑产业工人智能评价平台</span>
          </div>

          {/* Center: Search box */}
          <div className="hidden md:flex items-center bg-white/20 rounded px-3 py-1 gap-2 w-72">
            <Search className="h-3.5 w-3.5 text-white/70" />
            <input
              type="text"
              placeholder="搜索功能、工人姓名..."
              className="bg-transparent border-none outline-none text-white text-[12px] placeholder-white/60 w-full"
            />
          </div>

          {/* Right: breadcrumb + actions */}
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-[12px]">
              {activeMenu === 'datacenter' ? '数据源与质量审计中心' :
               activeMenu === 'indexcenter' ? '评价指标配置中心' :
               activeMenu === 'evaluation-model' ? '评价模型与执行中心' :
               activeMenu === 'tagcenter' ? '智能标签配置中心' :
               activeMenu === 'portraitcenter' ? '人员画像与企业人才库' : '评价数据采集中心'}
            </span>
            <div className="h-5 w-[1px] bg-white/30"></div>
            <div className="h-7 w-7 bg-white/20 rounded-full flex items-center justify-center text-white text-[11px] font-bold cursor-pointer">
              管
            </div>
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {activeMenu === 'datacenter' ? (
            <DataCenter triggerNotification={triggerNotification} />
          ) : activeMenu === 'indexcenter' ? (
            <IndexCenter triggerNotification={triggerNotification} />
          ) : activeMenu === 'evaluation-model' ? (
            <ModelCenter triggerNotification={triggerNotification} />
          ) : activeMenu === 'tagcenter' ? (
            <TagCenter triggerNotification={triggerNotification} />
          ) : activeMenu === 'portraitcenter' ? (
            <PortraitCenter triggerNotification={triggerNotification} />
          ) : (
            <DataAcquisitionCenter triggerNotification={triggerNotification} />
          )}
      </main>
      </div>

      {/* ==================== WORKER DRAWER (REALNAME DETAILS) ==================== */}
      {isWorkerDrawerOpen && selectedWorkerDetails && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={() => setIsWorkerDrawerOpen(false)}></div>
          
          {/* Drawer container */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-border-gray flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-text-dark flex items-center gap-2">
                  <span>工人基础信息面板</span>
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] bg-blue-50 text-primary border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                    来源：实名制系统
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
                    更新时间：2026-07-09
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-success-green border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                    同步状态：正常
                  </span>
                </div>
              </div>
              <button onClick={() => setIsWorkerDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Read-only Content Form (Disabled) */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-[11px] text-[#FA8C16] flex items-start gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>实名制系统已锁定编辑。如需修改下列工人档案，请前往对应分包企业的实名采集设备端操作，系统将按周期自动覆写。</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">姓名</label>
                  <input type="text" disabled value={selectedWorkerDetails.name} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-text-secondary cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">性别</label>
                  <input type="text" disabled value={selectedWorkerDetails.sex} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-text-secondary cursor-not-allowed" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-text-secondary mb-1">身份证号</label>
                  <input type="text" disabled value={selectedWorkerDetails.idCard} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-text-secondary cursor-not-allowed font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">核心工种</label>
                  <input type="text" disabled value={selectedWorkerDetails.jobType} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-text-secondary cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">班组归属</label>
                  <input type="text" disabled value={selectedWorkerDetails.team} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-text-secondary cursor-not-allowed" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-text-secondary mb-1">所属劳动分包企业</label>
                  <input type="text" disabled value={selectedWorkerDetails.enterprise} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-text-secondary cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">进场打卡日期</label>
                  <input type="text" disabled value={selectedWorkerDetails.entryDate} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-text-secondary cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">退场注销日期</label>
                  <input type="text" disabled value={selectedWorkerDetails.exitDate} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-text-secondary cursor-not-allowed" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-text-secondary mb-1">持证资质与证书编号</label>
                  <input type="text" disabled value={selectedWorkerDetails.certificate} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-text-secondary cursor-not-allowed" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-text-secondary mb-1">安全培训记录</label>
                  <input type="text" disabled value={selectedWorkerDetails.safetyStatus} className="w-full bg-slate-100 border border-emerald-200 bg-emerald-50 rounded px-3 py-2 text-xs text-success-green font-bold cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="p-4 border-t border-border-gray bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setIsWorkerDrawerOpen(false)}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded shadow cursor-pointer transition-colors"
              >
                关闭面板
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== AI DOUBLE COLUMN VERIFICATION DIALOG ==================== */}
      {isAiViewOpen && selectedAiRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsAiViewOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col z-10 overflow-hidden animate-zoom-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-text-dark flex items-center gap-2">
                  <span>AI 识别结果双栏校对视图</span>
                  <span className="text-xs bg-[#FA8C16]/10 text-warning-orange border border-[#FA8C16]/20 px-2 py-0.5 rounded font-black">
                    待校对审核
                  </span>
                </h3>
              </div>
              <button onClick={() => setIsAiViewOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-grow flex overflow-hidden">
              {/* Left Column: Attachment PDF/Image placeholder */}
              <div className="w-1/2 p-4 border-r border-slate-200 bg-slate-100 flex flex-col justify-between overflow-y-auto">
                <div className="text-xs font-bold text-text-secondary mb-2">附件预览: {selectedAiRecord.fileName}</div>
                <div className="flex-1 bg-white border border-slate-300 rounded shadow-inner flex flex-col items-center justify-center p-6 text-center gap-3 relative min-h-[300px]">
                  {/* Mock PDF structure */}
                  <div className="absolute inset-4 border border-slate-200 p-4 text-[10px] text-left text-slate-400 space-y-4">
                    <div className="text-center font-bold text-sm text-text-dark border-b pb-2">北京市职业健康监护报告单</div>
                    <div className="grid grid-cols-2 gap-2 border-b pb-2">
                      <div>姓名：张建国</div>
                      <div>身份证：370102198010123456</div>
                      <div>科室：高处作业体检科</div>
                      <div>日期：2026-07-09</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-[11px] text-text-dark">临床诊断意见：</div>
                      <div className="text-[11px] text-emerald-600 font-bold bg-emerald-50 p-1 border border-emerald-100 rounded">
                        血压：128/82 mmHg；心电图常规无异常；血常规、尿常规化验均合格。符合高空特种作业工种上岗健康标准。
                      </div>
                    </div>
                    <div className="text-right pt-10">检测机构：北京市朝阳区第二医院 (盖章)</div>
                  </div>
                  {/* AI bounding boxes mocks */}
                  <div className="absolute top-16 left-12 border-2 border-[#FA8C16] bg-amber-500/10 px-1 py-0.5 text-[9px] text-warning-orange font-bold rounded">
                    姓名: 张建国
                  </div>
                  <div className="absolute top-24 left-12 border-2 border-[#FA8C16] bg-amber-500/10 px-1 py-0.5 text-[9px] text-warning-orange font-bold rounded">
                    身份证号
                  </div>
                  <div className="absolute bottom-20 left-12 border-2 border-[#52C41A] bg-emerald-500/10 px-1 py-0.5 text-[9px] text-success-green font-bold rounded">
                    结论意见: 合格
                  </div>
                </div>
              </div>

              {/* Right Column: AI Fields form */}
              <form className="w-1/2 p-6 overflow-y-auto space-y-4 bg-white" onSubmit={(e) => e.preventDefault()}>
                <div className="text-xs font-bold text-text-dark border-b pb-2 flex items-center justify-between">
                  <span>AI提取表单 (可编辑修正)</span>
                  <div className="text-xs text-success-green font-bold">
                    综合置信度: {selectedAiRecord.data.confidence}%
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">被评价工人姓名</label>
                  <input
                    type="text"
                    value={selectedAiRecord.data.name}
                    onChange={(e) => {
                      const updated = { ...selectedAiRecord }
                      updated.data.name = e.target.value
                      setSelectedAiRecord(updated)
                    }}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">身份证号</label>
                  <input
                    type="text"
                    value={selectedAiRecord.data.idCard}
                    onChange={(e) => {
                      const updated = { ...selectedAiRecord }
                      updated.data.idCard = e.target.value
                      setSelectedAiRecord(updated)
                    }}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark font-mono focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">识别所得日期</label>
                    <input
                      type="date"
                      value={selectedAiRecord.data.date}
                      onChange={(e) => {
                        const updated = { ...selectedAiRecord }
                        updated.data.date = e.target.value
                        setSelectedAiRecord(updated)
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">识别业务类型</label>
                    <select
                      value={selectedAiRecord.type}
                      onChange={(e) => {
                        const updated = { ...selectedAiRecord }
                        updated.type = e.target.value
                        setSelectedAiRecord(updated)
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-text-dark focus:ring-1 focus:ring-primary"
                    >
                      <option value="体检记录">体检记录</option>
                      <option value="奖励记录">奖励记录</option>
                      <option value="处罚记录">处罚记录</option>
                      <option value="培训记录">培训记录</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">检测识别结论 / 评语</label>
                  <textarea
                    rows="2"
                    value={selectedAiRecord.data.result}
                    onChange={(e) => {
                      const updated = { ...selectedAiRecord }
                      updated.data.result = e.target.value
                      setSelectedAiRecord(updated)
                    }}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark focus:ring-1 focus:ring-primary"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">关联奖励名称 (如有)</label>
                    <input
                      type="text"
                      value={selectedAiRecord.data.reward}
                      onChange={(e) => {
                        const updated = { ...selectedAiRecord }
                        updated.data.reward = e.target.value
                        setSelectedAiRecord(updated)
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">关联处罚手段 (如有)</label>
                    <input
                      type="text"
                      value={selectedAiRecord.data.punishment}
                      onChange={(e) => {
                        const updated = { ...selectedAiRecord }
                        updated.data.punishment = e.target.value
                        setSelectedAiRecord(updated)
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">识别公信机构 / 鉴定主体</label>
                  <input
                    type="text"
                    value={selectedAiRecord.data.agency}
                    onChange={(e) => {
                      const updated = { ...selectedAiRecord }
                      updated.data.agency = e.target.value
                      setSelectedAiRecord(updated)
                    }}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                  />
                </div>
              </form>
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="text-xs text-text-secondary">
                审核人: <span className="font-bold text-text-dark">中建一局安全部主管</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAiViewOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-text-dark text-xs font-bold rounded shadow-sm cursor-pointer"
                >
                  取消关闭
                </button>
                <button
                  onClick={() => {
                    triggerNotification('重新识别触发中...', 'info')
                    setTimeout(() => {
                      const updated = { ...selectedAiRecord }
                      updated.data.confidence = parseFloat((95 + Math.random() * 4.9).toFixed(1))
                      setSelectedAiRecord(updated)
                      triggerNotification('重新识别成功，置信度略微提升。', 'success')
                    }, 1000)
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-primary text-xs font-bold rounded shadow-sm cursor-pointer"
                >
                  重新识别
                </button>
                <button
                  onClick={() => {
                    triggerNotification('已保存为草稿', 'warning')
                    setIsAiViewOpen(false)
                  }}
                  className="px-4 py-2 bg-[#FA8C16] hover:bg-amber-600 text-white text-xs font-bold rounded shadow cursor-pointer transition-colors"
                >
                  保存草稿
                </button>
                <button
                  onClick={() => handleConfirmEntry(selectedAiRecord)}
                  className="px-4 py-2 bg-[#52C41A] hover:bg-emerald-600 text-white text-xs font-bold rounded shadow cursor-pointer transition-colors"
                >
                  确认入库
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MANUAL ADD/EDIT MODAL ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsAddModalOpen(false)}></div>
          <form
            className="relative bg-white rounded-lg shadow-2xl w-full max-w-xl flex flex-col z-10 overflow-hidden animate-zoom-in"
            onSubmit={handleSaveManualRecord}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-dark">
                {editingRecord ? '修改台账记录' : '新增台账记录'} - {
                  manualTab === 1 ? '体检记录' :
                  manualTab === 2 ? '奖励记录' :
                  manualTab === 3 ? '处罚记录' :
                  manualTab === 4 ? '培训记录' :
                  manualTab === 5 ? '技能竞赛' : '荣誉记录'
                }
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">被考核工人 (首选搜索)</label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-text-dark focus:ring-1 focus:ring-primary"
                  >
                    {INITIAL_WORKERS.map(w => (
                      <option key={w.id} value={w.name}>{w.name} ({w.jobType})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">归属工程项目</label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-text-dark focus:ring-1 focus:ring-primary"
                  >
                    <option value="北京CBD东区超高层项目">北京CBD东区超高层项目</option>
                    <option value="北京轨道交通28号线项目">北京轨道交通28号线项目</option>
                    <option value="城市绿心剧院机电安装项目">城市绿心剧院机电安装项目</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Sub-form based on active manualTab */}
              {/* 1. 体检 */}
              {manualTab === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">体检健康结论</label>
                      <select
                        value={formData.result}
                        onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-text-dark"
                      >
                        <option value="合格">合格</option>
                        <option value="不合格">不合格(需复检)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">体检日期</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">体检筛查机构</label>
                    <input
                      type="text"
                      required
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="例如：北京市朝阳区第二医院"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                    />
                  </div>
                </div>
              )}

              {/* 2. 奖励 */}
              {manualTab === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">奖金金额 (元)</label>
                      <input
                        type="number"
                        value={formData.money}
                        onChange={(e) => setFormData({ ...formData, money: e.target.value })}
                        placeholder="例如：500"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">奖励时间</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">奖励级别</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-text-dark"
                      >
                        <option value="项目部级">项目部级</option>
                        <option value="企业级">企业级</option>
                        <option value="省部级">省部级</option>
                        <option value="国家级">国家级</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">授予颁发单位</label>
                      <input
                        type="text"
                        value={formData.agency}
                        onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                        placeholder="例如：中建一局安全监察部"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">奖励证书/表彰名称</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="例如：百日安全卫士表彰"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                    />
                  </div>
                </div>
              )}

              {/* 3. 处罚 */}
              {manualTab === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">罚款金额 (元)</label>
                      <input
                        type="number"
                        value={formData.money}
                        onChange={(e) => setFormData({ ...formData, money: e.target.value })}
                        placeholder="例如：200"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">处罚惩戒日期</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">处置惩戒方式</label>
                      <input
                        type="text"
                        value={formData.action}
                        onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                        placeholder="例如：警告并罚款/下场清退"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">安全督查记录人</label>
                      <input
                        type="text"
                        value={formData.recorder}
                        onChange={(e) => setFormData({ ...formData, recorder: e.target.value })}
                        placeholder="例如：李监察"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">具体违规行为事实</label>
                    <textarea
                      required
                      rows="2"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="描述违规原因事实，如：进入基坑吊装区域未按规定配戴红色安全防护帽。"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* 4. 培训 */}
              {manualTab === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">培训总学时 (小时)</label>
                      <input
                        type="number"
                        value={formData.hours}
                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">考核时间</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">考核结论</label>
                      <select
                        value={formData.result}
                        onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-text-dark"
                      >
                        <option value="合格">合格</option>
                        <option value="优秀">优秀</option>
                        <option value="不合格">不合格</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">主要授课讲师</label>
                      <input
                        type="text"
                        value={formData.instructor}
                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                        placeholder="讲师姓名"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">培训课程主题</label>
                    <input
                      type="text"
                      required
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      placeholder="例如：特种塔吊高空防倾翻安全规程培训"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                    />
                  </div>
                </div>
              )}

              {/* 5. 技能竞赛 */}
              {manualTab === 5 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">参赛获评工种</label>
                      <input
                        type="text"
                        value={formData.jobType}
                        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                        placeholder="例如：电焊工"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">名次荣誉</label>
                      <input
                        type="text"
                        value={formData.rank}
                        onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                        placeholder="例如：二等奖 / 第三名"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">竞赛奖金 (元)</label>
                      <input
                        type="number"
                        value={formData.prizeMoney}
                        onChange={(e) => setFormData({ ...formData, prizeMoney: e.target.value })}
                        placeholder="1000"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">获奖日期</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">技能竞赛全称</label>
                    <input
                      type="text"
                      required
                      value={formData.nameOfContest}
                      onChange={(e) => setFormData({ ...formData, nameOfContest: e.target.value })}
                      placeholder="例如：北京市第七届建筑特种行业操作技能竞赛"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                    />
                  </div>
                </div>
              )}

              {/* 6. 荣誉记录 */}
              {manualTab === 6 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">授予荣誉级别</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-text-dark"
                      >
                        <option value="项目部级">项目部级</option>
                        <option value="企业级">企业级</option>
                        <option value="省级">省级</option>
                        <option value="国家级">国家级</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">授予表彰日期</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">授予/发证机构单位</label>
                    <input
                      type="text"
                      value={formData.agency}
                      onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                      placeholder="例如：中国建筑业协会"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">荣誉称号全称</label>
                    <input
                      type="text"
                      required
                      value={formData.honorName}
                      onChange={(e) => setFormData({ ...formData, honorName: e.target.value })}
                      placeholder="例如：全国优秀青工模范称号"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                    />
                  </div>
                </div>
              )}

              {/* Shared Fields */}
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">附件佐证资料</label>
                  <div className="border border-dashed border-slate-300 rounded p-4 flex items-center justify-center gap-2 bg-slate-50 cursor-pointer hover:bg-slate-100">
                    <Upload className="h-4 w-4 text-text-secondary" />
                    <span className="text-xs text-text-secondary">点击或拖拽上传扫描件PDF、红头文件等 (限制20M)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">备注说明</label>
                  <textarea
                    rows="2"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="输入其他补充审计信息"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-text-dark"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-text-dark text-xs font-bold rounded shadow-sm cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded shadow cursor-pointer transition-colors"
              >
                保存并入库
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MOCK ATTENDANCE LOCATION MODAL ==================== */}
      {attendanceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAttendanceDetail(null)}></div>
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col z-10 overflow-hidden animate-zoom-in">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-dark">打卡详情 - {attendanceDetail.name}</h3>
              <button onClick={() => setAttendanceDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-100 rounded-lg h-40 flex items-center justify-center relative border overflow-hidden">
                {/* Mock Map */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute h-4 w-4 bg-primary rounded-full animate-ping"></div>
                <div className="absolute h-3 w-3 bg-[#11356A] rounded-full border-2 border-white shadow"></div>
                <div className="absolute bottom-2 left-2 bg-white/95 border px-2 py-0.5 rounded text-[10px] font-bold text-text-dark">
                  地理坐标: 39.9087, 116.3975 (北京东区工地)
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div>打卡地点：<span className="font-bold text-text-dark">{attendanceDetail.location}</span></div>
                <div>考勤闸机ID：<span className="font-mono text-text-dark bg-slate-100 px-1 rounded">{attendanceDetail.deviceId}</span></div>
                <div>打卡时间：<span className="font-mono text-text-dark">{attendanceDetail.clockIn} (签到) / {attendanceDetail.clockOut} (签退)</span></div>
                <div>人脸核验状态：<span className="text-success-green font-bold flex items-center gap-1 inline-flex"><ShieldCheck className="h-3.5 w-3.5" />已通过实名核验(高可靠度)</span></div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button onClick={() => setAttendanceDetail(null)} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded shadow cursor-pointer">
                知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MOCK IMPORT EXCEL MODAL ==================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsImportModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col z-10 overflow-hidden animate-zoom-in">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-dark">批量导入 Excel 台账</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed border-slate-300 hover:border-primary rounded-lg p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer bg-slate-50 transition-colors">
                <FileSpreadsheet className="h-10 w-10 text-slate-400" />
                <span className="text-xs font-bold text-text-dark">点击选择或拖拽 Excel 文件到此处</span>
                <span className="text-[10px] text-text-secondary">仅支持 xls, xlsx 格式，单文件限 10M</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs flex flex-col gap-1 text-primary">
                <div className="font-bold flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" />
                  导入指引
                </div>
                <div>请先下载系统标准台账模板填报，确保姓名、身份证号等信息与实名制系统库中的人名完全一致，否则将无法匹配建档。</div>
                <a href="#" onClick={(e) => { e.preventDefault(); triggerNotification('已为您开始下载空模板文件...', 'success') }} className="text-xs font-bold underline mt-1 block">
                  下载「系统数据导入标准模板.xlsx」
                </a>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 bg-white border border-slate-300 text-text-dark text-xs font-bold rounded shadow-sm">
                取消
              </button>
              <button
                onClick={() => {
                  setIsImportModalOpen(false)
                  triggerNotification('Excel 表格导入解析成功！已成功批量导入 12 条记录', 'success')
                }}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded shadow"
              >
                开始解析导入
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App

```

## File: src/pages/DataAcquisitionCenter.jsx

```javascript
import { useState, useMemo, useRef } from 'react'
import {
  ShieldCheck,
  Cpu,
  Edit,
  History,
  Users,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Upload,
  Download,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  FileUp,
  ExternalLink,
  Check,
  Trash2,
  HardHat,
  Award,
  Heart,
  TrendingUp,
  Building2,
  Briefcase,
  UserCheck,
  Maximize2,
  Minimize2,
  DownloadCloud,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  Zap,
  Activity,
  Layers,
  FileSpreadsheet
} from 'lucide-react'

// Initial Workers database for Real-name tab
const INITIAL_WORKERS = [
  { id: '1', name: '张建国', sex: '男', idCard: '3701021980******56', jobType: '钢筋工', team: '钢筋一班', enterprise: '中建一局集团有限公司', project: '北京CBD东区超高层项目', entryDate: '2026-01-10', exitDate: '-', status: '在场', evalStatus: '可评价', completeness: 94, updateTime: '2026-07-09 10:15:30', certificate: '建筑施工特种作业操作证(钢筋工)', safetyStatus: '已培训且合格' },
  { id: '2', name: '李强', sex: '男', idCard: '4201061988******90', jobType: '架子工', team: '架子二班', enterprise: '中建一局集团有限公司', project: '北京CBD东区超高层项目', entryDate: '2026-02-15', exitDate: '-', status: '在场', evalStatus: '可评价', completeness: 91, updateTime: '2026-07-09 09:30:12', certificate: '建筑施工特种作业操作证(高处架子工)', safetyStatus: '已培训且合格' },
  { id: '3', name: '王朝阳', sex: '男', idCard: '1301021992******67', jobType: '泥工', team: '泥工一班', enterprise: '中铁十一局集团有限公司', project: '北京轨道交通28号线项目', entryDate: '2026-03-01', exitDate: '-', status: '在场', evalStatus: '数据缺失', completeness: 78, updateTime: '2026-07-08 17:45:00', certificate: '普通工种上岗证', safetyStatus: '已培训且合格' },
  { id: '4', name: '赵铁柱', sex: '男', idCard: '2101031975******78', jobType: '电焊工', team: '机电安装队', enterprise: '上海建工集团股份有限公司', project: '城市绿心剧院机电安装项目', entryDate: '2026-01-05', exitDate: '2026-07-05', status: '已退场', evalStatus: '可评价', completeness: 85, updateTime: '2026-07-05 16:20:11', certificate: '熔化焊接与热切割作业证', safetyStatus: '已培训且合格' },
  { id: '5', name: '孙红梅', sex: '女', idCard: '5101051985******45', jobType: '信号工', team: '塔吊班组', enterprise: '中铁十一局集团有限公司', project: '北京轨道交通28号线项目', entryDate: '2026-04-10', exitDate: '-', status: '在场', evalStatus: '暂停评价', completeness: 88, updateTime: '2026-07-09 11:00:22', certificate: '起重信号司索工特种证', safetyStatus: '已培训且合格' }
];

const INITIAL_ATTENDANCE = [
  { name: '张建国', idCard: '3701021980******56', date: '2026-07-09', clockIn: '07:15:32', clockOut: '17:35:10', status: '正常', location: '1号大门闸机', deviceId: 'GATE-01' },
  { name: '李强', idCard: '4201061988******90', date: '2026-07-09', clockIn: '07:22:04', clockOut: '17:40:55', status: '正常', location: '2号大门闸机', deviceId: 'GATE-02' },
  { name: '王朝阳', idCard: '1301021992******67', date: '2026-07-09', clockIn: '07:45:12', clockOut: '--:--:--', status: '缺卡', location: '1号大门闸机', deviceId: 'GATE-01' }
];

const INITIAL_EMPLOYMENT = [
  { name: '张建国', idCard: '3701021980******56', project: '北京CBD东区超高层项目', enterprise: '中建一局集团有限公司', team: '钢筋一班', jobType: '钢筋工', entryDate: '2026-01-10', exitDate: '-' },
  { name: '李强', idCard: '4201061988******90', project: '北京CBD东区超高层项目', enterprise: '中建一局集团有限公司', team: '架子二班', jobType: '架子工', entryDate: '2026-02-15', exitDate: '-' }
];

// AI Pending verification records
const INITIAL_AI_TO_CONFIRM = [
  { id: 'c1', worker: '张建国', idCard: '3701021980******56', type: '体检记录', detail: '体检结论：合格；心电图无明显异常。北京市朝阳区第二医院，2026-07-08', conf: 99.4, time: '2026-07-09 11:20:15', associateStatus: '匹配成功', status: '待确认', fileId: 'f1', model: 'Gemini-2.0-Flash-OCR', cost: '0.4s' },
  { id: 'c2', worker: '王朝阳', idCard: '1301021992******67', type: '处罚记录', detail: '因进入起吊区未戴安全帽被项目部处以罚款200元。2026-07-05', conf: 95.8, time: '2026-07-05 09:12:44', associateStatus: '匹配成功', status: '待确认', fileId: 'f2', model: 'DeepSeek-VL-Coder', cost: '0.6s' }
];

// Initial Manual Ledgers
const INITIAL_MANUAL_DATA = {
  exam: [
    { id: 'e1', name: '张建国', idCard: '3701021980******56', project: '北京CBD东区超高层项目', date: '2026-07-08', institution: '朝阳区第二医院', result: '合格', recorder: '管理员', mode: '手工录入', attachment: '20260708_体检报告.pdf', remarks: '高空特种作业合格' },
    { id: 'e2', name: '李强', idCard: '4201061988******90', project: '北京CBD东区超高层项目', date: '2026-06-15', institution: '建工疗养院体检中心', result: '合格', recorder: '李工', mode: '导入同步', attachment: '20260615_体检单.pdf', remarks: '无高空禁忌' }
  ],
  rewards: [
    { id: 'r1', name: '李强', idCard: '4201061988******90', title: '季度百日安全无事故先进个人', level: '项目部级', money: '500', date: '2026-07-08', agency: '中建一局项目部', recorder: '系统自动', mode: 'AI识别', attachment: '安全证书.jpg', remarks: '履约优良' }
  ],
  punishments: [
    { id: 'p1', name: '王朝阳', idCard: '1301021992******67', reason: '未佩戴安全帽进入施工基坑', action: '通报批评并罚款', money: '200', date: '2026-07-05', recorder: '刘安检', mode: '手工录入', attachment: '罚金凭单.pdf', remarks: '红线违规扣减20分' }
  ],
  trainings: [
    { id: 't1', name: '张建国', idCard: '3701021980******56', course: '夏季防暑降温与高空坠落实操演练', hours: '4', result: '合格', date: '2026-07-02', instructor: '赵安全员', recorder: '管理员', mode: '手工录入', attachment: '签到表.pdf', remarks: '安全三级培训合格' }
  ],
  certs: [
    { id: 'cert1', name: '张建国', idCard: '3701021980******56', certName: '特种作业操作证(钢筋工)', level: '省级', date: '2025-10-12', agency: '山东省建设厅', recorder: '管理员', mode: '手工录入', attachment: '特种证件扫描.pdf', remarks: '已通过真伪校验' }
  ],
  honors: [
    { id: 'h1', name: '张建国', idCard: '3701021980******56', honorName: '首都杰出工匠劳动模范', level: '省级', date: '2026-05-01', agency: '北京市总工会', recorder: '管理员', mode: '手动录入', attachment: '工匠模范证书.jpg', remarks: '重磅省级表彰' }
  ]
};

// Initial History Records
const INITIAL_LOGS = [
  { id: 'l1', method: 'AI智能解析', type: '体检记录', target: '张建国', status: '成功', duration: '0.4s', recorder: '管理员', time: '2026-07-09 11:20:15', source: '附件扫描' },
  { id: 'l2', method: 'API自动同步', type: '考勤信息', target: '班组考勤汇总 (285人)', status: '成功', duration: '1.2s', recorder: '系统自动', time: '2026-07-09 10:00:00', source: '闸机接口' },
  { id: 'l3', method: '手工录入', type: '荣誉记录', target: '张建国', status: '成功', duration: '0.2s', recorder: '管理员', time: '2026-07-09 09:30:00', source: '平台端' },
  { id: 'l4', method: 'Excel批量导入', type: '体检记录', target: '李强 等12人', status: '成功', duration: '0.8s', recorder: '李工', time: '2026-07-08 15:40:00', source: '表格上传' }
];

export default function DataAcquisitionCenter({ triggerNotification }) {
  // Navigation & Sub-Tabs
  const [activeTab, setActiveTab] = useState('realname') // realname, ai, pending, manual, history
  const [realnameSubTab, setRealnameSubTab] = useState('personnel') // personnel, attendance, teams, enterprises, employment
  const [manualSubTab, setManualSubTab] = useState('exam') // exam, rewards, punishments, trainings, certs, honors

  // Search & Collapsible Filters
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false)
  const [filterProject, setFilterProject] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  // Data States
  const [workers, setWorkers] = useState(INITIAL_WORKERS)
  const [aiToConfirm, setAiToConfirm] = useState(INITIAL_AI_TO_CONFIRM)
  const [manualData, setManualData] = useState(INITIAL_MANUAL_DATA)
  const [historyLogs, setHistoryLogs] = useState(INITIAL_LOGS)

  // Drawer states
  const [isWorkerDrawerOpen, setIsWorkerDrawerOpen] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState(null)
  
  const [isAddManualDrawerOpen, setIsAddManualDrawerOpen] = useState(false)
  const [editingManualRecord, setEditingManualRecord] = useState(null)

  // AI Upload & Wizard States
  const [aiWizardStep, setAiWizardStep] = useState(1) // 1=Upload, 2=OCR, 3=Associate & Verify
  const [isOcrLoading, setIsOcrLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Zoom / PDF preview mock state
  const [pdfZoom, setPdfZoom] = useState(100)
  const [pdfPage, setPdfPage] = useState(1)

  // Temporary uploaded record state
  const [uploadedRecord, setUploadedRecord] = useState({
    fileName: '建筑工人体检报告_张建国.pdf',
    type: '体检记录',
    model: 'Gemini-2.0-Flash-OCR',
    cost: '0.45s',
    confidence: 99.2,
    data: {
      name: '张建国',
      idCard: '3701021980******56',
      date: '2026-07-09',
      project: '北京CBD东区超高层项目',
      institution: '北京市朝阳区第二医院',
      result: '合格(具备高空及电气特种作业资格)',
      remarks: '血压120/80，健康状况优良'
    },
    association: {
      name: '张建国',
      idCard: '3701021980******56',
      project: '北京CBD东区超高层项目',
      team: '钢筋一班',
      enterprise: '中建一局集团',
      matchRate: 100,
      status: '匹配成功'
    }
  })

  // Selected multi-check boxes
  const [selectedRowIds, setSelectedRowIds] = useState([])

  // Add/Edit Form State
  const [manualForm, setManualForm] = useState({
    name: '张建国',
    project: '北京CBD东区超高层项目',
    date: '2026-07-09',
    institution: '',
    result: '合格',
    remarks: '',
    title: '',
    level: '项目部级',
    money: '',
    reason: '',
    action: '',
    course: '',
    hours: '',
    instructor: '',
    certName: '',
    honorName: '',
    agency: ''
  })

  // Collapsed search filter logic
  const handleQuery = () => {
    triggerNotification('条件过滤检索中...', 'info')
  }

  const handleReset = () => {
    setSearchKeyword('')
    setFilterProject('ALL')
    setFilterStatus('ALL')
    triggerNotification('检索条件已重置。', 'info')
  }

  // Double Column verify save
  const handleConfirmOcrEntry = () => {
    const targetType = uploadedRecord.type
    const resolvedIdCard = uploadedRecord.data.idCard

    if (targetType === '体检记录') {
      const newRec = {
        id: `e_${Date.now()}`,
        name: uploadedRecord.data.name,
        idCard: resolvedIdCard,
        project: uploadedRecord.data.project,
        date: uploadedRecord.data.date,
        institution: uploadedRecord.data.institution,
        result: uploadedRecord.data.result,
        recorder: '管理员',
        mode: 'AI识别',
        attachment: uploadedRecord.fileName,
        remarks: uploadedRecord.data.remarks
      }
      setManualData(prev => ({ ...prev, exam: [newRec, ...prev.exam] }))
    } else if (targetType === '奖励记录') {
      const newRec = {
        id: `r_${Date.now()}`,
        name: uploadedRecord.data.name,
        idCard: resolvedIdCard,
        title: 'AI识别奖励',
        level: '项目部级',
        money: '200',
        date: uploadedRecord.data.date,
        agency: uploadedRecord.data.institution,
        recorder: '管理员',
        mode: 'AI识别',
        attachment: uploadedRecord.fileName,
        remarks: uploadedRecord.data.remarks
      }
      setManualData(prev => ({ ...prev, rewards: [newRec, ...prev.rewards] }))
    }

    // Append to logs
    const newLog = {
      id: `l_${Date.now()}`,
      method: 'AI智能解析',
      type: targetType,
      target: uploadedRecord.data.name,
      status: '成功',
      duration: uploadedRecord.cost,
      recorder: '管理员',
      time: new Date().toLocaleString(),
      source: '附件扫描'
    }
    setHistoryLogs(prev => [newLog, ...prev])

    triggerNotification(`AI 结构化记录已成功入库并同步！`, 'success')
    setAiWizardStep(1)
  }

  // Batch action handlers
  const handleBatchConfirm = () => {
    if (selectedRowIds.length === 0) {
      triggerNotification('请先勾选需要入库的AI待确认记录', 'warning')
      return
    }
    
    // Simulate batch confirm
    setAiToConfirm(prev => prev.filter(item => {
      const isChecked = selectedRowIds.includes(item.id)
      if (isChecked) {
        // Append to manual exam ledger
        const newRec = {
          id: `e_${Date.now()}_${Math.random()}`,
          name: item.worker,
          idCard: item.idCard,
          project: '北京CBD东区超高层项目',
          date: '2026-07-09',
          institution: '朝阳区第二医院',
          result: '合格',
          recorder: '管理员',
          mode: 'AI智能识别',
          attachment: 'AI_OCR_document.pdf',
          remarks: '批量确认识别结果'
        }
        setManualData(prev => ({ ...prev, exam: [newRec, ...prev.exam] }))
      }
      return !isChecked
    }))

    setSelectedRowIds([])
    triggerNotification('选中的 AI 提取数据已成功批量确认入库！', 'success')
  }

  const handleBatchReject = () => {
    if (selectedRowIds.length === 0) {
      triggerNotification('请先勾选需要驳回的记录', 'warning')
      return
    }
    if (confirm(`确认要批量驳回选中的 ${selectedRowIds.length} 项 AI 识别结果吗？`)) {
      setAiToConfirm(prev => prev.filter(item => !selectedRowIds.includes(item.id)))
      setSelectedRowIds([])
      triggerNotification('选中的识别记录已驳回。', 'warning')
    }
  }

  // Worker detail drawer suggestion generator
  const getWorkerSuggestions = (worker) => {
    if (worker.completeness >= 90) {
      return {
        missing: ['健康档案'],
        suggest: '该工人画像极其完整。仅需定期核验季度体检状态，持续跟踪每日出勤考勤打卡。'
      }
    } else if (worker.completeness >= 80) {
      return {
        missing: ['奖励记录', '体检报告'],
        suggest: '建议补充体检诊断佐证扫描件。如有班组红榜或季度安全奖，建议上传同步以提升履约权重分。'
      }
    } else {
      return {
        missing: ['体检合格报告', '职业病培训课时', '安全奖惩记录'],
        suggest: '画像数据完整度偏低！请尽快在“AI采集中心”上传入场体检扫描件，并录入其特种三级培训签到成绩。'
      }
    }
  }

  // Upload handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startOcrSimulation(e.dataTransfer.files[0].name)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      startOcrSimulation(e.target.files[0].name)
    }
  }

  const startOcrSimulation = (fileName) => {
    setIsOcrLoading(true)
    setAiWizardStep(2)
    triggerNotification('文档上传成功，AI 神经网络大模型解析提取中...', 'info')
    
    setTimeout(() => {
      setIsOcrLoading(false)
      setAiWizardStep(3)
      setUploadedRecord(prev => ({
        ...prev,
        fileName: fileName,
        type: fileName.includes('体检') ? '体检记录' : fileName.includes('奖') ? '奖励记录' : '培训记录',
        data: {
          ...prev.data,
          name: fileName.includes('李强') ? '李强' : '张建国',
          idCard: fileName.includes('李强') ? '4201061988******90' : '3701021980******56',
          result: fileName.includes('李强') ? '合格(无高处架子工禁忌)' : '合格(具备高空及电气特种作业资格)'
        },
        association: {
          ...prev.association,
          name: fileName.includes('李强') ? '李强' : '张建国',
          idCard: fileName.includes('李强') ? '4201061988******90' : '3701021980******56',
          team: fileName.includes('李强') ? '架子二班' : '钢筋一班'
        }
      }))
      triggerNotification('AI OCR 及结构化解析翻译完成！置信度 99.2%', 'success')
    }, 2000)
  }

  // Manual records Add/Save
  const openAddManualRecord = (record = null) => {
    if (record) {
      setEditingManualRecord(record)
      setManualForm({ ...record })
    } else {
      setEditingManualRecord(null)
      setManualForm({
        name: '张建国',
        project: '北京CBD东区超高层项目',
        date: '2026-07-09',
        institution: '北京市朝阳区第二医院',
        result: '合格',
        remarks: '',
        title: '月度安全标兵称号',
        level: '项目部级',
        money: '300',
        reason: '进入起吊红线未带防护帽',
        action: '警告教育并扣减劳务积分',
        course: '高空坠落逃生演练',
        hours: '4',
        instructor: '雷安全长',
        certName: '二级焊接工艺特种证',
        honorName: '北京市总工会工匠劳动模范',
        agency: '北京市建协'
      })
    }
    setIsAddManualDrawerOpen(true)
  }

  const handleSaveManualForm = (e) => {
    e.preventDefault()
    const workerObj = INITIAL_WORKERS.find(w => w.name === manualForm.name)
    const idCard = workerObj ? workerObj.idCard : '3701021980******56'

    if (editingManualRecord) {
      setManualData(prev => ({
        ...prev,
        [manualSubTab]: prev[manualSubTab].map(item => item.id === editingManualRecord.id ? { ...manualForm, id: item.id, idCard } : item)
      }))
      triggerNotification('台账数据更新成功。', 'success')
    } else {
      const newRec = {
        ...manualForm,
        id: `rec_${Date.now()}`,
        idCard,
        recorder: '管理员',
        mode: '手工录入',
        attachment: 'manual_attached_doc.pdf'
      }
      setManualData(prev => ({
        ...prev,
        [manualSubTab]: [newRec, ...prev[manualSubTab]]
      }))
      triggerNotification('新增台账记录成功！', 'success')
    }
    setIsAddManualDrawerOpen(false)
  }

  const handleDeleteManualRecord = (id) => {
    if (confirm('确认删除此条人工录入的数据记录？')) {
      setManualData(prev => ({
        ...prev,
        [manualSubTab]: prev[manualSubTab].filter(item => item.id !== id)
      }))
      triggerNotification('台账记录已删除。', 'warning')
    }
  }

  return (
    <div className="flex-grow flex flex-col gap-6">
      
      {/* 1. Header Title */}
      <div className="bg-white border border-border-gray rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
            <Zap className="h-5.5 w-5.5 text-primary" />
            评价数据采集中心
            <span className="text-xs font-normal text-[#11356A] bg-[#11356A]/5 border border-[#11356A]/20 px-2 py-0.5 rounded">
              国企智慧工地标准 Demo
            </span>
          </h2>
          <p className="text-xs text-text-secondary mt-1.5">
            负责系统所需实名制接口、AI结构化识别、人工补登等所有前置指标台账的入库流转与校验核对。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerNotification('接口就绪：数据流连接正常', 'success')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded font-bold text-xs text-text-dark flex items-center gap-1 cursor-pointer transition-all"
          >
            <RefreshCw className="h-3 w-3 animate-spin text-primary" />
            联调监控中
          </button>
        </div>
      </div>

      {/* 2. Top KPI Cards (5 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 shrink-0">
        {[
          { title: '累计工人数', val: '1,265 人', change: '+12% 同比上月', time: '今日 12:00', icon: <Users className="h-5 w-5 text-primary" /> },
          { title: '今日同步数量', val: '45 条', change: '+32% 同比昨日', time: '10分钟前', icon: <UserCheck className="h-5 w-5 text-success-green" /> },
          { title: 'AI识别数量', val: '86 件', change: '+15.2% 本月环比', time: '今日 11:20', icon: <Cpu className="h-5 w-5 text-indigo-500" /> },
          { title: '待确认数量', val: `${aiToConfirm.length} 件`, change: '需尽快人工校对', time: '今日 14:00', icon: <AlertTriangle className="h-5 w-5 text-warning-orange" /> },
          { title: '数据完整率', val: '89.4%', change: '健康度: 优秀', time: '模型每小时轮询', icon: <Activity className="h-5 w-5 text-[#52C41A]" /> }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-border-gray p-4 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-all border-l-4 border-l-primary">
            <div className="flex items-start justify-between">
              <div className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">{kpi.title}</div>
              <div className="bg-slate-50 p-1.5 rounded">{kpi.icon}</div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-black text-text-dark font-mono leading-none">{kpi.val}</div>
              <div className="flex items-center justify-between text-[10px] text-text-secondary mt-2">
                <span className="font-semibold text-primary">{kpi.change}</span>
                <span>{kpi.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Primary Tabs Navigation */}
      <div className="bg-white border border-border-gray rounded shadow-sm flex flex-col min-h-[500px] flex-grow">
        
        {/* Navigation tabs */}
        <div className="flex border-b border-border-gray bg-slate-50 px-4 pt-3 shrink-0">
          {[
            { id: 'realname', label: '实名制数据 (同步)', icon: <ShieldCheck className="h-4 w-4" /> },
            { id: 'ai', label: 'AI智能解析 (OCR)', icon: <Cpu className="h-4 w-4" /> },
            { id: 'pending', label: '待确认数据', icon: <AlertTriangle className="h-4 w-4" />, count: aiToConfirm.length },
            { id: 'manual', label: '人工数据维护', icon: <Edit className="h-4 w-4" /> },
            { id: 'history', label: '采集记录历史', icon: <History className="h-4 w-4" /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4.5 py-3 text-xs font-bold border-t-2 border-x transition-all duration-150 cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white border-x-border-gray border-t-primary text-primary -mb-[1px] relative z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]'
                  : 'bg-transparent border-transparent text-text-secondary hover:text-primary hover:bg-slate-100'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className="ml-1 bg-warning-orange text-white text-[9px] px-1.5 py-0.2 rounded-full leading-none font-bold">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Panels */}
        <div className="p-6 flex-grow flex flex-col min-h-[380px]">
          
          {/* ==========================================
              TAB 1: 实名制数据台账 (Auto Sync)
              ========================================== */}
          {activeTab === 'realname' && (
            <div className="flex-grow flex flex-col gap-6">
              
              {/* Secondary sub-tabs */}
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start shrink-0">
                {[
                  { id: 'personnel', label: '人员信息' },
                  { id: 'attendance', label: '考勤信息' },
                  { id: 'employment', label: '用工信息' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setRealnameSubTab(sub.id)}
                    className={`px-3 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                      realnameSubTab === sub.id ? 'bg-[#11356A] text-white shadow-sm' : 'text-text-secondary hover:text-primary'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Table search filter bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 border border-border-gray rounded shrink-0">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="姓名 / 班组 / 身份证..."
                      className="bg-white border border-slate-300 rounded px-2.5 pl-8 py-1 text-xs text-text-dark w-48"
                    />
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  </div>

                  <button
                    onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                    className="flex items-center gap-1 text-xs text-text-secondary font-bold hover:text-primary cursor-pointer"
                  >
                    <Filter className="h-3 w-3" />
                    <span>高级筛选</span>
                    {isAdvancedSearchOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handleQuery} className="px-3.5 py-1 bg-[#11356A] hover:bg-primary-hover text-white text-xs font-bold rounded shadow-sm cursor-pointer">查询</button>
                  <button onClick={handleReset} className="px-3.5 py-1 bg-white hover:bg-slate-50 text-text-dark border border-slate-300 text-xs font-bold rounded shadow-sm cursor-pointer">重置</button>
                </div>
              </div>

              {/* Advanced search collapsible panel */}
              {isAdvancedSearchOpen && (
                <div className="bg-slate-50 border border-slate-200 rounded p-4 grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-down shrink-0 text-xs">
                  <div>
                    <label className="block font-bold text-text-secondary mb-1">参建工程项目</label>
                    <select
                      value={filterProject}
                      onChange={(e) => setFilterProject(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="ALL">全部项目</option>
                      <option value="CBD">北京CBD东区超高层项目</option>
                      <option value="28号线">北京轨道交通28号线项目</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-text-secondary mb-1">评价状态</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="ALL">全部状态</option>
                      <option value="可评价">可评价</option>
                      <option value="数据缺失">数据缺失</option>
                      <option value="暂停评价">暂停评价</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Data Table */}
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                {realnameSubTab === 'personnel' && (
                  <table className="b-table text-xs">
                    <thead>
                      <tr>
                        <th>姓名</th>
                        <th>身份证号(脱敏)</th>
                        <th>工种</th>
                        <th>班组</th>
                        <th>所属企业</th>
                        <th>所属项目</th>
                        <th>进场打卡日期</th>
                        <th>在场状态</th>
                        <th>评价状态</th>
                        <th className="w-24">数据完整率</th>
                        <th>更新时间</th>
                        <th>来源</th>
                        <th className="text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workers.map(w => (
                        <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                          <td className="font-bold text-text-dark">
                            <div className="flex items-center gap-2">
                              <span className="h-6 w-6 rounded-full bg-slate-200 text-primary flex items-center justify-center font-black text-[10px]">
                                {w.name[0]}
                              </span>
                              {w.name}
                            </div>
                          </td>
                          <td className="font-mono">{w.idCard}</td>
                          <td>{w.jobType}</td>
                          <td>{w.team}</td>
                          <td className="max-w-[150px] truncate" title={w.enterprise}>{w.enterprise}</td>
                          <td className="max-w-[150px] truncate" title={w.project}>{w.project}</td>
                          <td className="font-mono">{w.entryDate}</td>
                          <td>
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              w.status === '在场' ? 'bg-emerald-50 text-success-green border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'
                            }`}>
                              {w.status}
                            </span>
                          </td>
                          <td>
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              w.evalStatus === '可评价' ? 'bg-emerald-50 text-success-green border border-emerald-200' :
                              w.evalStatus === '数据缺失' ? 'bg-orange-50 text-warning-orange border border-orange-200' : 'bg-red-50 text-[#F5222D] border border-red-100'
                            }`}>
                              {w.evalStatus}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-1">
                              <div className="w-12 bg-slate-100 rounded-full h-1 border">
                                <div className="bg-[#11356A] h-1 rounded-full" style={{ width: `${w.completeness}%` }}></div>
                              </div>
                              <span className="font-mono text-[9px] font-bold">{w.completeness}%</span>
                            </div>
                          </td>
                          <td className="text-text-secondary font-mono">{w.updateTime.split(' ')[0]}</td>
                          <td>
                            <span className="bg-blue-50 text-[#11356A] border border-blue-100 px-1 py-0.2 rounded text-[9px] font-black">
                              实名制
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => {
                                setSelectedWorker(w)
                                setIsWorkerDrawerOpen(true)
                              }}
                              className="text-primary hover:text-primary-hover font-bold text-xs bg-primary/5 border border-primary/20 px-2 py-1 rounded cursor-pointer"
                            >
                              查看
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {realnameSubTab === 'attendance' && (
                  <table className="b-table text-xs">
                    <thead>
                      <tr>
                        <th>姓名</th>
                        <th>身份证号</th>
                        <th>考勤日期</th>
                        <th>签到时间</th>
                        <th>签退时间</th>
                        <th>位置</th>
                        <th>设备ID</th>
                        <th>考勤结论</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INITIAL_ATTENDANCE.map((a, i) => (
                        <tr key={i}>
                          <td className="font-bold text-text-dark">{a.name}</td>
                          <td className="font-mono">{a.idCard}</td>
                          <td className="font-mono">{a.date}</td>
                          <td className="font-mono text-success-green font-bold">{a.clockIn}</td>
                          <td className="font-mono text-text-secondary">{a.clockOut}</td>
                          <td>{a.location}</td>
                          <td className="font-mono text-text-secondary">{a.deviceId}</td>
                          <td>
                            <span className="bg-emerald-50 text-success-green border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {realnameSubTab === 'employment' && (
                  <table className="b-table text-xs">
                    <thead>
                      <tr>
                        <th>姓名</th>
                        <th>身份证号</th>
                        <th>参建分包企业</th>
                        <th>班组</th>
                        <th>工种</th>
                        <th>当前进场项目</th>
                        <th>进场时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INITIAL_EMPLOYMENT.map((e, i) => (
                        <tr key={i}>
                          <td className="font-bold text-text-dark">{e.name}</td>
                          <td className="font-mono">{e.idCard}</td>
                          <td>{e.enterprise}</td>
                          <td>{e.team}</td>
                          <td>{e.jobType}</td>
                          <td className="font-semibold text-text-dark">{e.project}</td>
                          <td className="font-mono text-text-secondary">{e.entryDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Table Pagination */}
              <div className="flex items-center justify-between text-xs text-text-secondary pt-2 shrink-0">
                <span>每页 10 条，当前显示第 1-5 条</span>
                <div className="flex items-center gap-1">
                  <button className="h-6 w-6 border rounded bg-white flex items-center justify-center cursor-pointer hover:bg-slate-50"><ChevronLeft className="h-3 w-3" /></button>
                  <button className="h-6 w-6 border rounded bg-[#11356A] text-white flex items-center justify-center font-bold">1</button>
                  <button className="h-6 w-6 border rounded bg-white flex items-center justify-center cursor-pointer hover:bg-slate-50"><ChevronRight className="h-3 w-3" /></button>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 2: AI智能采集 (OCR wizard flow)
              ========================================== */}
          {activeTab === 'ai' && (
            <div className="flex-grow flex flex-col gap-6">
              
              {/* Wizard steps bar */}
              <div className="bg-slate-50 p-4 border border-border-gray rounded-lg flex justify-between items-center shrink-0">
                {[
                  { step: 1, label: '上传原始单证' },
                  { step: 2, label: 'AI智能OCR识别' },
                  { step: 3, label: '关联核算入库' }
                ].map(st => (
                  <div key={st.step} className="flex items-center gap-2">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                      aiWizardStep === st.step ? 'bg-[#11356A] text-white animate-pulse' :
                      aiWizardStep > st.step ? 'bg-success-green text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {aiWizardStep > st.step ? <Check className="h-3.5 w-3.5" /> : st.step}
                    </span>
                    <span className={`text-xs font-bold ${aiWizardStep === st.step ? 'text-[#11356A]' : 'text-text-secondary'}`}>
                      {st.label}
                    </span>
                    {st.step < 3 && <div className="h-[1px] w-12 md:w-24 bg-slate-300"></div>}
                  </div>
                ))}
              </div>

              {/* Step 1: Upload Panel */}
              {aiWizardStep === 1 && (
                <div className="flex-grow flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary transition-all min-h-[300px]"
                     onDragEnter={handleDrag}
                     onDragOver={handleDrag}
                     onDragLeave={handleDrag}
                     onDrop={handleDrop}
                     onClick={() => fileInputRef.current.click()}
                >
                  <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={handleFileInput} />
                  <FileUp className="h-14 w-14 text-slate-400 mb-3 animate-bounce" />
                  <h4 className="text-sm font-bold text-text-dark">拖拽附件，或点击此处选择文件上传</h4>
                  <p className="text-[11px] text-text-secondary mt-1">支持体检报告、培训表彰、荣誉证书、Excel、ZIP等多格式，AI自动提取分类</p>
                </div>
              )}

              {/* Step 2: OCR Loading */}
              {aiWizardStep === 2 && isOcrLoading && (
                <div className="flex-grow flex flex-col items-center justify-center p-8 min-h-[300px]">
                  <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
                  <h4 className="text-sm font-bold text-text-dark">AI 智能大模型读取附件、翻译理解结构化字段中...</h4>
                  <p className="text-xs text-text-secondary mt-1">正通过 {uploadedRecord.model} 进行光学识别及合规置信度打分</p>
                </div>
              )}

              {/* Step 3: Split-Screen OCR check */}
              {aiWizardStep === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
                  
                  {/* Left Column: Attachment PDF/Image preview */}
                  <div className="lg:col-span-5 bg-slate-100 border border-slate-200 rounded-lg p-4 flex flex-col justify-between max-h-[500px]">
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <span className="text-xs font-bold text-text-dark flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-primary" />
                        {uploadedRecord.fileName}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setPdfZoom(z => Math.max(50, z - 25))} className="p-1 border rounded bg-white hover:bg-slate-50 cursor-pointer text-xs font-bold">-</button>
                        <span className="text-[10px] font-mono font-bold px-1.5">{pdfZoom}%</span>
                        <button onClick={() => setPdfZoom(z => Math.min(200, z + 25))} className="p-1 border rounded bg-white hover:bg-slate-50 cursor-pointer text-xs font-bold">+</button>
                      </div>
                    </div>

                    {/* PDF Mock Visual Canvas */}
                    <div className="flex-1 bg-white border rounded shadow-inner p-4 relative overflow-auto flex items-center justify-center">
                      <div className="border border-slate-300 p-6 shadow-sm text-[10px] text-left text-slate-400 space-y-4 max-w-sm w-full" style={{ transform: `scale(${pdfZoom / 100})` }}>
                        <div className="text-center font-bold text-sm text-text-dark border-b pb-2 uppercase tracking-wide">
                          北京市职业健康监护报告单
                        </div>
                        <div className="grid grid-cols-2 gap-2 border-b pb-2">
                          <div className="border border-red-400 p-0.5 relative">
                            姓名：张建国
                            <span className="absolute -top-3.5 left-0 text-[8px] bg-red-400 text-white px-1 py-0.1 font-bold rounded">AI: 99%</span>
                          </div>
                          <div>科室：高处作业体检科</div>
                          <div className="border border-red-400 p-0.5 relative">
                            日期：2026-07-09
                            <span className="absolute -top-3.5 left-0 text-[8px] bg-red-400 text-white px-1 py-0.1 font-bold rounded">AI: 97%</span>
                          </div>
                          <div>机构：朝阳区第二医院</div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-[10px] text-text-dark">临床诊断意见：</div>
                          <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 p-1 border border-emerald-100 rounded">
                            未见禁忌症。心率72次/分，胸透合格。准予参建高空建筑特种施工作业。
                          </div>
                        </div>
                        <div className="text-right pt-6">核定章：朝阳区第二医院体检中心</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t">
                      <span>页码：{pdfPage} / 1</span>
                      <button className="text-primary hover:underline flex items-center gap-0.5">
                        <DownloadCloud className="h-3.5 w-3.5" />
                        下载原始文件
                      </button>
                    </div>
                  </div>

                  {/* Right Column: AI Fields form & Match */}
                  <div className="lg:col-span-7 bg-white border border-border-gray rounded-lg p-5 flex flex-col gap-5 shadow-sm max-h-[500px] overflow-y-auto">
                    
                    {/* Header metrics */}
                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex items-center justify-between text-xs shrink-0">
                      <div className="flex items-center gap-1.5 text-[#11356A] font-bold">
                        <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
                        <span>文档类别：{uploadedRecord.type} (AI自动识别)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-text-secondary">耗时: {uploadedRecord.cost}</span>
                        <span className="text-success-green font-black">置信度: {uploadedRecord.confidence}%</span>
                      </div>
                    </div>

                    {/* AI auto association */}
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-2 text-xs">
                      <div className="font-bold text-text-dark flex items-center gap-1">
                        <UserCheck className="h-4 w-4 text-success-green" />
                        <span>AI 实名制匹配结论：{uploadedRecord.association.status} ({uploadedRecord.association.matchRate}% 匹配度)</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-text-secondary mt-1 pt-1.5 border-t border-dashed border-slate-200">
                        <div>匹配姓名：<span className="text-text-dark font-bold">{uploadedRecord.association.name}</span></div>
                        <div>所属班组：<span className="text-text-dark font-bold">{uploadedRecord.association.team}</span></div>
                        <div>所属项目：<span className="text-text-dark font-bold">{uploadedRecord.association.project}</span></div>
                      </div>
                    </div>

                    {/* Structural Fields Edit Form */}
                    <form className="space-y-4 text-xs" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-text-secondary mb-1">姓名 (AI提取)</label>
                          <input
                            type="text"
                            value={uploadedRecord.data.name}
                            onChange={(e) => setUploadedRecord({
                              ...uploadedRecord,
                              data: { ...uploadedRecord.data, name: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-text-secondary mb-1">身份证 (AI提取)</label>
                          <input
                            type="text"
                            value={uploadedRecord.data.idCard}
                            onChange={(e) => setUploadedRecord({
                              ...uploadedRecord,
                              data: { ...uploadedRecord.data, idCard: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-text-secondary mb-1">诊断评估日期</label>
                          <input
                            type="date"
                            value={uploadedRecord.data.date}
                            onChange={(e) => setUploadedRecord({
                              ...uploadedRecord,
                              data: { ...uploadedRecord.data, date: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-text-secondary mb-1">判定诊断结论</label>
                          <input
                            type="text"
                            value={uploadedRecord.data.result}
                            onChange={(e) => setUploadedRecord({
                              ...uploadedRecord,
                              data: { ...uploadedRecord.data, result: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-text-secondary mb-1">评估公信主体</label>
                          <input
                            type="text"
                            value={uploadedRecord.data.institution}
                            onChange={(e) => setUploadedRecord({
                              ...uploadedRecord,
                              data: { ...uploadedRecord.data, institution: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-text-secondary mb-1">归属项目</label>
                          <input
                            type="text"
                            disabled
                            value={uploadedRecord.data.project}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-text-secondary"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setAiWizardStep(1)
                            triggerNotification('已取消并清除缓存。', 'warning')
                          }}
                          className="px-4 py-1.5 bg-white border border-slate-300 text-text-dark font-bold rounded shadow-sm cursor-pointer"
                        >
                          取消重置
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmOcrEntry}
                          className="px-5 py-1.5 bg-[#52C41A] hover:bg-emerald-600 text-white font-bold rounded shadow-sm cursor-pointer flex items-center gap-1"
                        >
                          <Check className="h-4 w-4" />
                          确认入库
                        </button>
                      </div>
                    </form>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ==========================================
              TAB 3: 待确认数据 (AI pending table)
              ========================================== */}
          {activeTab === 'pending' && (
            <div className="flex-grow flex flex-col gap-6">
              
              {/* Batch action operations bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 border border-border-gray rounded shrink-0">
                <div className="text-xs text-text-secondary">
                  已勾选 <span className="font-bold text-primary">{selectedRowIds.length}</span> 项待人工确认的 AI 采集单证记录。
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBatchConfirm}
                    disabled={selectedRowIds.length === 0}
                    className={`px-3 py-1.5 text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1 ${
                      selectedRowIds.length === 0
                        ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                        : 'bg-primary hover:bg-[#1b3d6f] text-white cursor-pointer'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    批量审核入库
                  </button>
                  <button
                    onClick={handleBatchReject}
                    disabled={selectedRowIds.length === 0}
                    className={`px-3 py-1.5 text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1 ${
                      selectedRowIds.length === 0
                        ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                        : 'bg-white hover:bg-slate-100 text-danger-red border border-red-200 cursor-pointer'
                    }`}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-danger-red" />
                    批量驳回
                  </button>
                </div>
              </div>

              {/* Table list */}
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                <table className="b-table text-xs">
                  <thead>
                    <tr>
                      <th className="w-10">
                        <input
                          type="checkbox"
                          checked={selectedRowIds.length === aiToConfirm.length && aiToConfirm.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRowIds(aiToConfirm.map(i => i.id))
                            } else {
                              setSelectedRowIds([])
                            }
                          }}
                          className="h-3.5 w-3.5"
                        />
                      </th>
                      <th>关联工人</th>
                      <th>身份证号</th>
                      <th>识别类型</th>
                      <th>识别明细摘要</th>
                      <th>AI 可信度</th>
                      <th>匹配关联状态</th>
                      <th>提交时间</th>
                      <th>当前审核状态</th>
                      <th className="text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiToConfirm.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRowIds.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRowIds(prev => [...prev, item.id])
                              } else {
                                setSelectedRowIds(prev => prev.filter(id => id !== item.id))
                              }
                            }}
                            className="h-3.5 w-3.5"
                          />
                        </td>
                        <td className="font-bold text-text-dark">{item.worker}</td>
                        <td className="font-mono text-text-secondary">{item.idCard}</td>
                        <td>{item.type}</td>
                        <td className="max-w-[200px] truncate text-text-secondary" title={item.detail}>{item.detail}</td>
                        <td>
                          <span className={`font-mono font-bold text-xs ${item.conf >= 98 ? 'text-success-green' : 'text-warning-orange'}`}>
                            {item.conf}%
                          </span>
                        </td>
                        <td>
                          <span className="bg-emerald-50 text-success-green border border-emerald-200 px-1.5 py-0.2 rounded text-[10px] font-bold">
                            {item.associateStatus}
                          </span>
                        </td>
                        <td className="text-text-secondary font-mono">{item.time}</td>
                        <td>
                          <span className="bg-amber-50 text-warning-orange border border-amber-200 px-1.5 py-0.2 rounded text-[10px] font-bold animate-pulse">
                            {item.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => {
                              setUploadedRecord({
                                fileName: item.fileId === 'f1' ? '20260709_体检报告_张建国.pdf' : '20260705_违规处罚通报_王朝阳.png',
                                type: item.type,
                                model: item.model,
                                cost: item.cost,
                                confidence: item.conf,
                                data: {
                                  name: item.worker,
                                  idCard: item.idCard,
                                  date: item.time.split(' ')[0],
                                  project: '北京CBD东区超高层项目',
                                  institution: item.fileId === 'f1' ? '北京市朝阳区第二医院' : '项目安全监察部',
                                  result: item.detail,
                                  remarks: '等待人工核对'
                                },
                                association: {
                                  name: item.worker,
                                  idCard: item.idCard,
                                  project: '北京CBD东区超高层项目',
                                  team: item.fileId === 'f1' ? '钢筋一班' : '泥工一班',
                                  matchRate: 100,
                                  status: '匹配成功'
                                }
                              })
                              setAiWizardStep(3)
                              setActiveTab('ai')
                            }}
                            className="text-primary hover:text-primary-hover font-bold text-xs bg-primary/5 border border-primary/20 px-2 py-1 rounded cursor-pointer"
                          >
                            校对确认
                          </button>
                        </td>
                      </tr>
                    ))}
                    {aiToConfirm.length === 0 && (
                      <tr>
                        <td colSpan="10" className="text-center py-8 text-text-secondary font-medium">
                          没有待确认识别的 AI 提取记录。
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 4: 人工数据维护台账
              ========================================== */}
          {activeTab === 'manual' && (
            <div className="flex-grow flex flex-col gap-6">
              
              {/* Secondary Sub tabs selector */}
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start shrink-0">
                {[
                  { id: 'exam', label: '🩺 体检记录' },
                  { id: 'rewards', label: '🏆 奖励记录' },
                  { id: 'punishments', label: '⚠️ 处罚记录' },
                  { id: 'trainings', label: '📚 培训记录' },
                  { id: 'certs', label: '📜 技能证书' },
                  { id: 'honors', label: '🏅 荣誉记录' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setManualSubTab(sub.id)}
                    className={`px-3 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                      manualSubTab === sub.id ? 'bg-[#11356A] text-white shadow-sm' : 'text-text-secondary hover:text-primary'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Toolbar Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 border border-border-gray rounded shrink-0">
                <div className="text-xs font-bold text-text-dark flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>当前台账共 {manualData[manualSubTab].length} 条记录</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAddManualRecord()}
                    className="px-3.5 py-1.5 bg-[#52C41A] hover:bg-emerald-600 text-white rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    新增记录
                  </button>
                  <button
                    onClick={() => triggerNotification('Excel 模板导出准备中...', 'info')}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-text-dark rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1 hover:bg-slate-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    导出数据
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                <table className="b-table text-xs">
                  <thead>
                    <tr>
                      <th>姓名</th>
                      <th>身份证号</th>
                      
                      {manualSubTab === 'exam' && (
                        <>
                          <th>体检筛查项目</th>
                          <th>体检时间</th>
                          <th>体检机构</th>
                          <th>诊断结论</th>
                        </>
                      )}

                      {manualSubTab === 'rewards' && (
                        <>
                          <th>奖励证书名称</th>
                          <th>荣誉级别</th>
                          <th>现金奖励(元)</th>
                          <th>获奖时间</th>
                          <th>授予机构</th>
                        </>
                      )}

                      {manualSubTab === 'punishments' && (
                        <>
                          <th>安全违章行为</th>
                          <th>惩戒措施</th>
                          <th>罚款金额(元)</th>
                          <th>处罚日期</th>
                          <th>督查记录人</th>
                        </>
                      )}

                      {manualSubTab === 'trainings' && (
                        <>
                          <th>安全培训课程</th>
                          <th>课时 (h)</th>
                          <th>考核结论</th>
                          <th>培训日期</th>
                          <th>授课讲师</th>
                        </>
                      )}

                      {manualSubTab === 'certs' && (
                        <>
                          <th>技能证书名称</th>
                          <th>发证级别</th>
                          <th>发证日期</th>
                          <th>发证机关</th>
                        </>
                      )}

                      {manualSubTab === 'honors' && (
                        <>
                          <th>荣誉称号名称</th>
                          <th>荣誉级别</th>
                          <th>授予日期</th>
                          <th>颁发机关</th>
                        </>
                      )}

                      <th>录入人</th>
                      <th>录入方式</th>
                      <th>更新时间</th>
                      <th className="text-right font-bold">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualData[manualSubTab].map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="font-bold text-text-dark">{item.name}</td>
                        <td className="font-mono text-text-secondary">{item.idCard}</td>

                        {manualSubTab === 'exam' && (
                          <>
                            <td>{item.project}</td>
                            <td className="font-mono">{item.date}</td>
                            <td>{item.institution}</td>
                            <td>
                              <span className="bg-emerald-50 text-success-green border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                                {item.result}
                              </span>
                            </td>
                          </>
                        )}

                        {manualSubTab === 'rewards' && (
                          <>
                            <td className="font-semibold text-emerald-800">{item.title}</td>
                            <td>{item.level}</td>
                            <td className="font-mono font-bold text-success-green">+{item.money}</td>
                            <td className="font-mono">{item.date}</td>
                            <td>{item.agency}</td>
                          </>
                        )}

                        {manualSubTab === 'punishments' && (
                          <>
                            <td className="font-semibold text-red-700">{item.reason}</td>
                            <td>{item.action}</td>
                            <td className="font-mono font-bold text-danger-red">-{item.money}</td>
                            <td className="font-mono">{item.date}</td>
                            <td>{item.recorder}</td>
                          </>
                        )}

                        {manualSubTab === 'trainings' && (
                          <>
                            <td>{item.course}</td>
                            <td className="font-mono font-bold text-[#11356A]">{item.hours}h</td>
                            <td>
                              <span className="bg-emerald-50 text-success-green border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                                {item.result}
                              </span>
                            </td>
                            <td className="font-mono">{item.date}</td>
                            <td>{item.instructor}</td>
                          </>
                        )}

                        {manualSubTab === 'certs' && (
                          <>
                            <td className="font-semibold text-indigo-800">{item.certName}</td>
                            <td>{item.level}</td>
                            <td className="font-mono">{item.date}</td>
                            <td>{item.agency}</td>
                          </>
                        )}

                        {manualSubTab === 'honors' && (
                          <>
                            <td className="font-black text-amber-800">{item.honorName}</td>
                            <td>{item.level}</td>
                            <td className="font-mono">{item.date}</td>
                            <td>{item.agency}</td>
                          </>
                        )}

                        <td>{item.recorder || '管理员'}</td>
                        <td>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            item.mode === 'AI识别' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                          }`}>
                            {item.mode || '手工录入'}
                          </span>
                        </td>
                        <td className="font-mono text-text-secondary">{item.date}</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openAddManualRecord(item)}
                              className="text-primary hover:text-primary-hover font-bold text-[11px] border border-slate-200 bg-white hover:bg-slate-50 px-2 py-0.5 rounded cursor-pointer"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteManualRecord(item.id)}
                              className="text-danger-red hover:text-red-700 font-bold text-[11px] border border-slate-200 bg-white hover:bg-slate-50 px-2 py-0.5 rounded cursor-pointer"
                            >
                              删除
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

          {/* ==========================================
              TAB 5: 采集历史记录
              ========================================== */}
          {activeTab === 'history' && (
            <div className="flex-grow flex flex-col gap-6">
              
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                <table className="b-table text-xs">
                  <thead>
                    <tr>
                      <th>采集接口/方法</th>
                      <th>采集数据类型</th>
                      <th>解析评价对象</th>
                      <th>时延耗时</th>
                      <th>采集更新时间</th>
                      <th>审计记录员</th>
                      <th>原始物料来源</th>
                      <th>同步审计状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="font-bold text-text-dark">{log.method}</td>
                        <td>
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold text-text-dark">
                            {log.type}
                          </span>
                        </td>
                        <td className="font-semibold text-text-dark">{log.target}</td>
                        <td className="font-mono text-text-secondary">{log.duration}</td>
                        <td className="font-mono text-text-secondary">{log.time}</td>
                        <td>{log.recorder}</td>
                        <td className="text-xs text-text-secondary">{log.source}</td>
                        <td>
                          <span className="bg-emerald-50 text-success-green border border-emerald-200 px-2 py-0.5 rounded font-black">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ======================================================================
          DRAWER 1: WORKER PROFILE DETAILS (查看工人详情右侧抽屉)
          ====================================================================== */}
      {isWorkerDrawerOpen && selectedWorker && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsWorkerDrawerOpen(false)}></div>
          
          {/* Content Pane */}
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="p-5 border-b bg-slate-50 border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-black text-text-dark flex items-center gap-2">
                  <span>实名制工人评价档案详情</span>
                  <span className="text-[10px] bg-blue-50 text-primary border border-blue-200 px-2 py-0.5 rounded">
                    实名制同步
                  </span>
                </h3>
                <p className="text-[10px] text-text-secondary mt-1">最后同步时间：{selectedWorker.updateTime}</p>
              </div>
              <button onClick={() => setIsWorkerDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scroll Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* Profile Card & Circular completeness progress */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-[#11356A] text-white flex items-center justify-center font-black text-lg shadow-inner">
                    {selectedWorker.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm flex items-center gap-1.5">
                      {selectedWorker.name}
                      <span className="h-2 w-2 rounded-full bg-success-green"></span>
                    </h4>
                    <span className="text-xs text-text-secondary">{selectedWorker.jobType} | {selectedWorker.team}</span>
                  </div>
                </div>

                {/* Circular completeness indicator */}
                <div className="flex flex-col items-center gap-1 bg-white p-3 border rounded shadow-sm relative">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="22" stroke="#E2E8F0" strokeWidth="3" fill="transparent" />
                    <circle cx="28" cy="28" r="22" stroke="#11356A" strokeWidth="3" fill="transparent"
                            strokeDasharray={2 * Math.PI * 22}
                            strokeDashoffset={2 * Math.PI * 22 * (1 - selectedWorker.completeness / 100)} />
                  </svg>
                  <span className="absolute top-[21px] text-[10px] font-black font-mono text-[#11356A]">
                    {selectedWorker.completeness}%
                  </span>
                  <span className="text-[9px] text-text-secondary font-bold">数据完整率</span>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-text-dark border-l-4 border-primary pl-2 mb-2">基本身份信息</div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-text-secondary">身份证号：</span>
                    <span className="font-mono text-text-dark font-bold">{selectedWorker.idCard}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">劳动力所属企业：</span>
                    <span className="text-text-dark font-semibold">{selectedWorker.enterprise}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">当前在建项目：</span>
                    <span className="text-text-dark font-semibold">{selectedWorker.project}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">进场签到日期：</span>
                    <span className="text-text-dark font-semibold font-mono">{selectedWorker.entryDate}</span>
                  </div>
                </div>
              </div>

              {/* Data Checklist Cover */}
              <div className="space-y-3 pt-3 border-t">
                <div className="text-xs font-bold text-text-dark border-l-4 border-primary pl-2 mb-2">评价数据覆盖维度核验</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: '基本实名信息', done: true },
                    { key: '月度打卡考勤', done: true },
                    { key: '安全三级培训', done: selectedWorker.completeness >= 80 },
                    { key: '季度职业体检', done: selectedWorker.completeness >= 90 },
                    { key: '现场奖励表彰', done: selectedWorker.completeness >= 94 },
                    { key: '违章记分处罚', done: true },
                    { key: '技术等级证书', done: true },
                    { key: '心理健康测评', done: selectedWorker.completeness >= 94 }
                  ].map((chk, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                      <span className="text-text-secondary">{chk.key}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        chk.done ? 'bg-emerald-50 text-success-green border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
                      }`}>
                        {chk.done ? '已覆盖' : '待补充'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Auto Suggestion Card */}
              <div className="bg-indigo-50/50 border border-dashed border-indigo-200 rounded-lg p-4 space-y-2 text-xs">
                <div className="flex items-center gap-1 text-[#11356A] font-bold">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                  <span>AI 智能治理优化建议</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {getWorkerSuggestions(selectedWorker).suggest}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {getWorkerSuggestions(selectedWorker).missing.map((mis, i) => (
                    <span key={i} className="bg-indigo-100 text-[#11356A] text-[9.5px] px-2 py-0.5 rounded font-black shadow-sm">
                      ⚠️ 缺: {mis}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex items-center justify-end shrink-0">
              <button
                onClick={() => setIsWorkerDrawerOpen(false)}
                className="px-4 py-2 bg-primary hover:bg-[#1b3d6f] text-white text-xs font-bold rounded shadow-sm cursor-pointer transition-colors"
              >
                关闭面板
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          DRAWER 2: MANUAL DATA ADD/EDIT (人工数据新增/编辑右侧抽屉)
          ====================================================================== */}
      {isAddManualDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsAddManualDrawerOpen(false)}></div>

          {/* Form container */}
          <form
            onSubmit={handleSaveManualForm}
            className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in"
          >
            {/* Header */}
            <div className="p-5 border-b bg-slate-50 border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-text-dark flex items-center gap-1.5">
                <Edit className="h-4.5 w-4.5 text-primary" />
                <span>
                  {editingManualRecord ? '修改人工评价数据' : '补登人工维护数据'} - {
                    manualSubTab === 'exam' ? '体检记录' :
                    manualSubTab === 'rewards' ? '奖励记录' :
                    manualSubTab === 'punishments' ? '处罚记录' :
                    manualSubTab === 'trainings' ? '培训记录' :
                    manualSubTab === 'certs' ? '特种证书' : '荣誉称号'
                  }
                </span>
              </h3>
              <button type="button" onClick={() => setIsAddManualDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields Scroll */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-text-secondary mb-1">选择目标工人</label>
                  <select
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                  >
                    {workers.map(w => (
                      <option key={w.id} value={w.name}>{w.name} ({w.jobType})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-text-secondary mb-1">所属参建项目</label>
                  <select
                    value={manualForm.project}
                    onChange={(e) => setManualForm({ ...manualForm, project: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                  >
                    <option value="北京CBD东区超高层项目">北京CBD东区超高层项目</option>
                    <option value="北京轨道交通28号线项目">北京轨道交通28号线项目</option>
                    <option value="城市绿心剧院机电安装项目">城市绿心剧院机电安装项目</option>
                  </select>
                </div>
              </div>

              {/* Tab specific dynamic sub-forms */}
              {manualSubTab === 'exam' && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">体检筛查时间</label>
                      <input
                        type="date"
                        required
                        value={manualForm.date}
                        onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">健康结论结论</label>
                      <select
                        value={manualForm.result}
                        onChange={(e) => setManualForm({ ...manualForm, result: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      >
                        <option value="合格">合格</option>
                        <option value="不合格">不合格 (高处禁忌)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-text-secondary mb-1">筛查医疗机构</label>
                    <input
                      type="text"
                      required
                      value={manualForm.institution}
                      onChange={(e) => setManualForm({ ...manualForm, institution: e.target.value })}
                      placeholder="如：北京市朝阳区第二医院"
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                    />
                  </div>
                </div>
              )}

              {manualSubTab === 'rewards' && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">奖励现金金额 (元)</label>
                      <input
                        type="number"
                        required
                        value={manualForm.money}
                        onChange={(e) => setManualForm({ ...manualForm, money: e.target.value })}
                        placeholder="如：500"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">表彰获奖日期</label>
                      <input
                        type="date"
                        required
                        value={manualForm.date}
                        onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">奖励荣誉级别</label>
                      <select
                        value={manualForm.level}
                        onChange={(e) => setManualForm({ ...manualForm, level: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      >
                        <option value="项目部级">项目部级</option>
                        <option value="企业级">企业级</option>
                        <option value="省级">省级</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">颁发授予机关</label>
                      <input
                        type="text"
                        required
                        value={manualForm.agency}
                        onChange={(e) => setManualForm({ ...manualForm, agency: e.target.value })}
                        placeholder="颁授机关单位"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-text-secondary mb-1">奖励证书/奖项全称</label>
                    <input
                      type="text"
                      required
                      value={manualForm.title}
                      onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
                      placeholder="如：百日安全优秀标兵表彰"
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                    />
                  </div>
                </div>
              )}

              {manualSubTab === 'punishments' && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">处罚扣款金额 (元)</label>
                      <input
                        type="number"
                        required
                        value={manualForm.money}
                        onChange={(e) => setManualForm({ ...manualForm, money: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">违章通报日期</label>
                      <input
                        type="date"
                        required
                        value={manualForm.date}
                        onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">惩戒处置手段</label>
                      <input
                        type="text"
                        required
                        value={manualForm.action}
                        onChange={(e) => setManualForm({ ...manualForm, action: e.target.value })}
                        placeholder="如：通报警告并罚款"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">定案安全督察人</label>
                      <input
                        type="text"
                        required
                        value={manualForm.recorder}
                        onChange={(e) => setManualForm({ ...manualForm, recorder: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-text-secondary mb-1">具体违章行为行为</label>
                    <textarea
                      required
                      rows="2"
                      value={manualForm.reason}
                      onChange={(e) => setManualForm({ ...manualForm, reason: e.target.value })}
                      placeholder="描述违章事实..."
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                    ></textarea>
                  </div>
                </div>
              )}

              {manualSubTab === 'trainings' && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">培训总学时 (h)</label>
                      <input
                        type="number"
                        required
                        value={manualForm.hours}
                        onChange={(e) => setManualForm({ ...manualForm, hours: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">考核考评日期</label>
                      <input
                        type="date"
                        required
                        value={manualForm.date}
                        onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">考评培训结论</label>
                      <select
                        value={manualForm.result}
                        onChange={(e) => setManualForm({ ...manualForm, result: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      >
                        <option value="合格">合格</option>
                        <option value="优秀">优秀</option>
                        <option value="不合格">不合格</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">主要讲课讲师</label>
                      <input
                        type="text"
                        required
                        value={manualForm.instructor}
                        onChange={(e) => setManualForm({ ...manualForm, instructor: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-text-secondary mb-1">培训课程全称</label>
                    <input
                      type="text"
                      required
                      value={manualForm.course}
                      onChange={(e) => setManualForm({ ...manualForm, course: e.target.value })}
                      placeholder="培训主题名称"
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                    />
                  </div>
                </div>
              )}

              {manualSubTab === 'certs' && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">发证评定级别</label>
                      <select
                        value={manualForm.level}
                        onChange={(e) => setManualForm({ ...manualForm, level: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      >
                        <option value="省级">省级/厅局级</option>
                        <option value="市级">市级/地级市</option>
                        <option value="企业级">企业级证书</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">证书发证日期</label>
                      <input
                        type="date"
                        required
                        value={manualForm.date}
                        onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">评定发证机关</label>
                      <input
                        type="text"
                        required
                        value={manualForm.agency}
                        onChange={(e) => setManualForm({ ...manualForm, agency: e.target.value })}
                        placeholder="发证单位名称"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">技能证书名称</label>
                      <input
                        type="text"
                        required
                        value={manualForm.certName}
                        onChange={(e) => setManualForm({ ...manualForm, certName: e.target.value })}
                        placeholder="如：二级特种焊接资质"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                  </div>
                </div>
              )}

              {manualSubTab === 'honors' && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">荣誉授予级别</label>
                      <select
                        value={manualForm.level}
                        onChange={(e) => setManualForm({ ...manualForm, level: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      >
                        <option value="省级">省级劳动模范</option>
                        <option value="市级">市级杰出称号</option>
                        <option value="企业级">企业级荣誉</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">荣誉授予日期</label>
                      <input
                        type="date"
                        required
                        value={manualForm.date}
                        onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">授予颁发机关</label>
                      <input
                        type="text"
                        required
                        value={manualForm.agency}
                        onChange={(e) => setManualForm({ ...manualForm, agency: e.target.value })}
                        placeholder="颁发单位名称"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-secondary mb-1">荣誉称号全称</label>
                      <input
                        type="text"
                        required
                        value={manualForm.honorName}
                        onChange={(e) => setManualForm({ ...manualForm, honorName: e.target.value })}
                        placeholder="如：杰出青工先锋"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Upload file zone */}
              <div className="border-t pt-4 space-y-4">
                <div>
                  <label className="block font-bold text-text-secondary mb-1">审计证明扫描件 (PDF / JPG)</label>
                  <div className="border border-dashed border-slate-300 rounded p-4 text-center cursor-pointer hover:bg-slate-50 bg-slate-50 flex items-center justify-center gap-1.5 text-text-secondary">
                    <Upload className="h-4.5 w-4.5" />
                    <span>上传佐证资料扫描件 (限制 20MB)</span>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-text-secondary mb-1">备注说明</label>
                  <textarea
                    rows="2"
                    value={manualForm.remarks}
                    onChange={(e) => setManualForm({ ...manualForm, remarks: e.target.value })}
                    placeholder="输入其他需要补充说明的审计信息..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                  ></textarea>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddManualDrawerOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-text-dark font-bold rounded shadow-sm cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#11356A] hover:bg-primary-hover text-white font-bold rounded shadow cursor-pointer transition-colors"
              >
                保存并入库
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}

```

## File: src/pages/DataCenter.jsx

```javascript
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

```

## File: src/pages/IndexCenter.jsx

```javascript
import { useState, useMemo } from 'react'
import {
  Sliders,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  Search,
  Eye,
  Info,
  HelpCircle,
  TrendingUp,
  LayoutGrid,
  FileCode,
  Brackets,
  FolderPlus,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Download,
  Upload,
  Activity,
  Sparkles,
  Cpu,
  History,
  Award,
  ArrowLeft,
  Copy,
  FileSpreadsheet,
  Play,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// Initial Dimension Mock Data
const INITIAL_DIMENSIONS = [
  { id: 'd1', name: '职业能力', desc: '评估工人专业岗位技能、特种持证资质、实操比赛获奖及劳动贡献程度。', count: 5, weight: 30, updated: '2026-07-09', status: true },
  { id: 'd2', name: '履约能力', desc: '考核工人进出场合规度、闸机考勤打卡天数、劳动力工时合同履约情况。', count: 4, weight: 25, updated: '2026-07-09', status: true },
  { id: 'd3', name: '安全能力', desc: '监控工人违章通报处罚、日常安全晨会表现、三级安全教育培训及积分。', count: 6, weight: 20, updated: '2026-07-08', status: true },
  { id: 'd4', name: '健康能力', desc: '评估工人健康体检合格状况、高空作业禁忌症筛查、心理评测得分。', count: 3, weight: 10, updated: '2026-07-09', status: true },
  { id: 'd5', name: '信用能力', desc: '融合工人社会信用底账评分、征信守信率、无犯罪记录及守法表现。', count: 3, weight: 15, updated: '2026-07-07', status: true }
];

// Initial Index Mock Data
const INITIAL_INDICES = [
  { id: 'IDX-001', name: '特种作业证件真伪核验率', dimension: '职业能力', source: 'AI智能采集', algType: '加分项', desc: '通过AI智能比对特种设备操作证，确保证件在有效期内且为真证。', status: true, version: 'v2.4.1', remarks: '国标级审核' },
  { id: 'IDX-002', name: '月度班组考勤出勤天数', dimension: '履约能力', source: '实名制系统', algType: '阶梯评分', desc: '根据项目部要求，按照工人每月打卡打满天数进行阶梯式评级。', status: true, version: 'v2.4.0', remarks: '按打卡数累计' },
  { id: 'IDX-003', name: '季度百日安全标兵红榜奖励', dimension: '安全能力', source: '人工维护', algType: '加分项', desc: '对获得安全标兵、优秀班长称号的工人实施信用分值奖励。', status: true, version: 'v2.4.1', remarks: '优秀红榜加分' },
  { id: 'IDX-004', name: '现场违章施工安全通报处罚', dimension: '安全能力', source: 'AI智能采集', algType: '扣分项', desc: '日常高空坠落演练及安全巡查违章扣减指标。', status: true, version: 'v2.3.8', remarks: '红线违章' },
  { id: 'IDX-005', name: '入场职业健康体检合格率', dimension: '健康能力', source: 'API接口', algType: '基准分', desc: '凡建档合格并有合同核销的加满基准分，中途脱岗拉黑扣分。', status: true, version: 'v2.4.1', remarks: '必备前置指标' },
  { id: 'IDX-006', name: '信用守信无失信记录率', dimension: '信用能力', source: '系统计算', algType: '固定分值', desc: '融合国家失信被执行人接口进行联合风控审核评价。', status: true, version: 'v2.1.2', remarks: '接口联动' }
];

// Initial Penetration / Database Source Mock Data
const INITIAL_SOURCES = [
  { id: 'src1', indexName: '特种作业证件真伪核验率', type: 'AI智能采集', system: 'AI智能OCR单据识别系统', field: 't_worker_ocr.cert_verify_status', sync: '上传时触发', updated: '2026-07-09 11:20:15', status: '正常' },
  { id: 'src2', indexName: '月度班组考勤出勤天数', type: '实名制系统', system: '现场闸机刷卡微服务端口', field: 't_attendance.monthly_clock_days', sync: '每日 02:00 自动', updated: '2026-07-09 10:00:00', status: '正常' },
  { id: 'src3', indexName: '季度百日安全标兵红榜奖励', type: '人工维护', system: '平台录入后台台账', field: 't_manual_rewards.award_level', sync: '操作员保存触发', updated: '2026-07-09 09:30:00', status: '正常' },
  { id: 'src4', indexName: '现场违章施工安全通报处罚', type: 'AI智能采集', system: 'AI安全督查记录终端', field: 't_manual_punishments.fine_amount', sync: '实时推入数据', updated: '2026-07-08 17:45:00', status: '正常' },
  { id: 'src5', indexName: '入场职业健康体检合格率', type: 'API接口', system: '住建部实名制保险接口', field: 't_realname_workers.auth_status', sync: '每小时轮询同步', updated: '2026-07-09 12:00:00', status: '正常' }
];

// Initial Version Mock Data
const INITIAL_VERSIONS = [
  { id: 'v1', version: 'v2.4.1', creator: '张主管', time: '2026-07-09 11:20:15', status: '当前激活', desc: '增加了健康评价维度，补齐了特种起重操作证真伪校验加分公式' },
  { id: 'v2', version: 'v2.4.0', creator: '李经理', time: '2026-06-15 10:00:00', status: '历史版本', desc: '重新调整了安全履约天数和出勤扣分上限配置' },
  { id: 'v3', version: 'v2.3.8', creator: '张主管', time: '2026-05-12 14:30:00', status: '历史版本', desc: '删除了多余的技能测试阶梯，合并为固定分值考核' }
];

export default function IndexCenter({ triggerNotification }) {
  const [activeTab, setActiveTab] = useState('dimensions') // dimensions, indices, sources, alg, versions

  // Search and query filters
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterDimension, setFilterDimension] = useState('ALL')
  const [filterAlg, setFilterAlg] = useState('ALL')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Database list states
  const [dimensions, setDimensions] = useState(INITIAL_DIMENSIONS)
  const [indices, setIndices] = useState(INITIAL_INDICES)
  const [sources, setSources] = useState(INITIAL_SOURCES)
  const [versions, setVersions] = useState(INITIAL_VERSIONS)

  // Drawer modal states
  const [isAddIndexOpen, setIsAddIndexOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState(null)

  // Form states
  const [indexForm, setIndexForm] = useState({
    id: '',
    name: '',
    dimension: '职业能力',
    desc: '',
    source: '实名制系统',
    algType: '基准分',
    status: true,
    version: 'v2.4.1',
    remarks: ''
  })

  const [dimForm, setDimForm] = useState({
    id: '',
    name: '',
    desc: '',
    count: 0,
    weight: 20,
    status: true
  })
  const [isAddDimOpen, setIsAddDimOpen] = useState(false)

  // Active Algorithm editing configuration workspace
  const [selectedAlgIndexId, setSelectedAlgIndexId] = useState('IDX-002') // Default: 考勤出勤天数
  const [algType, setAlgType] = useState('阶梯评分') // Default type matching selected index

  // Sub-configuration forms based on selected type
  const [baseValue, setBaseValue] = useState('80')
  const [bonusCond, setBonusCond] = useState('获得优秀工匠称号')
  const [bonusScore, setBonusScore] = useState('10')
  const [bonusMax, setBonusMax] = useState('20')
  
  const [deductCond, setDeductCond] = useState('进入基坑不戴红色安全帽')
  const [deductScore, setDeductScore] = useState('15')
  const [deductMin, setDeductMin] = useState('-30')

  const [weightValue, setWeightValue] = useState('30')
  const [weightBase, setWeightBase] = useState('80')

  const [stepwiseRows, setStepwiseRows] = useState([
    { id: 1, limit: '连续出勤30天', days: 30, score: 5 },
    { id: 2, limit: '连续出勤90天', days: 90, score: 10 },
    { id: 3, limit: '连续出勤180天', days: 180, score: 20 }
  ])

  const [capPerItem, setCapPerItem] = useState('5')
  const [capMax, setCapMax] = useState('30')

  const [intervalRows, setIntervalRows] = useState([
    { min: '0', max: '30', score: '60' },
    { min: '31', max: '80', score: '85' },
    { min: '81', max: '100', score: '100' }
  ])

  // Simulation parameters
  const [mockInputVal, setMockInputVal] = useState('180')
  const [simulationResult, setSimulationResult] = useState(null)
  const [simulationTrace, setSimulationTrace] = useState([])

  // AI recommendations parameters
  const [aiSelectedRec, setAiSelectedRec] = useState({
    title: 'IDX-004 安全培训通报次数',
    recommends: '区间评分',
    reason: '安全培训次数高代表工人参与的合规度高。分值应成区间阶梯式上升，当次数大于10次时得分应为满分以形成良好正向激励。建议配置 [0-3次: 60分, 4-8次: 80分, 8次以上: 100分]。'
  })

  // Dynamic logic translation builder (AI natural translation)
  const computedLogicTranslation = useMemo(() => {
    if (algType === '基准分') {
      return `【自然语言评估】：凡是满足该指标合规底线要求的工人，默认基础得分为 ${baseValue} 分，在此基础上加减其他惩罚权重。`
    }
    if (algType === '加分项') {
      return `【自然语言评估】：当检测到工人满足条件「${bonusCond}」时，系统自动在其分值上累加 ${bonusScore} 分，累计奖励最高不超过 ${bonusMax} 分。`
    }
    if (algType === '扣分项') {
      return `【自然语言评估】：当工人在施工现场触发违规条件「${deductCond}」时，系统自动扣减评分 ${deductScore} 分，下限保底扣至 ${deductMin} 分不再累计。`
    }
    if (algType === '权重计分') {
      return `【自然语言评估】：以指标的原始基准分 ${weightBase} 分乘以权重比例 ${weightValue}%，最终计算出该指标对应的评估得占比分值。`
    }
    if (algType === '阶梯评分') {
      const stepsStr = stepwiseRows.map(r => `出勤 ${r.days} 天得 ${r.score} 分`).join('；');
      return `【自然语言评估】：指标以打卡考勤为依据，进行阶梯式跳跃算分：${stepsStr}。最高可得 ${Math.max(...stepwiseRows.map(r => r.score))} 分。`
    }
    if (algType === '区间评分') {
      const intervalsStr = intervalRows.map(r => `[${r.min}-${r.max}%]区间得 ${r.score} 分`).join('；');
      return `【自然语言评估】：指标分值采用区间滑块划分：${intervalsStr}。`
    }
    if (algType === '封顶评分') {
      return `【自然语言评估】：每项发生的合格指标计 ${capPerItem} 分，随着频次不断累计，但总得分上限被锁死封顶为 ${capMax} 分。`
    }
    return '【自然语言评估】：配置的评价指标得分为固定满分数值，通过/未通过即代表 100/0 分。'
  }, [algType, baseValue, bonusCond, bonusScore, bonusMax, deductCond, deductScore, deductMin, weightValue, weightBase, stepwiseRows, intervalRows, capPerItem, capMax])

  // Run scoring simulation sandbox
  const handleRunSimulation = () => {
    const val = parseFloat(mockInputVal) || 0
    let score = 0
    let trace = []

    trace.push(`[开始执行] 启动仿真引擎加载评价指标：${selectedAlgIndexId}`)
    trace.push(`[参数注入] 注入模拟输入数据: ${val}`)

    if (algType === '基准分') {
      score = parseFloat(baseValue)
      trace.push(`[规则判断] 基准分算法，加载默认分值: ${score}`)
    } else if (algType === '加分项') {
      const added = parseFloat(bonusScore)
      const max = parseFloat(bonusMax)
      score = Math.min(max, added)
      trace.push(`[规则判断] 加分项规则触发，加分分值: ${added}，限制最大封顶: ${max}`)
    } else if (algType === '扣分项') {
      const deducted = parseFloat(deductScore)
      const min = parseFloat(deductMin)
      score = Math.max(min, -deducted)
      trace.push(`[规则判断] 扣分项规则触发，扣减分值: ${deducted}，保底最少扣减至: ${min}`)
    } else if (algType === '阶梯评分') {
      // Find step
      const sortedSteps = [...stepwiseRows].sort((a, b) => b.days - a.days)
      const matchedStep = sortedSteps.find(s => val >= s.days)
      if (matchedStep) {
        score = matchedStep.score
        trace.push(`[规则判断] 满足出勤阶梯条件 「连续出勤天数 >= ${matchedStep.days} 天」`)
        trace.push(`[计分结果] 匹配得分: ${score} 分`)
      } else {
        score = 0
        trace.push(`[警告] 模拟天数 ${val} 低于最低阶梯限制，无出勤得分`)
      }
    } else if (algType === '区间评分') {
      const matchedInterval = intervalRows.find(r => val >= parseFloat(r.min) && val <= parseFloat(r.max))
      if (matchedInterval) {
        score = parseFloat(matchedInterval.score)
        trace.push(`[规则判断] 满足区间匹配 [${matchedInterval.min} - ${matchedInterval.max}]`)
        trace.push(`[计分结果] 获得区间分数: ${score}`)
      } else {
        score = 0
        trace.push(`[警告] 输入数值超出所有区间配置，默认得 0 分`)
      }
    } else {
      score = 100
      trace.push(`[计分结果] 默认计算规则，获得满分分值: 100分`)
    }

    trace.push(`[计算结束] 输出该工人模拟最终评价得分: ${score} 分`)
    setSimulationResult(score)
    setSimulationTrace(trace)
    triggerNotification('算法模拟计算成功！已输出公式推导流水', 'success')
  }

  // Dimension switches
  const handleToggleDimension = (id, currentStatus, name) => {
    setDimensions(prev => prev.map(d => {
      if (d.id === id) {
        const nextStatus = !currentStatus
        triggerNotification(`已${nextStatus ? '激活' : '禁用'}评价维度: 「${name}」`, 'warning')
        return { ...d, status: nextStatus }
      }
      return d
    }))
  }

  // Drill down from dimension card to index manager
  const handleEnterDimension = (name) => {
    setFilterDimension(name)
    setActiveTab('indices')
    triggerNotification(`已为您筛选维度为「${name}」的指标管理台账`, 'info')
  }

  // Advanced filters reset
  const handleQuery = () => {
    triggerNotification('正在按条件检索评价指标库...', 'info')
  }

  const handleReset = () => {
    setSearchKeyword('')
    setFilterDimension('ALL')
    setFilterAlg('ALL')
    triggerNotification('筛选过滤条件已清空', 'info')
  }

  // Drawer Form Save
  const openAddIndexDrawer = (record = null) => {
    if (record) {
      setEditingIndex(record)
      setIndexForm({ ...record })
    } else {
      setEditingIndex(null)
      setIndexForm({
        id: `IDX-00${indices.length + 1}`,
        name: '特种架子安拆实操红榜考核',
        dimension: '职业能力',
        desc: '对取得施工特种架手架合规安拆资格并在现场红榜表彰的工人予以评估分值。',
        source: 'AI智能采集',
        algType: '加分项',
        status: true,
        version: 'v2.4.1',
        remarks: '项目部评优使用'
      })
    }
    setIsAddIndexOpen(true)
  }

  const handleSaveIndexForm = (e) => {
    e.preventDefault()
    if (editingIndex) {
      setIndices(prev => prev.map(item => item.id === editingIndex.id ? { ...indexForm } : item))
      triggerNotification('评价指标更新成功！', 'success')
    } else {
      setIndices(prev => [indexForm, ...prev])
      triggerNotification('新增评价指标成功，已自动提交指标版本底账备案！', 'success')
    }
    setIsAddIndexOpen(false)
  }

  // Delete
  const handleDeleteIndex = (id) => {
    if (confirm(`警告！删除该评价指标可能会导致正在评估的模型输出产生数据断裂，确认删除 [${id}]？`)) {
      setIndices(prev => prev.filter(item => item.id !== id))
      triggerNotification('指标已成功卸载删除。', 'warning')
    }
  }

  // Copy
  const handleCopyIndex = (item) => {
    const copied = {
      ...item,
      id: `IDX-00${indices.length + 1}_COPY`,
      name: `${item.name}_复制版`
    }
    setIndices(prev => [copied, ...prev])
    triggerNotification(`已成功复制并克隆指标: ${item.name}`, 'success')
  }

  // Version rollback
  const handleRollbackVersion = (ver) => {
    if (confirm(`确认要将指标库的维度及权重回滚至历史版本「${ver}」吗？这会覆盖当前的所有配置！`)) {
      triggerNotification(`平台指标已成功整体回滚至 ${ver} 版本！正在重新预编译模型中...`, 'success')
    }
  }

  return (
    <div className="flex-grow flex flex-col gap-6">
      
      {/* 1. Page Title Header */}
      <div className="bg-white border border-border-gray rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
            <Sliders className="h-5.5 w-5.5 text-primary animate-pulse" />
            评价指标配置中心
            <span className="text-xs font-normal text-[#11356A] bg-[#11356A]/5 border border-[#11356A]/20 px-2 py-0.5 rounded">
              国企集团统一备案库
            </span>
          </h2>
          <p className="text-xs text-text-secondary mt-1.5">
            统一维护工人评价模型的维度划分、基础指标计算公式和原始数据映射源，修改后历史评价数据不受影响，自动生成版本归档。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerNotification('版本已发布归档，当前版本：v2.4.1', 'success')}
            className="px-3 py-1.5 bg-slate-100 border rounded font-bold text-xs text-text-dark flex items-center gap-1 cursor-pointer"
          >
            <History className="h-3 w-3 text-primary animate-spin" />
            当前指标库版本：v2.4.1
          </button>
        </div>
      </div>

      {/* 2. Top KPI Cards (5 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 shrink-0">
        {[
          { title: '评价维度数量', val: `${dimensions.length} 个`, desc: '安全、履约、能力等', time: '今日 14:00', icon: <LayoutGrid className="h-5 w-5 text-primary" /> },
          { title: '评价指标数量', val: `${indices.length} 项`, desc: '覆盖全业务指标项', time: '10分钟前', icon: <SlidersHorizontal className="h-5 w-5 text-indigo-500" /> },
          { title: '启用中指标', val: `${indices.filter(i => i.status).length} 项`, desc: '模型正常跑分调用', time: '自动同步中', icon: <CheckCircle className="h-5 w-5 text-success-green" /> },
          { title: '停用中指标', val: `${indices.filter(i => !i.status).length} 项`, desc: '历史过期或配置保留', time: '历史库可查', icon: <AlertCircle className="h-5 w-5 text-danger-red" /> },
          { title: '指标最新版本', val: 'v2.4.1', desc: '包含AI智能匹配解释', time: '更新于2026-07-09', icon: <FileCode className="h-5 w-5 text-orange-500" /> }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-border-gray p-4 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-all border-l-4 border-l-primary">
            <div className="flex items-start justify-between">
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{kpi.title}</div>
              <div className="bg-slate-50 p-1.5 rounded">{kpi.icon}</div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-black text-text-dark font-mono leading-none">{kpi.val}</div>
              <div className="flex items-center justify-between text-[10px] text-text-secondary mt-2">
                <span className="font-semibold text-primary">{kpi.desc}</span>
                <span>{kpi.time.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Primary Tabs Navigation */}
      <div className="bg-white border border-border-gray rounded shadow-sm flex flex-col min-h-[500px] flex-grow">
        
        {/* Navigation tabs */}
        <div className="flex border-b border-border-gray bg-slate-50 px-4 pt-3 shrink-0">
          {[
            { id: 'dimensions', label: '评价维度 (核心)', icon: <LayoutGrid className="h-4 w-4" /> },
            { id: 'indices', label: '指标管理台账', icon: <SlidersHorizontal className="h-4 w-4" /> },
            { id: 'sources', label: '数据来源映射', icon: <Brackets className="h-4 w-4" /> },
            { id: 'alg', label: '评分算法编辑器', icon: <FileCode className="h-4 w-4" /> },
            { id: 'versions', label: '指标版本管理', icon: <History className="h-4 w-4" /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4.5 py-3 text-xs font-bold border-t-2 border-x transition-all duration-150 cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white border-x-border-gray border-t-primary text-primary -mb-[1px] relative z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]'
                  : 'bg-transparent border-transparent text-text-secondary hover:text-primary hover:bg-slate-100'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Panels */}
        <div className="p-6 flex-grow flex flex-col min-h-[380px]">
          
          {/* ==========================================
              TAB 1: 评价维度 (Card Layout)
              ========================================== */}
          {activeTab === 'dimensions' && (
            <div className="flex-grow flex flex-col gap-6">
              
              <div className="flex items-center justify-between border-b pb-3 shrink-0">
                <div className="text-xs text-text-secondary font-bold">
                  平台划定 5 大评价主维度，点击维度卡片可直接穿透查看对应的底层细分评价指标。
                </div>
                <button
                  onClick={() => {
                    setDimForm({
                      id: `d_${Date.now()}`,
                      name: '综合发展素质',
                      desc: '评价工人自主进行线上工法创新、新材料应用及工伤防范素养评分。',
                      count: 0,
                      weight: 15,
                      status: true
                    })
                    setIsAddDimOpen(true)
                  }}
                  className="px-3.5 py-1.5 bg-[#52C41A] hover:bg-emerald-600 text-white rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  新增维度
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                {dimensions.map(d => (
                  <div key={d.id} className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1.5 w-full bg-[#11356A]" style={{ opacity: d.status ? 1 : 0.2 }}></div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-text-dark text-sm flex items-center gap-1.5">
                          {d.name}
                          <span className={`inline-block h-2 w-2 rounded-full ${d.status ? 'bg-success-green' : 'bg-slate-400'}`}></span>
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                          <span>状态：</span>
                          <input
                            type="checkbox"
                            checked={d.status}
                            onChange={() => handleToggleDimension(d.id, d.status, d.name)}
                            className="h-3.5 w-3.5 cursor-pointer"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed mb-4">{d.desc}</p>
                    </div>

                    <div className="border-t pt-3 mt-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">包含指标数量：</span>
                        <span className="font-bold font-mono text-[#11356A]">{d.count} 个</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">评价权重占比：</span>
                        <span className="font-bold text-indigo-700">{d.weight}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">最后更新时间：</span>
                        <span className="font-mono text-text-secondary">{d.updated}</span>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleEnterDimension(d.name)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-text-dark text-xs font-bold rounded shadow-sm cursor-pointer flex items-center gap-0.5"
                        >
                          进入指标
                          <TrendingUp className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 2: 指标管理台账 (Table Layout)
              ========================================== */}
          {activeTab === 'indices' && (
            <div className="flex-grow flex flex-col gap-6">
              
              {/* Search bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 border border-border-gray rounded shrink-0">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="搜索指标名称/编码..."
                      className="bg-white border border-slate-300 rounded px-2.5 pl-8 py-1 text-xs text-text-dark w-48"
                    />
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  </div>

                  <div>
                    <select
                      value={filterDimension}
                      onChange={(e) => setFilterDimension(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-text-dark"
                    >
                      <option value="ALL">全部维度</option>
                      <option value="职业能力">职业能力</option>
                      <option value="履约能力">履约能力</option>
                      <option value="安全能力">安全能力</option>
                      <option value="健康能力">健康能力</option>
                      <option value="信用能力">信用能力</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterAlg}
                      onChange={(e) => setFilterAlg(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-text-dark"
                    >
                      <option value="ALL">全部算法类型</option>
                      <option value="基准分">基准分</option>
                      <option value="加分项">加分项</option>
                      <option value="扣分项">扣分项</option>
                      <option value="阶梯评分">阶梯评分</option>
                      <option value="固定分值">固定分值</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handleQuery} className="px-3.5 py-1.5 bg-[#11356A] hover:bg-primary-hover text-white text-xs font-bold rounded shadow-sm cursor-pointer">查询</button>
                  <button onClick={handleReset} className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-text-dark border border-slate-300 text-xs font-bold rounded shadow-sm cursor-pointer">重置</button>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-border-gray p-4 rounded shrink-0">
                <div className="text-xs text-text-secondary font-bold flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-primary animate-pulse" />
                  <span>当前筛选出 {indices.length} 项评估指标</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAddIndexDrawer()}
                    className="px-3 py-1.5 bg-[#52C41A] hover:bg-emerald-600 text-white rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    新增指标
                  </button>
                  <button
                    onClick={() => triggerNotification('Excel 导出成功！已保存为平台标准副本。', 'success')}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-text-dark rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1 hover:bg-slate-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    导出Excel
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                <table className="b-table text-xs">
                  <thead>
                    <tr>
                      <th>指标编号</th>
                      <th>指标名称</th>
                      <th>所属评价维度</th>
                      <th>指标详细说明</th>
                      <th>数据同步来源</th>
                      <th>关联评分算法</th>
                      <th>启用状态</th>
                      <th>版本</th>
                      <th>更新时间</th>
                      <th className="text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {indices.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="font-mono font-bold text-[#11356A]">{item.id}</td>
                        <td className="font-bold text-text-dark">{item.name}</td>
                        <td>
                          <span className="bg-slate-100 text-text-dark border px-2 py-0.5 rounded text-[10px] font-bold">
                            {item.dimension}
                          </span>
                        </td>
                        <td className="max-w-[200px] truncate text-text-secondary" title={item.desc}>{item.desc}</td>
                        <td className="font-semibold">{item.source}</td>
                        <td>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-black border ${
                            item.algType === '扣分项' ? 'bg-red-50 text-danger-red border-red-200' :
                            item.algType === '加分项' ? 'bg-emerald-50 text-success-green border-emerald-200' :
                            'bg-blue-50 text-[#11356A] border-blue-200'
                          }`}>
                            {item.algType}
                          </span>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.status}
                            onChange={() => {
                              setIndices(prev => prev.map(idxObj => idxObj.id === item.id ? { ...idxObj, status: !idxObj.status } : idxObj))
                              triggerNotification(`指标状态已切换。`, 'info')
                            }}
                            className="h-3.5 w-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="font-mono text-text-secondary">{item.version}</td>
                        <td className="font-mono text-text-secondary">2026-07-09</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedDetails(item)
                                setIsDetailDrawerOpen(true)
                              }}
                              className="text-text-secondary hover:text-text-dark font-bold text-xs bg-slate-50 border px-2 py-1 rounded cursor-pointer"
                            >
                              查看
                            </button>
                            <button
                              onClick={() => openAddIndexDrawer(item)}
                              className="text-primary hover:text-primary-hover font-bold text-xs bg-primary/5 border border-primary/20 px-2 py-1 rounded cursor-pointer"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleCopyIndex(item)}
                              className="text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 border border-indigo-200 px-2 py-1 rounded cursor-pointer"
                            >
                              复制
                            </button>
                            <button
                              onClick={() => handleDeleteIndex(item.id)}
                              className="text-danger-red hover:text-red-700 font-bold text-xs bg-red-50 border border-red-200 px-2 py-1 rounded cursor-pointer"
                            >
                              删除
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

          {/* ==========================================
              TAB 3: 数据来源映射
              ========================================== */}
          {activeTab === 'sources' && (
            <div className="flex-grow flex flex-col gap-6">
              
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                <table className="b-table text-xs">
                  <thead>
                    <tr>
                      <th>对应评价指标</th>
                      <th>来源类型</th>
                      <th>数据源系统</th>
                      <th>映射底层数据库字段</th>
                      <th>同步触发方式</th>
                      <th>最后同步映射时间</th>
                      <th>接口连接状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.map(src => (
                      <tr key={src.id} className="hover:bg-slate-50 transition-colors">
                        <td className="font-bold text-text-dark">{src.indexName}</td>
                        <td>
                          <span className="bg-slate-100 text-slate-700 border px-2 py-0.5 rounded text-[10px] font-semibold">
                            {src.type}
                          </span>
                        </td>
                        <td className="font-semibold text-text-dark">{src.system}</td>
                        <td className="font-mono text-indigo-700 font-semibold">{src.field}</td>
                        <td>{src.sync}</td>
                        <td className="font-mono text-text-secondary">{src.updated}</td>
                        <td>
                          <span className="bg-emerald-50 text-success-green border border-emerald-200 px-2 py-0.5 rounded font-black text-[10px]">
                            {src.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 4: 评分算法编辑器 (Core module)
              ========================================== */}
          {activeTab === 'alg' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
              
              {/* Left Form: Select Index, Select Alg, Config */}
              <div className="lg:col-span-8 bg-white border border-border-gray rounded-lg p-5 flex flex-col gap-6 shadow-sm">
                
                {/* AI Rec Notification banner */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start gap-3 text-xs">
                  <div className="bg-indigo-500/10 p-1.5 rounded-full shrink-0">
                    <Sparkles className="h-5.5 w-5.5 text-indigo-500 animate-bounce" />
                  </div>
                  <div>
                    <div className="font-bold text-[#11356A] flex items-center gap-1.5">
                      <span>AI 算法配置推荐引擎</span>
                      <span className="bg-[#11356A]/5 border border-[#11356A]/20 text-[9.5px] px-1.5 py-0.2 rounded font-black">
                        智能建议
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                      系统检测到指标 <strong>{aiSelectedRec.title}</strong> 包含多阶梯发生频率。AI推荐采用：
                      <strong className="text-indigo-700 font-black">「{aiSelectedRec.recommends}」</strong>。原因：
                      {aiSelectedRec.reason}
                    </p>
                    <button
                      onClick={() => {
                        setAlgType('区间评分')
                        triggerNotification('已采纳 AI 建议，成功将算法类型切换至 [区间评分]', 'success')
                      }}
                      className="mt-2 text-xs font-black text-indigo-600 hover:underline flex items-center gap-0.5"
                    >
                      点击一键采纳并配置
                    </button>
                  </div>
                </div>

                {/* Step 1: Select target Index */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-text-secondary mb-1.5">选择评价指标</label>
                    <select
                      value={selectedAlgIndexId}
                      onChange={(e) => {
                        setSelectedAlgIndexId(e.target.value)
                        const ind = indices.find(i => i.id === e.target.value)
                        if (ind) {
                          setAlgType(ind.algType)
                        }
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-2 text-xs text-text-dark"
                    >
                      {indices.map(ind => (
                        <option key={ind.id} value={ind.id}>{ind.id} - {ind.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-text-secondary mb-1.5">算法计算类型</label>
                    <select
                      value={algType}
                      onChange={(e) => setAlgType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-2 text-xs text-text-dark font-bold"
                    >
                      <option value="基准分">基准分</option>
                      <option value="加分项">加分项</option>
                      <option value="扣分项">扣分项</option>
                      <option value="权重计分">权重计分</option>
                      <option value="区间评分">区间评分</option>
                      <option value="阶梯评分">阶梯评分</option>
                      <option value="封顶评分">封顶评分</option>
                      <option value="固定分值">固定分值</option>
                    </select>
                  </div>
                </div>

                {/* Step 2: Dynamic config inputs based on algorithm selection */}
                <div className="border-t border-dashed border-slate-200 pt-5 space-y-4">
                  <div className="text-xs font-bold text-text-dark flex items-center gap-1.5">
                    <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
                    <span>算法因子具体参数配置</span>
                  </div>

                  {algType === '基准分' && (
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-text-secondary mb-1">默认基础分值 (分)</label>
                        <input
                          type="number"
                          value={baseValue}
                          onChange={(e) => setBaseValue(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-text-secondary mb-1">最高得分上限 (分)</label>
                        <input type="number" disabled value="100" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-text-secondary font-mono" />
                      </div>
                      <div>
                        <label className="block font-bold text-text-secondary mb-1">最低得分保底 (分)</label>
                        <input type="number" disabled value="0" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-text-secondary font-mono" />
                      </div>
                    </div>
                  )}

                  {algType === '加分项' && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-text-secondary mb-1">加分奖励触发条件</label>
                          <input
                            type="text"
                            value={bonusCond}
                            onChange={(e) => setBonusCond(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-text-secondary mb-1">每次加分值</label>
                            <input
                              type="number"
                              value={bonusScore}
                              onChange={(e) => setBonusScore(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-text-secondary mb-1">累积加分上限</label>
                            <input
                              type="number"
                              value={bonusMax}
                              onChange={(e) => setBonusMax(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {algType === '扣分项' && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-text-secondary mb-1">扣分处罚触发条件</label>
                          <input
                            type="text"
                            value={deductCond}
                            onChange={(e) => setDeductCond(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-text-secondary mb-1">每次扣减值</label>
                            <input
                              type="number"
                              value={deductScore}
                              onChange={(e) => setDeductScore(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark font-mono text-danger-red font-bold"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-text-secondary mb-1">累计扣分保底限</label>
                            <input
                              type="number"
                              value={deductMin}
                              onChange={(e) => setDeductMin(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {algType === '权重计分' && (
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-text-secondary mb-1">基础总分分值 (分)</label>
                        <input
                          type="number"
                          value={weightBase}
                          onChange={(e) => setWeightBase(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-text-secondary mb-1">分配权重比例 (%)</label>
                        <input
                          type="number"
                          value={weightValue}
                          onChange={(e) => setWeightValue(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark font-mono text-primary font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {algType === '阶梯评分' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text-secondary">动态阶梯算分设置表</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newId = stepwiseRows.length + 1
                            setStepwiseRows([...stepwiseRows, { id: newId, limit: `连续出勤${newId * 60}天`, days: newId * 60, score: newId * 10 }])
                          }}
                          className="text-primary hover:text-primary-hover font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          添加阶梯行
                        </button>
                      </div>

                      <table className="w-full border text-left text-xs bg-slate-50">
                        <thead>
                          <tr className="bg-slate-100 border-b">
                            <th className="p-2">阶梯层级</th>
                            <th className="p-2">最小触发出勤限制 (天)</th>
                            <th className="p-2">满足条件得分 (分)</th>
                            <th className="p-2 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stepwiseRows.map((row, idx) => (
                            <tr key={row.id} className="border-b">
                              <td className="p-2 font-bold text-text-dark">阶梯 {idx + 1}</td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={row.days}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0
                                    setStepwiseRows(stepwiseRows.map(r => r.id === row.id ? { ...r, days: val, limit: `连续出勤${val}天` } : r))
                                  }}
                                  className="bg-white border rounded px-2 py-1 w-24"
                                />
                              </td>
                              <td className="p-2 font-mono font-bold text-primary">
                                <input
                                  type="number"
                                  value={row.score}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0
                                    setStepwiseRows(stepwiseRows.map(r => r.id === row.id ? { ...r, score: val } : r))
                                  }}
                                  className="bg-white border rounded px-2 py-1 w-24"
                                />
                              </td>
                              <td className="p-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => setStepwiseRows(stepwiseRows.filter(r => r.id !== row.id))}
                                  className="text-danger-red hover:text-red-700 font-bold p-1 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {algType === '区间评分' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text-secondary">数值百分比区间分配得分</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIntervalRows([...intervalRows, { min: '0', max: '100', score: '50' }])
                          }}
                          className="text-primary hover:text-primary-hover font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          添加区间
                        </button>
                      </div>

                      <div className="space-y-2">
                        {intervalRows.map((row, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-slate-50 border p-2 rounded">
                            <span className="font-bold text-text-secondary w-16">区间 {idx + 1}:</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={row.min}
                                onChange={(e) => setIntervalRows(intervalRows.map((r, i) => i === idx ? { ...r, min: e.target.value } : r))}
                                className="bg-white border rounded px-2 py-1 w-16 text-center"
                              />
                              <span>%</span>
                              <span>至</span>
                              <input
                                type="number"
                                value={row.max}
                                onChange={(e) => setIntervalRows(intervalRows.map((r, i) => i === idx ? { ...r, max: e.target.value } : r))}
                                className="bg-white border rounded px-2 py-1 w-16 text-center"
                              />
                              <span>%</span>
                            </div>
                            <div className="h-4 w-[1px] bg-slate-300"></div>
                            <div className="flex items-center gap-1">
                              <span>该区间得分：</span>
                              <input
                                type="number"
                                value={row.score}
                                onChange={(e) => setIntervalRows(intervalRows.map((r, i) => i === idx ? { ...r, score: e.target.value } : r))}
                                className="bg-white border rounded px-2 py-1 w-16 text-center font-bold text-primary"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setIntervalRows(intervalRows.filter((r, i) => i !== idx))}
                              className="text-danger-red hover:text-red-700 ml-auto cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {algType === '封顶评分' && (
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-text-secondary mb-1">单次达标增加得分 (分)</label>
                        <input
                          type="number"
                          value={capPerItem}
                          onChange={(e) => setCapPerItem(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-text-secondary mb-1">指标封顶最高得分 (分)</label>
                        <input
                          type="number"
                          value={capMax}
                          onChange={(e) => setCapMax(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark font-mono text-[#11356A] font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {algType === '固定分值' && (
                    <div className="bg-slate-50 border p-4 rounded-lg text-xs space-y-2 text-text-secondary">
                      <div className="font-bold text-text-dark">固定分值说明：</div>
                      <div>系统不对原始数据作算术累加，符合判定条件（如：特种作业持证）即代表满分（100分），未通过代表 0 分。</div>
                    </div>
                  )}

                </div>

                {/* Step 3: Simulation sandbox */}
                <div className="border-t border-slate-200 pt-5 mt-4 space-y-3">
                  <div className="text-xs font-bold text-text-dark">🎛️ 算法执行仿真沙盒 (Simulation Sandbox)</div>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 border rounded-lg text-xs">
                    <div>
                      <span className="text-text-secondary">注入仿真指标数值：</span>
                      <input
                        type="number"
                        value={mockInputVal}
                        onChange={(e) => setMockInputVal(e.target.value)}
                        className="bg-white border rounded px-3 py-1.5 w-28 text-center font-bold font-mono text-primary"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRunSimulation}
                      className="px-4 py-1.5 bg-[#11356A] hover:bg-primary-hover text-white font-bold rounded shadow-sm cursor-pointer flex items-center gap-1"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      运行仿真计算
                    </button>
                  </div>

                  {simulationResult !== null && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2 animate-slide-down">
                      <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-[10px] space-y-1.5 max-h-[160px] overflow-y-auto">
                        <div className="text-success-green font-bold border-b border-slate-800 pb-1 mb-2">仿真引擎算分推导日志：</div>
                        {simulationTrace.map((tr, idx) => (
                          <div key={idx}>{tr}</div>
                        ))}
                      </div>
                      <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                        <span className="text-text-secondary text-[11px] font-bold">最终推算工人得分</span>
                        <div className="text-3xl font-black text-success-green font-mono mt-1">{simulationResult} 分</div>
                        <span className="text-[10px] text-slate-400 mt-2">计算公式校验结果：正常合格</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 border-t pt-4">
                  <button
                    onClick={() => {
                      triggerNotification('指标计算公式已保存入库，自动升版指标版本。', 'success')
                    }}
                    className="px-5 py-2 bg-primary hover:bg-[#1b3d6f] text-white text-xs font-bold rounded shadow-sm cursor-pointer"
                  >
                    保存计算规则并提交
                  </button>
                </div>

              </div>

              {/* Right Column: Dynamic logic translation card (light blue bg) */}
              <div className="lg:col-span-4 bg-indigo-50/50 border border-indigo-100 rounded-lg p-5 flex flex-col gap-4 shadow-sm max-h-[500px] overflow-y-auto">
                <div className="flex items-center gap-1.5 text-[#11356A] font-bold text-xs shrink-0 border-b pb-2">
                  <Cpu className="h-4.5 w-4.5 text-indigo-600" />
                  <span>AI 算法逻辑语义翻译</span>
                </div>
                
                <div className="bg-white border border-indigo-150 p-4 rounded shadow-sm space-y-3 text-xs flex-grow">
                  <div className="font-bold text-text-dark">指标名：{indices.find(i => i.id === selectedAlgIndexId)?.name}</div>
                  <div className="text-[11px] text-text-secondary">类型：{algType}</div>
                  <div className="h-[1px] bg-slate-200"></div>
                  <p className="text-indigo-800 font-medium leading-relaxed">
                    {computedLogicTranslation}
                  </p>
                </div>

                <div className="bg-white border rounded p-3 text-[10px] text-text-secondary space-y-1.5">
                  <div className="font-bold text-text-dark">AI 算法评测示例：</div>
                  <div>- 若输入 <strong>10</strong>，则计算得分：5分</div>
                  <div>- 若输入 <strong>95</strong>，则计算得分：10分</div>
                  <div>- 若输入 <strong>185</strong>，则计算得分：20分</div>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 5: 指标版本管理
              ========================================== */}
          {activeTab === 'versions' && (
            <div className="flex-grow flex flex-col gap-6">
              
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                <table className="b-table text-xs">
                  <thead>
                    <tr>
                      <th>版本归档号</th>
                      <th>发版时间</th>
                      <th>发版操作员</th>
                      <th>版本发版说明</th>
                      <th>使用状态</th>
                      <th className="text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="font-mono font-bold text-[#11356A]">{v.version}</td>
                        <td className="font-mono text-text-secondary">{v.time}</td>
                        <td className="font-bold text-text-dark">{v.creator}</td>
                        <td className="max-w-md truncate text-text-secondary" title={v.desc}>{v.desc}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            v.status === '当前激活' ? 'bg-emerald-50 text-success-green border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => triggerNotification(`已复制归档版本: ${v.version}`, 'success')}
                              className="text-text-secondary hover:text-text-dark font-bold text-xs bg-slate-50 border px-2 py-1 rounded cursor-pointer"
                            >
                              复制
                            </button>
                            <button
                              onClick={() => handleRollbackVersion(v.version)}
                              disabled={v.status === '当前激活'}
                              className={`font-bold text-xs border px-2 py-1 rounded ${
                                v.status === '当前激活'
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : 'text-primary hover:text-primary-hover bg-primary/5 border-primary/20 cursor-pointer'
                              }`}
                            >
                              回滚至此版本
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

        </div>
      </div>

      {/* ======================================================================
          DRAWER 1: ADD/EDIT INDEX (新增/修改指标右侧抽屉)
          ====================================================================== */}
      {isAddIndexOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsAddIndexOpen(false)}></div>

          {/* Form Panel */}
          <form
            onSubmit={handleSaveIndexForm}
            className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in"
          >
            {/* Header */}
            <div className="p-5 border-b bg-slate-50 border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-text-dark flex items-center gap-1.5">
                <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
                <span>{editingIndex ? '编辑评价指标' : '新增评价指标'}</span>
              </h3>
              <button type="button" onClick={() => setIsAddIndexOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable inputs */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-text-secondary mb-1">所属评价维度</label>
                  <select
                    value={indexForm.dimension}
                    onChange={(e) => setIndexForm({ ...indexForm, dimension: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                  >
                    <option value="职业能力">职业能力</option>
                    <option value="履约能力">履约能力</option>
                    <option value="安全能力">安全能力</option>
                    <option value="健康能力">健康能力</option>
                    <option value="信用能力">信用能力</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-text-secondary mb-1">指标唯一编码</label>
                  <input
                    type="text"
                    required
                    value={indexForm.id}
                    onChange={(e) => setIndexForm({ ...indexForm, id: e.target.value })}
                    placeholder="如: IDX-007"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-secondary mb-1">指标名称</label>
                <input
                  type="text"
                  required
                  value={indexForm.name}
                  onChange={(e) => setIndexForm({ ...indexForm, name: e.target.value })}
                  placeholder="指标全名"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-text-secondary mb-1">物理数据来源</label>
                  <select
                    value={indexForm.source}
                    onChange={(e) => setIndexForm({ ...indexForm, source: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark font-bold"
                  >
                    <option value="实名制系统">实名制系统接口</option>
                    <option value="AI智能采集">AI 智能 OCR</option>
                    <option value="人工维护">人工维护补登</option>
                    <option value="系统计算">系统自动跑分计算</option>
                    <option value="API接口">外接第三方API</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-text-secondary mb-1">计分公式算法</label>
                  <select
                    value={indexForm.algType}
                    onChange={(e) => setIndexForm({ ...indexForm, algType: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark font-bold text-[#11356A]"
                  >
                    <option value="基准分">基准分</option>
                    <option value="加分项">加分项</option>
                    <option value="扣分项">扣分项</option>
                    <option value="阶梯评分">阶梯评分</option>
                    <option value="区间评分">区间评分</option>
                    <option value="固定分值">固定分值</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-secondary mb-1">指标配置说明</label>
                <textarea
                  required
                  rows="3"
                  value={indexForm.desc}
                  onChange={(e) => setIndexForm({ ...indexForm, desc: e.target.value })}
                  placeholder="该评估项的具体计算要求和边界逻辑..."
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-text-secondary mb-1">版本归档号</label>
                <input
                  type="text"
                  disabled
                  value={indexForm.version}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-text-secondary font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-text-secondary mb-1">备注信息</label>
                <input
                  type="text"
                  value={indexForm.remarks}
                  onChange={(e) => setIndexForm({ ...indexForm, remarks: e.target.value })}
                  placeholder="其他备注"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddIndexOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-text-dark font-bold rounded shadow-sm cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-[#1b3d6f] text-white font-bold rounded shadow cursor-pointer transition-colors"
              >
                发布指标
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================================
          DRAWER 2: INDEX DETAIL VIEWER (查看指标穿透详情右侧抽屉)
          ====================================================================== */}
      {isDetailDrawerOpen && selectedDetails && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsDetailDrawerOpen(false)}></div>

          {/* Details Panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="p-5 border-b bg-slate-50 border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-text-dark flex items-center gap-1.5">
                <Info className="h-4.5 w-4.5 text-primary" />
                <span>评价指标元数据详情</span>
              </h3>
              <button onClick={() => setIsDetailDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Index overview */}
              <div className="bg-slate-50 border rounded-lg p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#11356A] text-sm">{selectedDetails.id}</span>
                  <span className="bg-emerald-50 text-success-green border border-emerald-250 px-2 py-0.5 rounded text-[10px] font-bold">
                    已激活
                  </span>
                </div>
                <h4 className="font-bold text-text-dark text-sm leading-tight">{selectedDetails.name}</h4>
                <p className="text-text-secondary leading-relaxed">{selectedDetails.desc}</p>
              </div>

              {/* Mappings */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-text-dark border-l-4 border-primary pl-2 uppercase tracking-wide">
                  指标数据血缘图谱
                </div>
                <div className="bg-slate-50 border rounded p-4 space-y-3">
                  <div>
                    <span className="text-text-secondary">评价所属维度：</span>
                    <span className="font-bold text-text-dark">{selectedDetails.dimension}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">物理接收源头：</span>
                    <span className="font-bold text-indigo-700">{selectedDetails.source}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">映射数据表：</span>
                    <span className="font-mono font-semibold text-text-dark">t_eval_index_data</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">映射物理字段：</span>
                    <span className="font-mono text-danger-red font-bold">idx_{selectedDetails.id.toLowerCase().replace('-', '_')}_score</span>
                  </div>
                </div>
              </div>

              {/* Version History logs */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-text-dark border-l-4 border-primary pl-2 uppercase tracking-wide">
                  版本与归档记录
                </div>
                <div className="space-y-2">
                  {[
                    { ver: 'v2.4.1', date: '2026-07-09', desc: '新增了判定异常数据跳过逻辑' },
                    { ver: 'v2.3.0', date: '2026-05-12', desc: '初始指标备案发布' }
                  ].map((v, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 text-[11px]">
                      <div>
                        <span className="font-bold text-text-dark font-mono">{v.ver}</span>
                        <p className="text-slate-400 mt-0.5">{v.desc}</p>
                      </div>
                      <span className="text-text-secondary font-mono">{v.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex items-center justify-end shrink-0">
              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="px-4 py-2 bg-primary hover:bg-[#1b3d6f] text-white text-xs font-bold rounded shadow-sm cursor-pointer"
              >
                确认关闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: ADD DIMENSION (新增评价维度对话框/模态窗口)
          ====================================================================== */}
      {isAddDimOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsAddDimOpen(false)}></div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDimensions([...dimensions, dimForm])
              triggerNotification(`已新增评价维度: ${dimForm.name}`, 'success')
              setIsAddDimOpen(false)
            }}
            className="relative bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col z-10 overflow-hidden animate-zoom-in text-xs"
          >
            <div className="p-4 border-b bg-slate-50 border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-dark">新增评价评价维度</h3>
              <button type="button" onClick={() => setIsAddDimOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-bold text-text-secondary mb-1">维度名称</label>
                <input
                  type="text"
                  required
                  value={dimForm.name}
                  onChange={(e) => setDimForm({ ...dimForm, name: e.target.value })}
                  placeholder="如: 心理健康测评"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-text-dark"
                />
              </div>
              <div>
                <label className="block font-bold text-text-secondary mb-1">分配权重占比 (%)</label>
                <input
                  type="number"
                  required
                  value={dimForm.weight}
                  onChange={(e) => setDimForm({ ...dimForm, weight: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-text-dark"
                />
              </div>
              <div>
                <label className="block font-bold text-text-secondary mb-1">维度描述信息</label>
                <textarea
                  required
                  rows="3"
                  value={dimForm.desc}
                  onChange={(e) => setDimForm({ ...dimForm, desc: e.target.value })}
                  placeholder="简要描述该维度的考核评价方向..."
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-text-dark"
                ></textarea>
              </div>
            </div>
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddDimOpen(false)} className="px-4 py-2 bg-white border rounded shadow-sm font-bold text-text-dark cursor-pointer">
                取消
              </button>
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded shadow font-bold cursor-pointer">
                添加维度
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}

```

## File: src/pages/ModelCenter.jsx

```javascript
import { useState, useMemo, useEffect } from 'react'
import {
  Sliders,
  Play,
  Clock,
  RotateCcw,
  Plus,
  X,
  Check,
  Search,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Trash2,
  ListFilter,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Info,
  HelpCircle,
  Activity,
  Sparkles,
  Download,
  Upload,
  History,
  Award,
  ArrowLeft,
  Copy,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react'

// Initial Models Data
const INITIAL_MODELS = [
  { id: 'MOD-001', name: '建筑产业工人通用评级模型', code: 'MODEL_GEN_01', scope: '集团全项目', version: 'v2.4.0', status: true, creator: '张经理', created: '2026-05-10', updated: '2026-07-09', remarks: '覆盖全员基准评价' },
  { id: 'MOD-002', name: '高空作业特种工安全专项模型', code: 'MODEL_HIGH_SAFE', scope: '高处作业/特种班组', version: 'v1.0.8', status: true, creator: '李安全', created: '2026-06-15', updated: '2026-07-08', remarks: '安全红线高防范' },
  { id: 'MOD-003', name: '集团新星班组长领导力评级模型', code: 'MODEL_LEAD_STAR', scope: '各工种班组长', version: 'v1.2.0', status: false, creator: '王主管', created: '2026-06-01', updated: '2026-06-30', remarks: '侧重于班组管理' }
];

// Initial Version timelines
const INITIAL_VERSIONS = [
  { version: 'v2.4.0', date: '2026-07-09', creator: '张经理', desc: '微调了安全管理和职业能力权重，强化特种执业证关联。', status: '当前激活', runs: 285 },
  { version: 'v2.3.8', date: '2026-06-20', creator: '张经理', desc: '调整了C级警示分值区间线，放宽了工伤保险准入率扣分。', status: '历史版本', runs: 120 },
  { version: 'v2.1.0', date: '2026-05-15', creator: '李经理', desc: '初始版本上线备案，支持5大维度滑块配置。', status: '历史版本', runs: 65 }
];

// Initial Levels Configs
const INITIAL_LEVELS = [
  { id: 'l1', name: 'A 级', label: '杰出优秀工人', min: 90, max: 100, color: '#52C41A', desc: '特种持证完备，连续出勤出满，无任何违章处罚。' },
  { id: 'l2', name: 'B 级', label: '良好合格工人', min: 80, max: 89, color: '#1890FF', desc: '各项指标合格，具备良好的专业实操及履约素养。' },
  { id: 'l3', name: 'C 级', label: '基本合格工人', min: 70, max: 79, color: '#722ED1', desc: '偶有小微违规或出勤偏少，整体处于可控制区间。' },
  { id: 'l4', name: 'D 级', label: '安全警示人员', min: 60, max: 69, color: '#FA8C16', desc: '发生过多次违章施工通报，需加强日常考核警示。' },
  { id: 'l5', name: 'E 级', label: '不合格清退', min: 0, max: 59, color: '#F5222D', desc: '严重红线违规，或体检不合格判定有高空禁忌症。' }
];

// Execution Logs
const INITIAL_EXEC_LOGS = [
  { id: 'RUN-109', time: '2026-07-09 00:00:05', creator: '自动调度', project: '集团全项目', total: 1265, success: 1262, failed: 3, type: '自动执行', duration: '4.2s', status: '成功' },
  { id: 'RUN-108', time: '2026-07-08 16:30:00', creator: '李安全', project: '北京CBD东区超高层项目', total: 145, success: 145, failed: 0, type: '立即执行', duration: '1.2s', status: '成功' },
  { id: 'RUN-107', time: '2026-07-05 23:00:02', creator: '定时调度', project: '集团高空作业专项', total: 120, success: 118, failed: 2, type: '定时执行', duration: '1.8s', status: '成功' }
];

// Mock Workers list for simulation
const MOCK_WORKERS = [
  { id: 'w1', name: '张建国', job: '特种塔吊工', score: 94, level: 'A 级', details: { capability: 95, attendance: 90, safety: 96, health: 92, credit: 98 } },
  { id: 'w2', name: '李强', job: '架子工', score: 85, level: 'B 级', details: { capability: 82, attendance: 88, safety: 80, health: 90, credit: 92 } },
  { id: 'w3', name: '王朝阳', job: '电焊工', score: 72, level: 'C 级', details: { capability: 78, attendance: 65, safety: 70, health: 80, credit: 75 } },
  { id: 'w4', name: '刘小虎', job: '普工', score: 58, level: 'E 级', details: { capability: 50, attendance: 62, safety: 45, health: 80, credit: 60 } }
];

export default function ModelCenter({ triggerNotification }) {
  const [activeTab, setActiveTab] = useState('models') // models, versions, weight, levels, exec, logs

  // Filter queries
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterModel, setFilterModel] = useState('ALL')
  const [filterProject, setFilterProject] = useState('ALL')

  // Lists state
  const [models, setModels] = useState(INITIAL_MODELS)
  const [versions, setVersions] = useState(INITIAL_VERSIONS)
  const [levels, setLevels] = useState(INITIAL_LEVELS)
  const [execLogs, setExecLogs] = useState(INITIAL_EXEC_LOGS)

  // Drawer Form Dialogs
  const [isAddModelOpen, setIsAddModelOpen] = useState(false)
  const [editingModel, setEditingModel] = useState(null)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState(null)

  // New model form
  const [modelForm, setModelForm] = useState({
    id: '',
    name: '',
    code: '',
    scope: '集团全项目',
    version: 'v1.0.0',
    status: true,
    creator: '张经理',
    remarks: ''
  })

  // Version Comparison modal parameters
  const [compareVerA, setCompareVerA] = useState('v2.4.0')
  const [compareVerB, setCompareVerB] = useState('v2.3.8')
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  // Dynamic Sliders state (Tab 3)
  const [sliders, setSliders] = useState({
    professional: 30,
    fulfillment: 25,
    safety: 20,
    health: 10,
    credit: 15
  })

  const totalSliderSum = useMemo(() => {
    return sliders.professional + sliders.fulfillment + sliders.safety + sliders.health + sliders.credit
  }, [sliders])

  // Grade rules sorting (Tab 4)
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false)
  const [levelForm, setLevelForm] = useState({ id: '', name: 'F级', label: '重点跟进人员', min: 0, max: 49, color: '#D9D9D9', desc: '' })

  // Execution engine state (Tab 5)
  const [execType, setExecType] = useState('immediate') // immediate, scheduled, auto
  const [execProject, setExecProject] = useState('北京CBD东区超高层项目')
  const [execScopeSelect, setExecScopeSelect] = useState('全员')
  
  // Progress states for immediate runner
  const [isRunning, setIsRunning] = useState(false)
  const [runProgress, setRunProgress] = useState(0)
  const [runTotal, setRunTotal] = useState(0)
  const [runSuccess, setRunSuccess] = useState(0)
  const [runFailed, setRunFailed] = useState(0)
  const [runStepText, setRunStepText] = useState('')

  // Simulator states
  const [simWorkerId, setSimWorkerId] = useState('w1')
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState(null)

  // Execution audit Log Drawer (Tab 6)
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)

  // Trigger Immediate Run Evaluation
  const handleStartImmediateRun = () => {
    setIsRunning(true)
    setRunProgress(5)
    setRunTotal(126)
    setRunSuccess(0)
    setRunFailed(0)
    setRunStepText('正在初始化评价权重因子及公式...')

    let progress = 5
    const interval = setInterval(() => {
      progress += 15
      if (progress >= 100) {
        clearInterval(interval)
        setRunProgress(100)
        setRunSuccess(124)
        setRunFailed(2)
        setRunStepText('综合评价结算完毕！已写入历史备份数据库。')
        setIsRunning(false)

        // Append to logs
        const newLog = {
          id: `RUN-${Date.now().toString().slice(-3)}`,
          time: new Date().toISOString().replace('T', ' ').slice(0, 19),
          creator: '张经理',
          project: execProject,
          total: 126,
          success: 124,
          failed: 2,
          type: '立即执行',
          duration: '2.4s',
          status: '成功'
        }
        setExecLogs(prev => [newLog, ...prev])
        triggerNotification('已完成评价执行！生成 124 份工人评价，2 份校验异常记录已推至警告库。', 'success')
      } else {
        setRunProgress(progress)
        const completed = Math.floor((progress / 100) * 126)
        setRunSuccess(completed)
        if (progress > 50) setRunFailed(2)
        setRunStepText(`读取数据血缘... 已清洗评估 ${completed}/126 人。`)
      }
    }, 400)
  }

  // Trigger Worker scoring simulation
  const handleRunSimulator = () => {
    setSimulating(true)
    setSimResult(null)
    triggerNotification('AI计算大脑加载特征值分析中...', 'info')

    setTimeout(() => {
      const match = MOCK_WORKERS.find(w => w.id === simWorkerId)
      if (match) {
        setSimResult(match)
        triggerNotification(`工人「${match.name}」综合评分模拟计算完成：${match.score} 分`, 'success')
      }
      setSimulating(false)
    }, 600)
  }

  // Save new model form
  const handleSaveModel = (e) => {
    e.preventDefault()
    if (editingModel) {
      setModels(prev => prev.map(m => m.id === editingModel.id ? { ...modelForm } : m))
      triggerNotification('模型配置更新成功。', 'success')
    } else {
      const newM = {
        ...modelForm,
        id: `MOD-00${models.length + 1}`
      }
      setModels(prev => [newM, ...prev])
      triggerNotification('新增评价模型成功！已进入版本控制流水线。', 'success')
    }
    setIsAddModelOpen(false)
  }

  // Auto-balance weights
  const handleAutoBalance = () => {
    setSliders({
      professional: 30,
      fulfillment: 25,
      safety: 20,
      health: 10,
      credit: 15
    })
    triggerNotification('滑块已自动重置并平衡为国企通用标准配比。', 'info')
  }

  return (
    <div className="flex-grow flex flex-col gap-6">
      
      {/* 1. Page Header */}
      <div className="bg-white border border-border-gray rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
            <Sliders className="h-5.5 w-5.5 text-primary animate-pulse" />
            评价模型与执行中心
            <span className="text-xs font-normal text-warning-orange bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              央企模型调度中心
            </span>
          </h2>
          <p className="text-xs text-text-secondary mt-1.5">
            配置评价权重滑块，审核评价等级评定界限规则，并针对在场劳务项目手动或定时启动大批量数据评价结算引擎。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerNotification('最新定时运行正常，下一次：明日 00:00:00', 'success')}
            className="px-3 py-1.5 bg-slate-100 border rounded font-bold text-xs text-text-dark flex items-center gap-1 cursor-pointer"
          >
            <Clock className="h-3.5 w-3.5 text-primary" />
            下次自动评价调度：定时每天 00:00
          </button>
        </div>
      </div>

      {/* 2. Top Stats Row (5 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 shrink-0">
        {[
          { title: '模型总数量', val: `${models.length} 套`, desc: '启用 2 套 / 停用 1 套', time: '自动更新', icon: <Layers className="h-5 w-5 text-primary" /> },
          { title: '当前激活版本', val: 'v2.4.0', desc: '2026-07-09 更新', time: '发版归档', icon: <History className="h-5 w-5 text-indigo-500" /> },
          { title: '累计计算次数', val: '470 次', desc: '覆盖 12,500 人次', time: '昨日结算完毕', icon: <Activity className="h-5 w-5 text-[#52C41A]" /> },
          { title: '今日评价次数', val: '1 次', desc: '自动凌晨同步跑分', time: '今日 00:00', icon: <CheckCircle2 className="h-5 w-5 text-success-green" /> },
          { title: 'A级工人在册数', val: '248 人', desc: '占在场总工人数 19%', time: '良好率极高', icon: <Award className="h-5 w-5 text-orange-500" /> }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-border-gray p-4 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-all border-l-4 border-l-primary">
            <div className="flex items-start justify-between">
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{kpi.title}</div>
              <div className="bg-slate-50 p-1.5 rounded">{kpi.icon}</div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-black text-text-dark font-mono leading-none">{kpi.val}</div>
              <div className="flex items-center justify-between text-[10px] text-text-secondary mt-2">
                <span className="font-semibold text-primary">{kpi.desc}</span>
                <span>{kpi.time.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Primary Tabs Navigation */}
      <div className="bg-white border border-border-gray rounded shadow-sm flex flex-col min-h-[500px] flex-grow">
        
        {/* Navigation tabs */}
        <div className="flex border-b border-border-gray bg-slate-50 px-4 pt-3 shrink-0">
          {[
            { id: 'models', label: '模型配置台账', icon: <Layers className="h-4 w-4" /> },
            { id: 'versions', label: '模型版本历史', icon: <History className="h-4 w-4" /> },
            { id: 'weight', label: '维度权重滑块', icon: <SlidersHorizontal className="h-4 w-4" /> },
            { id: 'levels', label: '等级规则配置', icon: <Award className="h-4 w-4" /> },
            { id: 'exec', label: '模型执行与模拟', icon: <Play className="h-4 w-4" /> },
            { id: 'logs', label: '执行日志记录', icon: <FileText className="h-4 w-4" /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-t-2 border-x transition-all duration-150 cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white border-x-border-gray border-t-primary text-primary -mb-[1px] relative z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]'
                  : 'bg-transparent border-transparent text-text-secondary hover:text-primary hover:bg-slate-100'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Panels */}
        <div className="p-6 flex-grow flex flex-col min-h-[380px]">
          
          {/* ==========================================
              TAB 1: 模型配置 (Table list)
              ========================================== */}
          {activeTab === 'models' && (
            <div className="flex-grow flex flex-col gap-6">
              
              {/* Search bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 border border-border-gray rounded shrink-0">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="搜索模型名称/编码..."
                      className="bg-white border border-slate-300 rounded px-2.5 pl-8 py-1 text-xs text-text-dark w-48"
                    />
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div>
                    <select
                      value={filterProject}
                      onChange={(e) => setFilterProject(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-text-dark"
                    >
                      <option value="ALL">全部适用范围</option>
                      <option value="集团全项目">集团全项目</option>
                      <option value="高处作业/特种班组">高处作业/特种班组</option>
                      <option value="各工种班组长">各工种班组长</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => triggerNotification('正在检索评价模型...', 'info')} className="px-3.5 py-1.5 bg-[#11356A] hover:bg-primary-hover text-white text-xs font-bold rounded shadow-sm cursor-pointer">查询</button>
                  <button onClick={() => { setSearchKeyword(''); setFilterProject('ALL') }} className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-text-dark border border-slate-300 text-xs font-bold rounded shadow-sm cursor-pointer">重置</button>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-border-gray p-4 rounded shrink-0">
                <div className="text-xs text-text-secondary font-bold flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-primary animate-pulse" />
                  <span>当前可用评级模型共有 {models.length} 套</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setModelForm({
                        id: '',
                        name: '智能基建盾构工种专项评价模型',
                        code: 'MODEL_SHIELD',
                        scope: '盾构施工特种班组',
                        version: 'v1.0.0',
                        status: true,
                        creator: '张经理',
                        remarks: '重度偏向考核盾构安全及专业持证率'
                      })
                      setEditingModel(null)
                      setIsAddModelOpen(true)
                    }}
                    className="px-3 py-1.5 bg-[#52C41A] hover:bg-emerald-600 text-white rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    新增模型
                  </button>
                  <button
                    onClick={() => triggerNotification('正在导出模型清单Excel...', 'success')}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-text-dark rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1 hover:bg-slate-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    导出Excel
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                <table className="b-table text-xs">
                  <thead>
                    <tr>
                      <th>模型编码</th>
                      <th>模型名称</th>
                      <th>适用评价范围</th>
                      <th>当前激活版本</th>
                      <th>启用状态</th>
                      <th>主创建人</th>
                      <th>初建时间</th>
                      <th>最后更新</th>
                      <th>备注</th>
                      <th className="text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="font-mono font-bold text-[#11356A]">{item.code}</td>
                        <td className="font-bold text-text-dark">{item.name}</td>
                        <td>
                          <span className="bg-slate-100 text-text-dark border px-2 py-0.5 rounded text-[10px] font-bold">
                            {item.scope}
                          </span>
                        </td>
                        <td className="font-mono text-primary font-bold">{item.version}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.status}
                            onChange={() => {
                              setModels(prev => prev.map(m => m.id === item.id ? { ...m, status: !m.status } : m))
                              triggerNotification(`模型激活状态已更改。`, 'info')
                            }}
                            className="h-3.5 w-3.5 cursor-pointer"
                          />
                        </td>
                        <td>{item.creator}</td>
                        <td className="font-mono text-text-secondary">{item.created}</td>
                        <td className="font-mono text-text-secondary">{item.updated}</td>
                        <td className="max-w-[120px] truncate text-text-secondary" title={item.remarks}>{item.remarks || '-'}</td>
                        <td className="text-right font-bold">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedDetails(item)
                                setIsDetailDrawerOpen(true)
                              }}
                              className="text-text-secondary hover:text-text-dark font-bold text-xs bg-slate-50 border px-2 py-1 rounded cursor-pointer"
                            >
                              查看
                            </button>
                            <button
                              onClick={() => {
                                setEditingModel(item)
                                setModelForm({ ...item })
                                setIsAddModelOpen(true)
                              }}
                              className="text-primary hover:text-primary-hover font-bold text-xs bg-primary/5 border border-primary/20 px-2 py-1 rounded cursor-pointer"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => {
                                const copied = {
                                  ...item,
                                  id: `MOD-00${models.length + 1}`,
                                  code: `${item.code}_COPY`,
                                  name: `${item.name}_复制版`
                                }
                                setModels(prev => [...prev, copied])
                                triggerNotification(`模型「${item.name}」已成功复制。`, 'success')
                              }}
                              className="text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 border border-indigo-200 px-2 py-1 rounded cursor-pointer"
                            >
                              复制
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`确认删除评价模型 [${item.code}]？`)) {
                                  setModels(prev => prev.filter(m => m.id !== item.id))
                                  triggerNotification('模型已物理清除。', 'warning')
                                }
                              }}
                              className="text-danger-red hover:text-red-700 font-bold text-xs bg-red-50 border border-red-200 px-2 py-1 rounded cursor-pointer"
                            >
                              删除
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

          {/* ==========================================
              TAB 2: 模型版本 (Timelines + Comparison)
              ========================================== */}
          {activeTab === 'versions' && (
            <div className="flex-grow flex flex-col gap-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
                
                {/* Left: Versions list */}
                <div className="lg:col-span-7 bg-white border border-border-gray rounded-lg p-5 flex flex-col gap-4 shadow-sm">
                  <div className="text-xs font-bold text-text-dark border-b pb-2">模型版本迭代日志</div>
                  
                  <div className="space-y-4">
                    {versions.map((v, idx) => (
                      <div key={idx} className="flex gap-4 relative">
                        {/* Timeline dot/line */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${v.status === '当前激活' ? 'bg-[#52C41A] border-emerald-500' : 'bg-slate-200 border-slate-300'}`}>
                            {v.status === '当前激活' && <Check className="h-2 w-2 text-white" />}
                          </div>
                          {idx !== versions.length - 1 && <div className="w-[2px] bg-slate-200 flex-grow mt-1.5"></div>}
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex-grow text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[#11356A] text-sm">{v.version}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              v.status === '当前激活' ? 'bg-emerald-50 text-success-green border border-emerald-250' : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {v.status}
                            </span>
                          </div>
                          <p className="text-text-secondary leading-relaxed">{v.desc}</p>
                          <div className="flex items-center justify-between text-[10px] text-text-secondary border-t pt-2 mt-2">
                            <div>发布日期：<span className="font-mono">{v.date}</span> | 创建人：{v.creator}</div>
                            <div>历史累计执行：<span className="font-mono font-bold text-primary">{v.runs} 次</span></div>
                          </div>
                          
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => triggerNotification(`正在预览 ${v.version} 指标权重因子...`, 'info')}
                              className="text-text-secondary hover:text-text-dark font-bold text-xs bg-white border border-slate-300 px-2 py-1 rounded cursor-pointer"
                            >
                              预览
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`确认回滚至历史版本「${v.version}」吗？`)) {
                                  triggerNotification(`平台评级公式已成功整体回滚至 ${v.version} 版本！`, 'success')
                                }
                              }}
                              disabled={v.status === '当前激活'}
                              className={`font-bold text-xs border px-2 py-1 rounded ${
                                v.status === '当前激活'
                                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                                  : 'text-primary hover:text-primary-hover bg-primary/5 border-primary/20 cursor-pointer'
                              }`}
                            >
                              回滚至此版本
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Version comparison workbench */}
                <div className="lg:col-span-5 bg-indigo-50/30 border border-indigo-100 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
                  <div className="text-xs font-bold text-[#11356A] flex items-center gap-1 shrink-0 border-b pb-2">
                    <Sliders className="h-4.5 w-4.5 text-indigo-600" />
                    <span>模型版本结构化比对</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-text-secondary mb-1">比对版本 A</label>
                      <select value={compareVerA} onChange={(e) => setCompareVerA(e.target.value)} className="w-full bg-white border rounded px-2 py-1">
                        <option value="v2.4.0">v2.4.0 (当前激活)</option>
                        <option value="v2.3.8">v2.3.8 (历史版本)</option>
                        <option value="v2.1.0">v2.1.0 (初始版本)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-text-secondary mb-1">比对版本 B</label>
                      <select value={compareVerB} onChange={(e) => setCompareVerB(e.target.value)} className="w-full bg-white border rounded px-2 py-1">
                        <option value="v2.3.8">v2.3.8 (历史版本)</option>
                        <option value="v2.4.0">v2.4.0 (当前激活)</option>
                        <option value="v2.1.0">v2.1.0 (初始版本)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCompareOpen(true)
                      triggerNotification(`成功生成版本对比报告。`, 'success')
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow cursor-pointer"
                  >
                    生成结构化比对报告
                  </button>

                  <div className="bg-white border rounded p-4 text-xs space-y-3 flex-grow max-h-[220px] overflow-y-auto">
                    <div className="font-bold text-text-dark">版本演化差异推演：</div>
                    <div className="space-y-2 text-[11px] text-text-secondary">
                      <div className="flex items-start gap-1">
                        <span className="text-[#52C41A] font-bold">▲</span>
                        <span><strong>安全质量权重：</strong> 从 15% 提高至 20%</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-danger-red font-bold">▼</span>
                        <span><strong>身体健康权重：</strong> 从 15% 调减至 10%</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-primary font-bold">●</span>
                        <span><strong>特种持证规则：</strong> 新增「真伪比对」二级卡校验扣分</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              TAB 3: 维度权重 (Sliders + Dynamic Chart)
              ========================================== */}
          {activeTab === 'weight' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
              
              {/* Sliders panel */}
              <div className="lg:col-span-7 bg-white border border-border-gray rounded-lg p-5 flex flex-col gap-6 shadow-sm">
                <div className="flex items-center justify-between border-b pb-3 shrink-0">
                  <div className="text-xs font-bold text-text-dark">权重滑块配比设定 (Total: 100%)</div>
                  <button
                    onClick={handleAutoBalance}
                    className="px-3 py-1 bg-white border border-slate-300 text-text-dark text-xs font-bold rounded shadow-sm hover:bg-slate-50 cursor-pointer"
                  >
                    重置为平衡权重
                  </button>
                </div>

                <div className="space-y-5">
                  {[
                    { key: 'professional', label: '👨‍✈️ 职业能力', desc: '评估工人专业岗位技能、特种持证、实操竞赛荣誉等' },
                    { key: 'fulfillment', label: '⏰ 履约能力', desc: '考核打卡考勤率、项目进出场注销、工时合同备案等' },
                    { key: 'safety', label: '⚠️ 安全能力', desc: '考核违章通报扣分、安全教育合格率、班前晨会出席等' },
                    { key: 'health', label: '🩺 健康能力', desc: '体检合格、高空作业禁忌症筛查、年龄健康诊断等' },
                    { key: 'credit', label: '🏅 信用能力', desc: '第三方信用评级对接、失信核查、工会守信档案等' }
                  ].map(item => (
                    <div key={item.key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-text-dark">{item.label}</span>
                        <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">
                          {sliders[item.key]} %
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sliders[item.key]}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setSliders({ ...sliders, [item.key]: val })
                          }}
                          className="flex-grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      <p className="text-[10px] text-text-secondary">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Validation alert box */}
                <div className={`p-4 rounded-lg text-xs flex items-center justify-between shrink-0 border ${
                  totalSliderSum === 100
                    ? 'bg-emerald-50 border-emerald-250 text-success-green'
                    : 'bg-red-50 border-red-250 text-danger-red animate-pulse'
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    <span>
                      当前已分配总权重：<strong className="font-mono font-black text-sm">{totalSliderSum}%</strong>
                      {totalSliderSum === 100 ? '（分配恰当，模型可以保存运行）' : '（注意：总权重必须精确等于 100% 才能保存发布模型）'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (totalSliderSum === 100) {
                        triggerNotification('维度权重公式调整并发布成功！', 'success')
                      } else {
                        triggerNotification('权重不匹配 100%，发布已被系统拦截阻断！', 'error')
                      }
                    }}
                    disabled={totalSliderSum !== 100}
                    className={`px-4 py-1.5 font-bold text-xs rounded shadow-sm transition-colors cursor-pointer ${
                      totalSliderSum === 100
                        ? 'bg-[#11356A] hover:bg-primary-hover text-white'
                        : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                    }`}
                  >
                    保存权重公式
                  </button>
                </div>
              </div>

              {/* Pie/Donut Chart panel */}
              <div className="lg:col-span-5 bg-slate-50 border border-border-gray rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-sm min-h-[300px]">
                <div className="text-xs font-bold text-text-dark mb-6">实时模型权重占比分布图</div>
                
                {/* SVG Circular Donut Chart */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="12" />
                    
                    {/* Dynamic slices using calculated stroke-dasharrays */}
                    {(() => {
                      let accumulatedPercent = 0
                      const colors = ['#11356A', '#1890FF', '#52C41A', '#FA8C16', '#F5222D']
                      const strokeDashArrays = [
                        (sliders.professional / 100) * 251.2,
                        (sliders.fulfillment / 100) * 251.2,
                        (sliders.safety / 100) * 251.2,
                        (sliders.health / 100) * 251.2,
                        (sliders.credit / 100) * 251.2
                      ]

                      return strokeDashArrays.map((dash, i) => {
                        const offset = 251.2 - (accumulatedPercent / 100) * 251.2
                        accumulatedPercent += Object.values(sliders)[i]
                        return (
                          <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke={colors[i]}
                            strokeWidth="12"
                            strokeDasharray={`${dash} 251.2`}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                        )
                      })
                    })()}
                  </svg>

                  {/* Core Value overlay */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-[10px] text-text-secondary font-bold">总配比</span>
                    <span className={`text-xl font-black font-mono leading-none ${totalSliderSum === 100 ? 'text-[#11356A]' : 'text-danger-red'}`}>
                      {totalSliderSum}%
                    </span>
                  </div>
                </div>

                {/* Legends */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] mt-6 w-full text-left">
                  <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 bg-[#11356A] rounded-sm"></div><span>职业能力 ({sliders.professional}%)</span></div>
                  <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 bg-[#1890FF] rounded-sm"></div><span>履约能力 ({sliders.fulfillment}%)</span></div>
                  <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 bg-[#52C41A] rounded-sm"></div><span>安全能力 ({sliders.safety}%)</span></div>
                  <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 bg-[#FA8C16] rounded-sm"></div><span>健康能力 ({sliders.health}%)</span></div>
                  <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 bg-[#F5222D] rounded-sm"></div><span>信用能力 ({sliders.credit}%)</span></div>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 4: 等级规则配置 (Grade Card layout)
              ========================================== */}
          {activeTab === 'levels' && (
            <div className="flex-grow flex flex-col gap-6">
              
              <div className="flex items-center justify-between border-b pb-3 shrink-0">
                <div className="text-xs text-text-secondary font-bold">
                  等级划分由模型后台决定，修改各评价分值段的最小、最大门槛即可实时调整工人分布结构。
                </div>
                <button
                  onClick={() => {
                    setLevelForm({
                      id: `l_${Date.now()}`,
                      name: 'F级',
                      label: '警退考核人员',
                      min: 0,
                      max: 49,
                      color: '#BFBFBF',
                      desc: '屡教不改安全违章，列入退出或黑名单警示。'
                    })
                    setIsAddLevelOpen(true)
                  }}
                  className="px-3.5 py-1.5 bg-[#52C41A] hover:bg-emerald-600 text-white rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  新增等级
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow">
                {levels.map(l => (
                  <div key={l.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative">
                    <div className="absolute top-0 left-0 h-full w-1.5 rounded-l-lg" style={{ backgroundColor: l.color }}></div>
                    <div className="pl-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-text-dark font-mono" style={{ color: l.color }}>{l.name}</span>
                        <span className="text-[10px] text-text-secondary font-bold bg-white px-2 py-0.5 border rounded">
                          {l.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed mb-4">{l.desc}</p>
                    </div>

                    <div className="border-t pt-3 pl-2 mt-4 space-y-2 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-text-secondary">评价分数区间:</span>
                        <span className="font-bold text-text-dark">[{l.min} - {l.max}] 分</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-text-secondary">视觉配色:</span>
                        <div className="h-3.5 w-8 rounded border shadow-sm" style={{ backgroundColor: l.color }}></div>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 pt-2">
                        <button
                          onClick={() => {
                            setLevelForm({ ...l })
                            setIsAddLevelOpen(true)
                          }}
                          className="px-2 py-1 bg-white hover:bg-slate-100 border text-[10px] font-bold rounded cursor-pointer"
                        >
                          修改
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 5: 模型执行与模拟 (Immediate + Timed + Simulator)
              ========================================== */}
          {activeTab === 'exec' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
              
              {/* Left Column: Immediate Execution Console */}
              <div className="lg:col-span-6 bg-white border border-border-gray rounded-lg p-5 flex flex-col gap-6 shadow-sm">
                
                <div className="flex items-center justify-between border-b pb-3 shrink-0">
                  <div className="text-xs font-bold text-text-dark flex items-center gap-1">
                    <Activity className="h-4.5 w-4.5 text-primary" />
                    <span>模型计算引擎控制台</span>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded border self-start">
                    {[
                      { id: 'immediate', label: '立即执行' },
                      { id: 'scheduled', label: '定时配置' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setExecType(btn.id)}
                        className={`px-3 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                          execType === btn.id ? 'bg-[#11356A] text-white shadow-sm' : 'text-text-secondary'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {execType === 'immediate' && (
                  <div className="space-y-4 text-xs">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-text-secondary mb-1">选择执行项目</label>
                        <select value={execProject} onChange={(e) => setExecProject(e.target.value)} className="w-full bg-white border rounded px-2.5 py-1.5 text-text-dark">
                          <option value="北京CBD东区超高层项目">北京CBD东区超高层项目</option>
                          <option value="北京轨道交通28号线项目">北京轨道交通28号线项目</option>
                          <option value="城市绿心剧院机电安装项目">城市绿心剧院机电安装项目</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-text-secondary mb-1">评价覆盖范围</label>
                        <select value={execScopeSelect} onChange={(e) => setExecScopeSelect(e.target.value)} className="w-full bg-white border rounded px-2.5 py-1.5 text-text-dark">
                          <option value="全员">当前项目全员 (在场 + 历史)</option>
                          <option value="塔吊特种班组">塔吊特种班组</option>
                          <option value="电工挂载班组">电工挂载班组</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-text-secondary mb-1">本次评价备份版本号</label>
                      <input type="text" disabled value="v2.4.0 (当前激活模式)" className="w-full bg-slate-50 border rounded px-2.5 py-1.5 text-text-secondary font-mono" />
                    </div>

                    <button
                      type="button"
                      onClick={handleStartImmediateRun}
                      disabled={isRunning}
                      className={`w-full py-2.5 text-white font-bold rounded shadow transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        isRunning ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-[#1b3d6f]'
                      }`}
                    >
                      <Play className="h-4 w-4 fill-current animate-pulse" />
                      立即启动评价引擎
                    </button>

                    {isRunning && (
                      <div className="bg-slate-50 border p-4 rounded-lg space-y-3 animate-zoom-in">
                        <div className="flex justify-between items-center text-[10px] text-text-secondary">
                          <span className="font-bold text-primary animate-pulse">{runStepText}</span>
                          <span className="font-mono font-bold">{runProgress}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-[#52C41A] h-full transition-all duration-200" style={{ width: `${runProgress}%` }}></div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-text-secondary pt-2">
                          <div>
                            <span className="block font-bold font-mono text-text-dark">{runTotal} 人</span>
                            <span>覆盖总数</span>
                          </div>
                          <div>
                            <span className="block font-bold font-mono text-success-green">{runSuccess} 人</span>
                            <span>已完成评估</span>
                          </div>
                          <div>
                            <span className="block font-bold font-mono text-danger-red">{runFailed} 人</span>
                            <span>校验失败</span>
                          </div>
                          <div>
                            <span className="block font-bold font-mono text-primary">{runTotal - runSuccess - runFailed} 人</span>
                            <span>等待评估</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {execType === 'scheduled' && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-primary">
                      <div className="font-bold flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        定时自动调度引擎
                      </div>
                      <p className="text-[11px] leading-relaxed mt-1">
                        系统集成 Crontab 定时执行规则，每天夜间自动加载全国建筑工人实名制接口及当日同步数据，自动清洗并重计算工人画像雷达值。
                      </p>
                    </div>

                    <table className="w-full text-left text-xs bg-slate-50 border">
                      <thead>
                        <tr className="bg-slate-100 border-b">
                          <th className="p-2">定时任务名称</th>
                          <th className="p-2">周期频率</th>
                          <th className="p-2">Cron 时间</th>
                          <th className="p-2">定时开关</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: '全项目综合评价', period: '每天', cron: '00:00:00', status: true },
                          { name: '高危特种防范清洗', period: '每周日', cron: '23:00:00', status: true },
                          { name: '季度新星班组核查', period: '每月1号', cron: '01:00:00', status: false }
                        ].map((t, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="p-2 font-bold text-text-dark">{t.name}</td>
                            <td className="p-2">{t.period}</td>
                            <td className="p-2 font-mono text-text-secondary">{t.cron}</td>
                            <td className="p-2">
                              <input
                                type="checkbox"
                                defaultChecked={t.status}
                                onChange={() => triggerNotification('定时调度器状态修改已同步至集团服务器。', 'warning')}
                                className="h-3.5 w-3.5 cursor-pointer"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

              {/* Right Column: Dynamic Simulation Workstation (AI features) */}
              <div className="lg:col-span-6 bg-indigo-50/20 border border-indigo-100 rounded-lg p-5 flex flex-col gap-5 shadow-sm">
                
                <div className="flex items-center justify-between border-b pb-3 shrink-0">
                  <div className="text-xs font-bold text-[#11356A] flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                    <span>工人综合评价 AI 仿真沙盒</span>
                  </div>
                  <div>
                    <select
                      value={simWorkerId}
                      onChange={(e) => setSimWorkerId(e.target.value)}
                      className="bg-white border rounded px-2.5 py-1 text-xs text-text-dark"
                    >
                      <option value="w1">张建国 (特种塔吊工)</option>
                      <option value="w2">李强 (架子工)</option>
                      <option value="w3">王朝阳 (电焊工)</option>
                      <option value="w4">刘小虎 (普工)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunSimulator}
                  disabled={simulating}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow cursor-pointer transition-colors"
                >
                  {simulating ? 'AI 大脑评分测演中...' : '开始仿真测演模拟'}
                </button>

                {simResult && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs flex-grow overflow-y-auto animate-zoom-in">
                    
                    {/* Visual Radar, Overall Score & Grade Badge */}
                    <div className="bg-white border rounded-lg p-4 flex flex-col items-center justify-between shadow-sm">
                      <span className="font-bold text-[10px] text-text-secondary uppercase">综合评价评估算分</span>
                      
                      <div className="relative w-32 h-32 flex items-center justify-center mt-2">
                        {/* Circular progress bar */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="transparent" stroke="#E2E8F0" strokeWidth="8" />
                          <circle cx="50" cy="50" r="42" fill="transparent" stroke="#52C41A" strokeWidth="8" strokeDasharray="263.8" strokeDashoffset={263.8 - (simResult.score / 100) * 263.8} strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-black font-mono text-text-dark leading-none">{simResult.score}</span>
                          <span className="text-[9px] text-[#52C41A] font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-1">
                            {simResult.level}
                          </span>
                        </div>
                      </div>

                      {/* Explicit numerical labels below */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9.5px] mt-4 w-full text-left">
                        <div>职业能力: <span className="font-bold text-primary font-mono">{simResult.details.capability}</span></div>
                        <div>履约能力: <span className="font-bold text-primary font-mono">{simResult.details.attendance}</span></div>
                        <div>安全行为: <span className="font-bold text-primary font-mono">{simResult.details.safety}</span></div>
                        <div>身心健康: <span className="font-bold text-primary font-mono">{simResult.details.health}</span></div>
                      </div>
                    </div>

                    {/* AI Explanation & Recommendations Box */}
                    <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-lg flex flex-col justify-between shadow-sm">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#11356A]">
                        <Cpu className="h-4 w-4 text-indigo-500 animate-spin" />
                        <span>AI大模型评价报告推演</span>
                      </div>
                      
                      <p className="text-[10px] text-indigo-900 leading-relaxed mt-2 flex-grow">
                        工人属于<strong>【{simResult.level}】级别</strong>。主要得分子系统源于：
                        连续考勤出满（{simResult.details.attendance}分），且特种塔吊操作证AI-OCR真伪核验已通过。安全违章处罚次数为0。
                      </p>

                      <div className="border-t border-indigo-150 pt-2 mt-2 space-y-1.5 text-[9.5px]">
                        <div>💡 <strong>AI 培养建议：</strong> 特种特优人才，建议作为项目班组长梯队考察培养。</div>
                        <div>⚠️ <strong>AI 风险提醒：</strong> 目前健康体检临期，建议本周督促补登体检。</div>
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* ==========================================
              TAB 6: 执行记录 (History list)
              ========================================== */}
          {activeTab === 'logs' && (
            <div className="flex-grow flex flex-col gap-6">
              
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                <table className="b-table text-xs">
                  <thead>
                    <tr>
                      <th>运行编号</th>
                      <th>开始执行时间</th>
                      <th>启动发件人</th>
                      <th>覆盖评价项目</th>
                      <th>实名覆盖总数</th>
                      <th>评价成功数</th>
                      <th>校验失败数</th>
                      <th>运行同步方式</th>
                      <th>运算耗时</th>
                      <th>状态</th>
                      <th className="text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {execLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="font-mono font-bold text-[#11356A]">{log.id}</td>
                        <td className="font-mono text-text-secondary">{log.time}</td>
                        <td className="font-bold text-text-dark">{log.creator}</td>
                        <td>{log.project}</td>
                        <td className="font-mono font-semibold text-text-dark">{log.total} 人</td>
                        <td className="font-mono font-bold text-success-green">{log.success} 人</td>
                        <td className="font-mono font-bold text-danger-red">{log.failed} 人</td>
                        <td>
                          <span className="bg-slate-100 text-slate-700 border px-1.5 py-0.2 rounded text-[10px]">
                            {log.type}
                          </span>
                        </td>
                        <td className="font-mono text-text-secondary">{log.duration}</td>
                        <td>
                          <span className="bg-emerald-50 text-success-green border border-emerald-250 px-2 py-0.5 rounded font-black text-[10px]">
                            {log.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => {
                              setSelectedLog(log)
                              setIsLogDrawerOpen(true)
                            }}
                            className="text-primary hover:text-primary-hover font-bold text-xs bg-primary/5 border border-primary/20 px-2 py-1 rounded cursor-pointer"
                          >
                            查看运行日志
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
      </div>

      {/* ======================================================================
          DRAWER 1: ADD/EDIT MODEL (新增/修改模型配置右侧抽屉)
          ====================================================================== */}
      {isAddModelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsAddModelOpen(false)}></div>

          {/* Form Panel */}
          <form
            onSubmit={handleSaveModel}
            className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in"
          >
            {/* Header */}
            <div className="p-5 border-b bg-slate-50 border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-text-dark flex items-center gap-1.5">
                <Sliders className="h-4.5 w-4.5 text-primary animate-pulse" />
                <span>{editingModel ? '编辑评价模型配置' : '新增评价模型'}</span>
              </h3>
              <button type="button" onClick={() => setIsAddModelOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable inputs */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-text-secondary mb-1">模型唯一编码</label>
                  <input
                    type="text"
                    required
                    value={modelForm.code}
                    onChange={(e) => setModelForm({ ...modelForm, code: e.target.value })}
                    placeholder="如: MODEL_HIGH_SAFE"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-secondary mb-1">适用评价项目</label>
                  <select
                    value={modelForm.scope}
                    onChange={(e) => setModelForm({ ...modelForm, scope: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                  >
                    <option value="集团全项目">集团全项目</option>
                    <option value="高处作业/特种班组">高处作业/特种班组</option>
                    <option value="各工种班组长">各工种班组长</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-secondary mb-1">模型名称</label>
                <input
                  type="text"
                  required
                  value={modelForm.name}
                  onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                  placeholder="请输入评价模型名称"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                />
              </div>

              <div>
                <label className="block font-bold text-text-secondary mb-1">是否立即启用</label>
                <input
                  type="checkbox"
                  checked={modelForm.status}
                  onChange={(e) => setModelForm({ ...modelForm, status: e.target.checked })}
                  className="h-4 w-4 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-text-secondary mb-1">模型说明</label>
                <textarea
                  required
                  rows="3"
                  value={modelForm.remarks}
                  onChange={(e) => setModelForm({ ...modelForm, remarks: e.target.value })}
                  placeholder="该评价模型的主要考核方向和应用背景描述..."
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                ></textarea>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddModelOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-text-dark font-bold rounded shadow-sm cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-[#1b3d6f] text-white font-bold rounded shadow cursor-pointer transition-colors"
              >
                保存模型
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================================
          DRAWER 2: MODEL DETAIL VIEW (查看模型详情右侧抽屉)
          ====================================================================== */}
      {isDetailDrawerOpen && selectedDetails && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsDetailDrawerOpen(false)}></div>

          {/* Details Panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="p-5 border-b bg-slate-50 border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-text-dark flex items-center gap-1.5">
                <Info className="h-4.5 w-4.5 text-primary" />
                <span>评价模型元数据详情</span>
              </h3>
              <button onClick={() => setIsDetailDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              
              <div className="bg-slate-50 border rounded-lg p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#11356A] text-sm">{selectedDetails.code}</span>
                  <span className="bg-emerald-50 text-success-green border border-emerald-250 px-2 py-0.5 rounded text-[10px] font-bold">
                    已激活运行
                  </span>
                </div>
                <h4 className="font-bold text-text-dark text-sm leading-tight">{selectedDetails.name}</h4>
                <p className="text-text-secondary leading-relaxed">{selectedDetails.remarks}</p>
              </div>

              {/* Scope details */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-text-dark border-l-4 border-primary pl-2 uppercase tracking-wide">
                  模型运算元数据
                </div>
                <div className="bg-slate-50 border rounded p-4 space-y-3">
                  <div>
                    <span className="text-text-secondary">适用范围：</span>
                    <span className="font-bold text-text-dark">{selectedDetails.scope}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">当前版本：</span>
                    <span className="font-bold text-indigo-700">{selectedDetails.version}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">创建人：</span>
                    <span className="text-text-dark font-medium">{selectedDetails.creator}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">初创上线时间：</span>
                    <span className="font-mono text-text-secondary">{selectedDetails.created}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex items-center justify-end shrink-0">
              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="px-4 py-2 bg-primary hover:bg-[#1b3d6f] text-white text-xs font-bold rounded shadow-sm cursor-pointer"
              >
                确认关闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================
          DRAWER 3: EXECUTION LOGS VIEWER (查看运行日志右侧抽屉)
          ====================================================================== */}
      {isLogDrawerOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsLogDrawerOpen(false)}></div>

          {/* Logs Panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="p-5 border-b bg-slate-50 border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-text-dark flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-primary" />
                <span>运行记录详细审计日志 - {selectedLog.id}</span>
              </h3>
              <button onClick={() => setIsLogDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              
              <div className="bg-slate-900 text-slate-350 p-4 rounded-lg font-mono text-[10px] space-y-2 max-h-[300px] overflow-y-auto">
                <div className="text-success-green font-bold">[ENGINE INFO] 启动评价任务调度 ID: {selectedLog.id}</div>
                <div>[ENGINE INFO] 开始时间: {selectedLog.time}</div>
                <div>[ENGINE INFO] 执行模型: 通用评级模型 v2.4.0</div>
                <div>[ENGINE INFO] 洗涤在场劳务数据库记录数: {selectedLog.total} 行</div>
                <div>[ENGINE INFO] 清洗比对计算正常: {selectedLog.success} 项</div>
                {selectedLog.failed > 0 ? (
                  <>
                    <div className="text-danger-red font-bold">[ENGINE ERROR] 校验失败阻断记录数: {selectedLog.failed} 行</div>
                    <div className="text-danger-red">[ENGINE ERROR] 失败原因 1: 身份证在实名平台未查询到在场备案信息 (张小泉)</div>
                    <div className="text-danger-red">[ENGINE ERROR] 失败原因 2: 特种操作证编号在国资库校验显示已过期 (黄飞鸿)</div>
                  </>
                ) : (
                  <div className="text-success-green font-bold">[ENGINE INFO] 跑分引擎无任何校验警告。</div>
                )}
                <div className="text-[#1890FF]">[ENGINE INFO] 结算耗时: {selectedLog.duration}，状态：正常入库</div>
              </div>

              {selectedLog.failed > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-text-dark border-l-4 border-primary pl-2 uppercase tracking-wide">
                    系统重试与人工清洗对账
                  </div>
                  <button
                    onClick={() => {
                      triggerNotification('重试执行指令已下发，正在补打补登实名制缺失数据...', 'info')
                      setIsLogDrawerOpen(false)
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded shadow-sm text-xs cursor-pointer w-full text-center"
                  >
                    一键启动缺失数据清洗并重计算
                  </button>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex items-center justify-end shrink-0">
              <button
                onClick={() => setIsLogDrawerOpen(false)}
                className="px-4 py-2 bg-primary hover:bg-[#1b3d6f] text-white text-xs font-bold rounded shadow-sm cursor-pointer"
              >
                确认关闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: ADD LEVEL (新增/修改评分级别模态框)
          ====================================================================== */}
      {isAddLevelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsAddLevelOpen(false)}></div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setLevels([...levels, levelForm])
              triggerNotification(`已添加评分等级规则：${levelForm.name}`, 'success')
              setIsAddLevelOpen(false)
            }}
            className="relative bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col z-10 overflow-hidden animate-zoom-in text-xs"
          >
            <div className="p-4 border-b bg-slate-50 border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-dark">新增评分等级界限</h3>
              <button type="button" onClick={() => setIsAddLevelOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-text-secondary mb-1">等级字符</label>
                  <input
                    type="text"
                    required
                    value={levelForm.name}
                    onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })}
                    placeholder="如: F级"
                    className="w-full bg-white border rounded px-3 py-1.5 text-text-dark font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-secondary mb-1">等级文字标志</label>
                  <input
                    type="text"
                    required
                    value={levelForm.label}
                    onChange={(e) => setLevelForm({ ...levelForm, label: e.target.value })}
                    placeholder="如: 警退考核人员"
                    className="w-full bg-white border rounded px-3 py-1.5 text-text-dark"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-text-secondary mb-1">分值区间底限</label>
                  <input
                    type="number"
                    required
                    value={levelForm.min}
                    onChange={(e) => setLevelForm({ ...levelForm, min: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border rounded px-3 py-1.5 text-text-dark font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-secondary mb-1">分值区间上限</label>
                  <input
                    type="number"
                    required
                    value={levelForm.max}
                    onChange={(e) => setLevelForm({ ...levelForm, max: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border rounded px-3 py-1.5 text-text-dark font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-text-secondary mb-1">视觉标志颜色</label>
                <input
                  type="color"
                  value={levelForm.color}
                  onChange={(e) => setLevelForm({ ...levelForm, color: e.target.value })}
                  className="w-full h-8 cursor-pointer rounded border"
                />
              </div>
              <div>
                <label className="block font-bold text-text-secondary mb-1">规则判定条件说明</label>
                <textarea
                  required
                  rows="3"
                  value={levelForm.desc}
                  onChange={(e) => setLevelForm({ ...levelForm, desc: e.target.value })}
                  className="w-full bg-white border rounded px-3 py-2 text-text-dark"
                ></textarea>
              </div>
            </div>
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddLevelOpen(false)} className="px-4 py-2 bg-white border rounded shadow-sm font-bold text-text-dark cursor-pointer">
                取消
              </button>
              <button type="submit" className="px-4 py-2 bg-[#52C41A] text-white rounded shadow font-bold cursor-pointer">
                添加级别
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================================
          MODAL: VERSION COMPARE (版本差异左右多字段比对弹窗)
          ====================================================================== */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsCompareOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col z-10 overflow-hidden animate-zoom-in text-xs">
            <div className="p-4 border-b bg-slate-50 border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-dark flex items-center gap-1">
                <Sliders className="h-4.5 w-4.5 text-primary" />
                <span>评价模型版本对比差异分析 ({compareVerA} vs {compareVerB})</span>
              </h3>
              <button type="button" onClick={() => setIsCompareOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-6 overflow-y-auto max-h-[480px]">
              {/* Version A */}
              <div className="bg-slate-50 border rounded-lg p-5 space-y-4">
                <div className="font-mono font-bold text-primary text-sm border-b pb-2">Version A: {compareVerA}</div>
                <div className="space-y-2">
                  <span className="font-bold text-text-dark block">1. 评价维度滑块占比：</span>
                  <div className="space-y-1 text-[11px] text-text-secondary">
                    <div>职业能力：<strong>30%</strong></div>
                    <div>履约能力：<strong>25%</strong></div>
                    <div>安全行为：<strong>20%</strong></div>
                    <div>健康能力：<strong>10%</strong></div>
                    <div>信用能力：<strong>15%</strong></div>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <span className="font-bold text-text-dark block">2. 警示级别分界：</span>
                  <div className="space-y-1 text-[11px] text-text-secondary">
                    <div>A级: [90-100] | B级: [80-89] | C级: [70-79]</div>
                  </div>
                </div>
              </div>

              {/* Version B */}
              <div className="bg-slate-50 border rounded-lg p-5 space-y-4">
                <div className="font-mono font-bold text-indigo-700 text-sm border-b pb-2">Version B: {compareVerB}</div>
                <div className="space-y-2">
                  <span className="font-bold text-text-dark block">1. 评价维度滑块占比：</span>
                  <div className="space-y-1 text-[11px] text-text-secondary">
                    <div>职业能力：<strong>25%</strong> <span className="text-danger-red">(▼ 5%)</span></div>
                    <div>履约能力：<strong>25%</strong></div>
                    <div>安全行为：<strong>25%</strong> <span className="text-[#52C41A]">(▲ 5%)</span></div>
                    <div>健康能力：<strong>15%</strong> <span className="text-[#52C41A]">(▲ 5%)</span></div>
                    <div>信用能力：<strong>10%</strong> <span className="text-danger-red">(▼ 5%)</span></div>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <span className="font-bold text-text-dark block">2. 警示级别分界：</span>
                  <div className="space-y-1 text-[11px] text-text-secondary">
                    <div>A级: [85-100] | B级: [75-84] | C级: [60-74] <span className="text-indigo-600 font-bold">(降门槛)</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50 border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCompareOpen(false)}
                className="px-5 py-2 bg-primary text-white rounded shadow font-bold cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

```

## File: src/pages/TagCenter.jsx

```javascript
import { useState, useMemo } from 'react'
import {
  Layers,
  Plus,
  Filter,
  Check,
  X,
  Search,
  ArrowDown,
  ArrowRight,
  Info,
  Edit2,
  Trash2,
  Settings,
  HelpCircle,
  AlertCircle,
  Workflow,
  Sparkles,
  Heart,
  ShieldAlert,
  Cpu,
  History,
  Award,
  ArrowLeft,
  Copy,
  FileSpreadsheet,
  Activity,
  Play,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2
} from 'lucide-react'

// Initial Tag Categories Mock Data
const INITIAL_CATEGORIES = [
  { id: 'cat1', name: '职业能力', count: 8, updated: '2026-07-09', status: true, desc: '反映工人专业技能等级、操作资质及竞赛奖励' },
  { id: 'cat2', name: '履约能力', desc: '考核打卡考勤天数、工时合同备案及流动稳定性', count: 6, updated: '2026-07-09', status: true },
  { id: 'cat3', name: '安全能力', desc: '监控现场施工违章行为、安全培训受训状态', count: 5, updated: '2026-07-08', status: true },
  { id: 'cat4', name: '健康能力', desc: '体现职业病防护、体检报告筛查及身体健康状态', count: 3, updated: '2026-07-09', status: true },
  { id: 'cat5', name: '信用能力', desc: '联合征信平台、失信记录核实及红黑榜通报', count: 4, updated: '2026-07-07', status: true },
  { id: 'cat6', name: '系统标签', desc: '由系统后台规则引擎根据行为统计自动生成', count: 5, updated: '2026-07-09', status: true },
  { id: 'cat7', name: '自定义标签', desc: '管理员根据特定项目自主定制的手工维护标签', count: 3, updated: '2026-07-06', status: true }
];

// Initial Tags Mock Data
const INITIAL_TAGS = [
  { id: 'TAG-001', name: '工匠先锋', code: 'TAG_CRAFT_HERO', category: '职业能力', color: '#11356A', textCol: '#FFFFFF', method: '系统', hits: 24, status: true, version: 'v1.2.0', desc: '综合评价分在95分以上极优秀工人' },
  { id: 'TAG-002', name: '金牌架子工', code: 'TAG_GOLD_SCAFF', category: '职业能力', color: '#1890FF', textCol: '#FFFFFF', method: 'AI', hits: 12, status: true, version: 'v1.2.0', desc: '特种脚手架持证验证合格且履约良好' },
  { id: 'TAG-003', name: '优秀履约', code: 'TAG_PERF_EXCELLENT', category: '履约能力', color: '#52C41A', textCol: '#FFFFFF', method: '系统', hits: 184, status: true, version: 'v1.1.8', desc: '单月考勤出勤天数达26天及以上' },
  { id: 'TAG-004', name: '全勤标兵', code: 'TAG_ATTEND_HERO', category: '履约能力', color: '#13C2C2', textCol: '#FFFFFF', method: '系统', hits: 95, status: true, version: 'v1.2.0', desc: '连续出勤大于180天无任何请假' },
  { id: 'TAG-005', name: '违章警示', code: 'TAG_SAFE_WARN', category: '安全能力', color: '#FA8C16', textCol: '#FFFFFF', method: 'AI', hits: 15, status: true, version: 'v1.2.0', desc: '违规次数大于2次或进入红线限制' },
  { id: 'TAG-006', name: '安全可信', code: 'TAG_SAFE_TRUST', category: '安全能力', color: '#2F54EB', textCol: '#FFFFFF', method: 'AI', hits: 320, status: true, version: 'v1.1.2', desc: '入场至今无任何安全违章处罚记录' },
  { id: 'TAG-007', name: '高空禁忌', code: 'TAG_HEALTH_FORBID', category: '健康能力', color: '#F5222D', textCol: '#FFFFFF', method: '系统', hits: 2, status: true, version: 'v1.2.0', desc: '体检含高血压或恐高症等禁忌结论' },
  { id: 'TAG-008', name: '市劳模标兵', code: 'TAG_HONOR_MODEL', category: '自定义标签', color: '#FAAD14', textCol: '#FFFFFF', method: '人工', hits: 3, status: true, version: 'v1.0.5', desc: '获得市建协技能比武名次荣誉者' }
];

// Initial Rules Mock Data
const INITIAL_RULES = [
  {
    id: 'RULE-101',
    name: '优秀履约骨干自动贴签规则',
    matchType: 'AND',
    conditions: [
      { field: '出勤天数', op: '大于', val: '26' },
      { field: '违章次数', op: '等于', val: '0' }
    ],
    outputTag: '优秀履约',
    status: true,
    desc: '贴签条件：考勤达标且无处罚'
  },
  {
    id: 'RULE-102',
    name: '高空风险行为自动强控规则',
    matchType: 'OR',
    conditions: [
      { field: '违章次数', op: '大于', val: '2' },
      { field: '体检结论', op: '等于', val: '高空禁忌项' }
    ],
    outputTag: '违章警示',
    status: true,
    desc: '贴签条件：发生违章或体检不合格'
  }
];

// Mock Workers list for simulation
const MOCK_WORKERS = [
  { id: 'w1', name: '张建国', score: 94, tags: ['优秀履约', '安全可信', '全勤标兵'], photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { id: 'w2', name: '李强', score: 85, tags: ['金牌架子工', '优秀履约'], photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { id: 'w3', name: '王朝阳', score: 72, tags: ['安全可信'], photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'w4', name: '刘小虎', score: 58, tags: ['高空禁忌', '违章警示'], photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
];

// Initial Versions Mock Data
const INITIAL_VERSIONS = [
  { id: 'v1', version: 'v1.2.0', time: '2026-07-09 11:20:15', creator: '张经理', status: '当前激活', desc: '增加了信用能力分类，补充了全勤标兵标签判定公式' },
  { id: 'v2', version: 'v1.1.8', time: '2026-06-15 10:00:00', creator: '李安全', status: '历史版本', desc: '微调高空风险安全扣分界定阈值，调低全勤贴签天数' },
  { id: 'v3', version: 'v1.0.5', time: '2026-05-12 14:30:00', creator: '张经理', status: '历史版本', desc: '初始版本上线，支持三级分类和规则引擎贴签' }
];

export default function TagCenter({ triggerNotification }) {
  const [activeTab, setActiveTab] = useState('categories') // categories, tags, rules, preview, versions

  // Filters
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterCat, setFilterCat] = useState('ALL')
  const [filterMethod, setFilterMethod] = useState('ALL')

  // Lists state
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [tags, setTags] = useState(INITIAL_TAGS)
  const [rules, setRules] = useState(INITIAL_RULES)
  const [versions, setVersions] = useState(INITIAL_VERSIONS)

  // Drawer Form Dialogs
  const [isAddTagOpen, setIsAddTagOpen] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState(null)

  // Form states
  const [tagForm, setTagForm] = useState({
    id: '',
    name: '',
    code: '',
    category: '职业能力',
    color: '#11356A',
    method: '系统',
    desc: '',
    status: true,
    version: 'v1.2.0',
    remarks: ''
  })

  const [isAddCatOpen, setIsAddCatOpen] = useState(false)
  const [catForm, setCatForm] = useState({ id: '', name: '', count: 0, updated: '2026-07-09', status: true, desc: '' })

  // Active Rules editing workstation (Tab 3)
  const [ruleName, setRuleName] = useState('优秀核心骨干自动贴签规则')
  const [ruleMatchType, setRuleMatchType] = useState('AND')
  const [ruleConditions, setRuleConditions] = useState([
    { field: '出勤天数', op: '大于', val: '26' },
    { field: '违章次数', op: '等于', val: '0' }
  ])
  const [ruleOutputTag, setRuleOutputTag] = useState('优秀履约')

  // Simulation parameters (Tab 4)
  const [simWorkerId, setSimWorkerId] = useState('w1')
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState(null)

  // AI Recommendations bubble
  const aiRecommendedTags = [
    { rule: '安全培训次数 >= 5 且 无违规', tag: '安全标兵', color: '#FA8C16', reason: '工人能够连续参与5次安全例会培训并维持零违章，说明其主观安全意识优异，建议配置自动赋签「安全标兵」。' },
    { rule: '综合评分 >= 92 且 实操技能优秀', tag: '工匠模范', color: '#FAAD14', reason: '结合技能大比武奖项数据，系统建议直接关联「工匠模范」以突出高级技工的业务标杆价值。' }
  ]

  // Dynamic Rule semantic preview translation
  const computedRuleTranslation = useMemo(() => {
    const condStr = ruleConditions.map((c, i) => {
      const relation = i === 0 ? '' : ` ${ruleMatchType === 'AND' ? '且' : '或'} `
      return `${relation}当工人的「${c.field}」 ${c.op} 「${c.val}」`
    }).join('')
    return `【规则判定】：系统在夜间调度清洗时，${condStr}，系统将自动为其关联绑定标签「${ruleOutputTag}」，并推送到工人画像卡片。`
  }, [ruleMatchType, ruleConditions, ruleOutputTag])

  // Drill down filter from categories
  const handleEnterCategory = (catName) => {
    setFilterCat(catName)
    setActiveTab('tags')
    triggerNotification(`已为您筛选分类为「${catName}」的标签台账`, 'info')
  }

  // Save new tag form
  const handleSaveTag = (e) => {
    e.preventDefault()
    if (editingTag) {
      setTags(prev => prev.map(t => t.id === editingTag.id ? { ...tagForm } : t))
      triggerNotification('标签元数据更新成功。', 'success')
    } else {
      const newT = {
        ...tagForm,
        id: `TAG-00${tags.length + 1}`
      }
      setTags(prev => [newT, ...prev])
      triggerNotification('新增评价标签入库成功！', 'success')
    }
    setIsAddTagOpen(false)
  }

  // Toggle Category state
  const handleToggleCategory = (id, currentStatus, name) => {
    setCategories(prev => prev.map(c => {
      if (c.id === id) {
        const next = !currentStatus
        triggerNotification(`已${next ? '激活' : '禁用'}标签分类: ${name}`, 'warning')
        return { ...c, status: next }
      }
      return c
    }))
  }

  // Add condition line
  const handleAddConditionRow = () => {
    setRuleConditions([...ruleConditions, { field: '出勤天数', op: '大于', val: '30' }])
  }

  // Simulate worker tagging
  const handleRunSimulator = () => {
    setSimulating(true)
    setSimResult(null)
    triggerNotification('自动标签规则引擎匹配特征中...', 'info')

    setTimeout(() => {
      const match = MOCK_WORKERS.find(w => w.id === simWorkerId)
      if (match) {
        setSimResult(match)
        triggerNotification(`模拟生成工人「${match.name}」画像标签云！`, 'success')
      }
      setSimulating(false)
    }, 600)
  }

  return (
    <div className="flex-grow flex flex-col gap-6">
      
      {/* 1. Page Header */}
      <div className="bg-white border border-border-gray rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
            <Layers className="h-5.5 w-5.5 text-primary animate-pulse" />
            智能标签配置中心
            <span className="text-xs font-normal text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              数据治理规则引擎
            </span>
          </h2>
          <p className="text-xs text-text-secondary mt-1.5">
            设计IF-THEN复合条件关系，配置安全、履约等评价规则引擎，系统每日全自动将清洗洗涤特征匹配标签投射到人员画像。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerNotification('标签全库健康状态良好，共计命中 658 人次。', 'success')}
            className="px-3 py-1.5 bg-slate-100 border rounded font-bold text-xs text-text-dark flex items-center gap-1 cursor-pointer"
          >
            <Workflow className="h-3.5 w-3.5 text-primary" />
            全局贴签规则已就绪
          </button>
        </div>
      </div>

      {/* 2. Top KPI Cards (5 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 shrink-0">
        {[
          { title: '标签总数量', val: `${tags.length} 个`, desc: '7 大类分类标签', time: '自动更新', icon: <Layers className="h-5 w-5 text-primary" /> },
          { title: '自动贴签规则', val: `${rules.length} 条`, desc: '规则自动跑分计算', time: '发版归档', icon: <Workflow className="h-5 w-5 text-indigo-500" /> },
          { title: '人工评定标签', val: '2 个', desc: '供评优表彰手工补登', time: '更新于昨日', icon: <Edit2 className="h-5 w-5 text-[#52C41A]" /> },
          { title: '激活启用标签', val: `${tags.filter(t => t.status).length} 个`, desc: '覆盖率达到 88%', time: '自动状态', icon: <CheckCircle2 className="h-5 w-5 text-success-green" /> },
          { title: '今日新增命中', val: '14 人次', desc: '闸机考勤自动匹配', time: '今日跑跑结果', icon: <Sparkles className="h-5 w-5 text-orange-500" /> }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-border-gray p-4 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-all border-l-4 border-l-primary">
            <div className="flex items-start justify-between">
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{kpi.title}</div>
              <div className="bg-slate-50 p-1.5 rounded">{kpi.icon}</div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-black text-text-dark font-mono leading-none">{kpi.val}</div>
              <div className="flex items-center justify-between text-[10px] text-text-secondary mt-2">
                <span className="font-semibold text-primary">{kpi.desc}</span>
                <span>{kpi.time.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Tab Navigation */}
      <div className="bg-white border border-border-gray rounded shadow-sm flex flex-col min-h-[500px] flex-grow">
        
        {/* Navigation tabs menu */}
        <div className="flex border-b border-border-gray bg-slate-50 px-4 pt-3 shrink-0">
          {[
            { id: 'categories', label: '标签分类管理', icon: <Layers className="h-4 w-4" /> },
            { id: 'tags', label: '标签库台账', icon: <Filter className="h-4 w-4" /> },
            { id: 'rules', label: '规则引擎编辑器', icon: <Workflow className="h-4 w-4" /> },
            { id: 'preview', label: '标签命中与拓扑预览', icon: <Activity className="h-4 w-4" /> },
            { id: 'versions', label: '贴签版本历史', icon: <History className="h-4 w-4" /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4.5 py-3 text-xs font-bold border-t-2 border-x transition-all duration-150 cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white border-x-border-gray border-t-primary text-primary -mb-[1px] relative z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]'
                  : 'bg-transparent border-transparent text-text-secondary hover:text-primary hover:bg-slate-100'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Panels */}
        <div className="p-6 flex-grow flex flex-col min-h-[380px]">
          
          {/* ==========================================
              TAB 1: 标签分类 (Card Grid)
              ========================================== */}
          {activeTab === 'categories' && (
            <div className="flex-grow flex flex-col gap-6">
              
              <div className="flex items-center justify-between border-b pb-3 shrink-0">
                <div className="text-xs text-text-secondary font-bold">
                  系统对标签进行 7 大科学分类归档，支持灵活开关。点击卡片可直接查看分类下具体标签细明。
                </div>
                <button
                  onClick={() => {
                    setCatForm({
                      id: `cat_${Date.now()}`,
                      name: '工会荣誉标志',
                      count: 0,
                      updated: '2026-07-09',
                      status: true,
                      desc: '融合省市级各产业总工会对工人的红色标兵、杰出人物表彰标志。'
                    })
                    setIsAddCatOpen(true)
                  }}
                  className="px-3.5 py-1.5 bg-[#52C41A] hover:bg-emerald-600 text-white rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  新增分类
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-grow">
                {categories.map(c => (
                  <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative">
                    <div className="absolute top-0 right-0 h-1.5 w-full bg-[#11356A]" style={{ opacity: c.status ? 1 : 0.2 }}></div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-text-dark text-sm flex items-center gap-1.5">
                          {c.name}
                          <span className={`inline-block h-2 w-2 rounded-full ${c.status ? 'bg-success-green' : 'bg-slate-400'}`}></span>
                        </h3>
                        <input
                          type="checkbox"
                          checked={c.status}
                          onChange={() => handleToggleCategory(c.id, c.status, c.name)}
                          className="h-3.5 w-3.5 cursor-pointer"
                        />
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed mb-4">{c.desc}</p>
                    </div>

                    <div className="border-t pt-3 mt-4 space-y-2 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-text-secondary">标签数量：</span>
                        <span className="font-bold text-[#11356A]">{c.count} 个</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">最后更新时间：</span>
                        <span className="font-mono text-text-secondary">{c.updated}</span>
                      </div>
                      <div className="flex items-center justify-end pt-2">
                        <button
                          onClick={() => handleEnterCategory(c.name)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-text-dark text-xs font-bold rounded shadow-sm cursor-pointer flex items-center gap-0.5"
                        >
                          进入标签
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 2: 标签库台账 (Table list)
              ========================================== */}
          {activeTab === 'tags' && (
            <div className="flex-grow flex flex-col gap-6">
              
              {/* Search bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 border border-border-gray rounded shrink-0">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="搜索标签名称/编码..."
                      className="bg-white border border-slate-300 rounded px-2.5 pl-8 py-1 text-xs text-text-dark w-48"
                    />
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  </div>

                  <div>
                    <select
                      value={filterCat}
                      onChange={(e) => setFilterCat(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-text-dark"
                    >
                      <option value="ALL">全部标签分类</option>
                      <option value="职业能力">职业能力</option>
                      <option value="履约能力">履约能力</option>
                      <option value="安全能力">安全能力</option>
                      <option value="健康能力">健康能力</option>
                      <option value="信用能力">信用能力</option>
                      <option value="自定义标签">自定义标签</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterMethod}
                      onChange={(e) => setFilterMethod(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-text-dark"
                    >
                      <option value="ALL">全部生成方式</option>
                      <option value="系统">系统生成</option>
                      <option value="AI">AI 识别</option>
                      <option value="人工">人工评定</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => triggerNotification('正在过滤筛选标签库...', 'info')} className="px-3.5 py-1.5 bg-[#11356A] hover:bg-primary-hover text-white text-xs font-bold rounded shadow-sm cursor-pointer">查询</button>
                  <button onClick={() => { setSearchKeyword(''); setFilterCat('ALL'); setFilterMethod('ALL') }} className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-text-dark border border-slate-300 text-xs font-bold rounded shadow-sm cursor-pointer">重置</button>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-border-gray p-4 rounded shrink-0">
                <div className="text-xs text-text-secondary font-bold flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-primary animate-pulse" />
                  <span>当前筛选出 {tags.length} 个评价标签</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTagForm({
                        id: '',
                        name: '优秀泥工标兵',
                        code: 'TAG_MUD_HERO',
                        category: '职业能力',
                        color: '#722ED1',
                        method: '系统',
                        desc: '实操能力分大于90分且项目经理核发好评。',
                        status: true,
                        version: 'v1.2.0',
                        remarks: ''
                      })
                      setEditingTag(null)
                      setIsAddTagOpen(true)
                    }}
                    className="px-3 py-1.5 bg-[#52C41A] hover:bg-emerald-600 text-white rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    新增标签
                  </button>
                  <button
                    onClick={() => triggerNotification('Excel 导出完成！', 'success')}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-text-dark rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1 hover:bg-slate-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    导出Excel
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                <table className="b-table text-xs">
                  <thead>
                    <tr>
                      <th>标签编码</th>
                      <th>标签名称</th>
                      <th>所属大分类</th>
                      <th>生成方式</th>
                      <th>覆盖命中人数</th>
                      <th>启用状态</th>
                      <th>创建版本</th>
                      <th>最后更新</th>
                      <th>备注/说明</th>
                      <th className="text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="font-mono font-bold text-[#11356A]">{item.code}</td>
                        <td>
                          <span
                            className="px-2.5 py-0.8 rounded-full font-bold text-[10.5px] shadow-sm text-white"
                            style={{ backgroundColor: item.color }}
                          >
                            {item.name}
                          </span>
                        </td>
                        <td>
                          <span className="bg-slate-100 text-text-dark border px-2 py-0.5 rounded text-[10px] font-bold">
                            {item.category}
                          </span>
                        </td>
                        <td>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-black border ${
                            item.method === 'AI' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            item.method === '人工' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-50 text-slate-700 border-slate-200'
                          }`}>
                            {item.method}
                          </span>
                        </td>
                        <td className="font-mono font-bold text-primary">{item.hits} 人</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.status}
                            onChange={() => {
                              setTags(prev => prev.map(t => t.id === item.id ? { ...t, status: !t.status } : t))
                              triggerNotification(`标签状态已切换。`, 'info')
                            }}
                            className="h-3.5 w-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="font-mono text-text-secondary">{item.version}</td>
                        <td className="font-mono text-text-secondary">2026-07-09</td>
                        <td className="max-w-[150px] truncate text-text-secondary" title={item.desc}>{item.desc}</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedDetails(item)
                                setIsDetailDrawerOpen(true)
                              }}
                              className="text-text-secondary hover:text-text-dark font-bold text-xs bg-slate-50 border px-2 py-1 rounded cursor-pointer"
                            >
                              查看
                            </button>
                            <button
                              onClick={() => {
                                setEditingTag(item)
                                setTagForm({ ...item })
                                setIsAddTagOpen(true)
                              }}
                              className="text-primary hover:text-primary-hover font-bold text-xs bg-primary/5 border border-primary/20 px-2 py-1 rounded cursor-pointer"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => {
                                const copied = {
                                  ...item,
                                  id: `TAG-00${tags.length + 1}`,
                                  code: `${item.code}_COPY`,
                                  name: `${item.name}_复制`
                                }
                                setTags(prev => [...prev, copied])
                                triggerNotification(`标签「${item.name}」已克隆生成副本。`, 'success')
                              }}
                              className="text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 border border-indigo-200 px-2 py-1 rounded cursor-pointer"
                            >
                              复制
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

          {/* ==========================================
              TAB 3: 规则引擎编辑器 (IF THEN Builder)
              ========================================== */}
          {activeTab === 'rules' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
              
              {/* Left: IF THEN condition editor */}
              <div className="lg:col-span-8 bg-white border border-border-gray rounded-lg p-5 flex flex-col gap-5 shadow-sm">
                
                {/* AI Rec bubbles */}
                <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-lg flex items-start gap-3 text-xs shrink-0">
                  <Cpu className="h-6 w-6 text-indigo-500 animate-bounce shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#11356A] block">AI 标签规则推荐算法助手</span>
                    <p className="text-text-secondary text-[11px] leading-relaxed mt-1">
                      通过对已建档 1,265 名工人的大数据多维挖掘，AI 智能发现如下极优贴签规则公式：
                    </p>
                    <div className="mt-2 space-y-2 border-t pt-2 border-indigo-150">
                      {aiRecommendedTags.map((rec, idx) => (
                        <div key={idx} className="bg-white border p-3 rounded space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-indigo-700 font-bold">IF: {rec.rule}</span>
                            <span className="px-2 py-0.5 rounded font-black text-[10px] text-white" style={{ backgroundColor: rec.color }}>
                              THEN: {rec.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-secondary leading-normal">{rec.reason}</p>
                          <button
                            onClick={() => {
                              setRuleOutputTag(rec.tag)
                              setRuleConditions([
                                { field: '安全培训次数', op: '大于', val: '5' },
                                { field: '违章次数', op: '等于', val: '0' }
                              ])
                              triggerNotification(`已导入 AI 推荐的「${rec.tag}」判定配置。`, 'success')
                            }}
                            className="text-[10px] text-indigo-600 font-black hover:underline mt-1 block"
                          >
                            采纳并载入此 AI 推荐公式
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* IF block */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-text-dark border-l-4 border-primary pl-2 uppercase tracking-wide">
                    第一步：IF - 判定触发条件组合
                  </div>
                  
                  <div className="flex items-center gap-4 bg-slate-50 p-3 border rounded text-xs">
                    <span className="font-bold text-text-secondary shrink-0">条件关系联结：</span>
                    <div className="flex bg-slate-200 p-0.5 rounded">
                      <button
                        type="button"
                        onClick={() => setRuleMatchType('AND')}
                        className={`px-3 py-1 font-bold text-[10px] rounded cursor-pointer transition-colors ${
                          ruleMatchType === 'AND' ? 'bg-[#11356A] text-white shadow-sm' : 'text-text-secondary'
                        }`}
                      >
                        AND (全部满足)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRuleMatchType('OR')}
                        className={`px-3 py-1 font-bold text-[10px] rounded cursor-pointer transition-colors ${
                          ruleMatchType === 'OR' ? 'bg-[#11356A] text-white shadow-sm' : 'text-text-secondary'
                        }`}
                      >
                        OR (任一满足)
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddConditionRow}
                      className="text-primary hover:text-primary-hover font-bold ml-auto flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      添加判定行
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {ruleConditions.map((cond, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50 border p-3 rounded">
                        <span className="font-bold text-text-secondary w-16">条件行 {idx + 1}:</span>
                        
                        <select
                          value={cond.field}
                          onChange={(e) => setRuleConditions(ruleConditions.map((c, i) => i === idx ? { ...c, field: e.target.value } : c))}
                          className="bg-white border rounded px-2 py-1.5 w-36"
                        >
                          <option value="出勤天数">出勤天数 (履约)</option>
                          <option value="违章次数">违章次数 (安全)</option>
                          <option value="综合评分">工人综合评分 (画像)</option>
                          <option value="体检结论">体检结论 (健康)</option>
                          <option value="特种证验证">特种证验证 (能力)</option>
                        </select>

                        <select
                          value={cond.op}
                          onChange={(e) => setRuleConditions(ruleConditions.map((c, i) => i === idx ? { ...c, op: e.target.value } : c))}
                          className="bg-white border rounded px-2 py-1.5 w-24"
                        >
                          <option value="大于">大于</option>
                          <option value="等于">等于</option>
                          <option value="小于">小于</option>
                          <option value="包含">包含</option>
                        </select>

                        <input
                          type="text"
                          value={cond.val}
                          onChange={(e) => setRuleConditions(ruleConditions.map((c, i) => i === idx ? { ...c, val: e.target.value } : c))}
                          className="bg-white border rounded px-2.5 py-1.5 w-32 font-bold text-text-dark text-center"
                        />

                        {ruleConditions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setRuleConditions(ruleConditions.filter((c, i) => i !== idx))}
                            className="text-danger-red hover:text-red-700 ml-auto cursor-pointer"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* THEN block */}
                <div className="space-y-3 pt-4 border-t border-dashed">
                  <div className="text-xs font-bold text-text-dark border-l-4 border-primary pl-2 uppercase tracking-wide">
                    第二步：THEN - 贴附目标评估标签
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-text-secondary mb-1">公式标签规则名称</label>
                      <input
                        type="text"
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        className="w-full bg-white border rounded px-3 py-1.5 text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary mb-1">对应输出的标签</label>
                      <select
                        value={ruleOutputTag}
                        onChange={(e) => setRuleOutputTag(e.target.value)}
                        className="w-full bg-white border rounded px-2.5 py-1.5 text-text-dark font-bold text-[#11356A]"
                      >
                        {tags.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t pt-4">
                  <button
                    onClick={() => {
                      const newRule = {
                        id: `RULE-${Date.now().toString().slice(-3)}`,
                        name: ruleName,
                        matchType: ruleMatchType,
                        conditions: [...ruleConditions],
                        outputTag: ruleOutputTag,
                        status: true,
                        desc: `AI-OCR贴签规则`
                      }
                      setRules(prev => [newRule, ...prev])
                      triggerNotification('判定逻辑引擎公式已保存并发布！', 'success')
                    }}
                    className="px-5 py-2 bg-primary hover:bg-[#1b3d6f] text-white text-xs font-bold rounded shadow-sm cursor-pointer"
                  >
                    保存并激活规则
                  </button>
                </div>

              </div>

              {/* Right: Rules semantic previews */}
              <div className="lg:col-span-4 bg-indigo-50/40 border border-indigo-100 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#11356A] font-bold text-xs shrink-0 border-b pb-2">
                  <Workflow className="h-4.5 w-4.5 text-indigo-600" />
                  <span>条件规则引擎语义翻译</span>
                </div>

                <div className="bg-white border border-indigo-150 p-4 rounded shadow-sm space-y-3 text-xs flex-grow">
                  <div className="font-bold text-text-dark">规则名：{ruleName}</div>
                  <div className="text-[11px] text-text-secondary">组合联结方式：{ruleMatchType}</div>
                  <div className="h-[1px] bg-slate-200"></div>
                  <p className="text-indigo-850 font-semibold leading-relaxed">
                    {computedRuleTranslation}
                  </p>
                </div>

                <div className="bg-white border rounded p-3 text-[10px] text-text-secondary space-y-1">
                  <div className="font-bold text-text-dark">最近运行统计：</div>
                  <div>- 日运行频率：每天凌晨 00:30</div>
                  <div>- 昨日自动命中贴签总数：142 人</div>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 4: 标签预览与分析 (Simulation + Coverage charts + Topology)
              ========================================== */}
          {activeTab === 'preview' && (
            <div className="flex-grow flex flex-col gap-8">
              
              {/* Simulation Sandbox */}
              <div className="bg-white border rounded-lg p-5 flex flex-col gap-4 shadow-sm shrink-0">
                <div className="flex items-center justify-between border-b pb-2 text-xs">
                  <span className="font-bold text-text-dark flex items-center gap-1">
                    <Sparkles className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                    工人贴签画像实时测演模拟
                  </span>
                  <div>
                    <select value={simWorkerId} onChange={(e) => setSimWorkerId(e.target.value)} className="bg-white border rounded px-2.5 py-1 text-xs text-text-dark">
                      <option value="w1">张建国 (特种塔吊工)</option>
                      <option value="w2">李强 (架子工)</option>
                      <option value="w3">王朝阳 (泥工)</option>
                      <option value="w4">刘小虎 (安全风险警退人员)</option>
                    </select>
                  </div>
                </div>

                <button onClick={handleRunSimulator} disabled={simulating} className="w-full py-2 bg-primary text-white text-xs font-bold rounded shadow cursor-pointer">
                  {simulating ? '引擎匹配运算中...' : '生成模拟工人画像标签云'}
                </button>

                {simResult && (
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg flex flex-col md:flex-row items-center gap-6 animate-zoom-in text-xs">
                    <div className="flex items-center gap-4 border-r pr-6 shrink-0">
                      <div className="h-14 w-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow">
                        {simResult.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-text-dark">{simResult.name}</div>
                        <div className="text-[10px] text-[#52C41A] font-bold bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-150">
                          综合评价：{simResult.score}分
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 flex-grow">
                      {simResult.tags.map((tag, idx) => {
                        const matchingTagObj = tags.find(t => t.name === tag)
                        return (
                          <div
                            key={idx}
                            onClick={() => triggerNotification(`标签「${tag}」命中原因：${matchingTagObj?.desc || '规则自动贴签'}`, 'info')}
                            className="px-3.5 py-1.5 rounded-full font-bold text-[10.5px] cursor-pointer hover:scale-105 transition-all text-white shadow-sm flex items-center gap-1"
                            style={{ backgroundColor: matchingTagObj?.color || '#11356A' }}
                          >
                            <span>{tag}</span>
                            <Info className="h-3 w-3" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Hit count Analytics (Custom SVG) & Topology */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-grow">
                
                {/* Hit analytics */}
                <div className="md:col-span-6 bg-white border border-border-gray rounded-lg p-5 flex flex-col justify-between shadow-sm">
                  <div className="text-xs font-bold text-text-dark mb-4 border-b pb-2">标签命中人数与覆盖率分析</div>
                  
                  {/* SVG Bar Chart */}
                  <div className="h-44 w-full flex items-end justify-between border-b border-l pb-2 pl-2">
                    {[
                      { name: '全勤标兵', count: 95, cover: '7.5%' },
                      { name: '安全可信', count: 320, cover: '25%' },
                      { name: '优秀履约', count: 184, cover: '14.5%' },
                      { name: '违章警示', count: 15, cover: '1.2%' }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                        <div className="text-[10px] font-bold text-primary font-mono">{bar.count}人</div>
                        <div className="bg-[#11356A] rounded-t w-10 transition-all duration-300 hover:bg-indigo-700" style={{ height: `${(bar.count / 320) * 110}px` }}></div>
                        <div className="text-[9px] text-text-secondary truncate max-w-[80px] text-center" title={bar.name}>{bar.name}</div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-text-secondary mt-3">说明：反映当前在场劳务工人被贴签的分布结构，以防止个别标签覆盖率偏畸。</div>
                </div>

                {/* Tag topology chains (light background flow) */}
                <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-sm">
                  <div className="text-xs font-bold text-[#11356A] mb-4 border-b pb-2">评价模型与智能标签传导拓扑关系</div>
                  
                  {/* SVG Topology Nodes Map */}
                  <div className="flex-grow flex flex-col items-center justify-center py-4">
                    <div className="flex flex-col items-center gap-1.5 bg-white border-2 border-indigo-250 p-2.5 rounded shadow-sm text-xs w-48 text-center">
                      <span className="font-bold text-text-dark">1. 实名制/AI 原始数据流入</span>
                      <span className="text-[9px] text-text-secondary font-mono">考勤打卡、安全积分扣减</span>
                    </div>
                    
                    <div className="h-5 w-[2px] bg-slate-400 my-1 relative">
                      <div className="absolute top-1 -left-1 text-[8px] text-slate-400">▼</div>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 bg-white border-2 border-emerald-250 p-2.5 rounded shadow-sm text-xs w-48 text-center">
                      <span className="font-bold text-text-dark">2. 综合评价打分引擎</span>
                      <span className="text-[9px] text-text-secondary font-mono">计算综合分: 94分</span>
                    </div>

                    <div className="h-5 w-[2px] bg-slate-400 my-1 relative">
                      <div className="absolute top-1 -left-1 text-[8px] text-slate-400">▼</div>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 bg-indigo-600 p-2.5 rounded shadow text-xs w-48 text-center text-white">
                      <span className="font-bold">3. 自动匹配判定引擎贴签</span>
                      <span className="text-[9px] text-indigo-200 font-mono">命中：「优秀履约」标签</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-text-secondary">点击拓扑链中的任何一环，即可实时向右穿透对应的底层评价流水。</div>
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              TAB 5: 标签版本管理
              ========================================== */}
          {activeTab === 'versions' && (
            <div className="flex-grow flex flex-col gap-6">
              
              <div className="flex-grow border border-border-gray rounded-lg overflow-x-auto">
                <table className="b-table text-xs">
                  <thead>
                    <tr>
                      <th>版本归档号</th>
                      <th>发版时间</th>
                      <th>发版操作员</th>
                      <th>版本发版说明</th>
                      <th>使用状态</th>
                      <th className="text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="font-mono font-bold text-[#11356A]">{v.version}</td>
                        <td className="font-mono text-text-secondary">{v.time}</td>
                        <td className="font-bold text-text-dark">{v.creator}</td>
                        <td className="max-w-md truncate text-text-secondary" title={v.desc}>{v.desc}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            v.status === '当前激活' ? 'bg-emerald-50 text-success-green border border-emerald-250' : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="text-right font-bold">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => triggerNotification(`已成功克隆归档贴签规则：${v.version}`, 'success')}
                              className="text-text-secondary hover:text-text-dark font-bold text-xs bg-slate-50 border px-2 py-1 rounded cursor-pointer"
                            >
                              复制
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`确认回滚标签规则至历史版本「${v.version}」吗？`)) {
                                  triggerNotification(`标签规则库成功回退至版本: ${v.version}！正在重新预刷画像...`, 'success')
                                }
                              }}
                              disabled={v.status === '当前激活'}
                              className={`font-bold text-xs border px-2 py-1 rounded ${
                                v.status === '当前激活'
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : 'text-primary hover:text-primary-hover bg-primary/5 border-primary/20 cursor-pointer'
                              }`}
                            >
                              回滚至此版本
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

        </div>
      </div>

      {/* ======================================================================
          DRAWER 1: ADD/EDIT TAG (新增/修改标签右侧抽屉)
          ====================================================================== */}
      {isAddTagOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsAddTagOpen(false)}></div>

          {/* Form Panel */}
          <form
            onSubmit={handleSaveTag}
            className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in"
          >
            {/* Header */}
            <div className="p-5 border-b bg-slate-50 border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-text-dark flex items-center gap-1.5">
                <Layers className="h-5 w-5 text-primary animate-pulse" />
                <span>{editingTag ? '编辑评价标签' : '新增评价标签'}</span>
              </h3>
              <button type="button" onClick={() => setIsAddTagOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable inputs */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-text-secondary mb-1">所属大分类</label>
                  <select
                    value={tagForm.category}
                    onChange={(e) => setTagForm({ ...tagForm, category: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                  >
                    <option value="职业能力">职业能力</option>
                    <option value="履约能力">履约能力</option>
                    <option value="安全能力">安全能力</option>
                    <option value="健康能力">健康能力</option>
                    <option value="信用能力">信用能力</option>
                    <option value="自定义标签">自定义标签</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-text-secondary mb-1">标签唯一编码</label>
                  <input
                    type="text"
                    required
                    value={tagForm.code}
                    onChange={(e) => setTagForm({ ...tagForm, code: e.target.value })}
                    placeholder="如: TAG_ATTEND_HERO"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-text-secondary mb-1">标签显示名称</label>
                  <input
                    type="text"
                    required
                    value={tagForm.name}
                    onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                    placeholder="标签全名"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-secondary mb-1">数据生成方式</label>
                  <select
                    value={tagForm.method}
                    onChange={(e) => setTagForm({ ...tagForm, method: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-text-dark font-bold text-primary"
                  >
                    <option value="系统">系统生成</option>
                    <option value="AI">AI 识别</option>
                    <option value="人工">人工评定</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-text-secondary mb-1">标签视觉颜色</label>
                  <input
                    type="color"
                    value={tagForm.color}
                    onChange={(e) => setTagForm({ ...tagForm, color: e.target.value })}
                    className="w-full h-8 cursor-pointer rounded border"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-secondary mb-1">文字视觉颜色</label>
                  <input
                    type="color"
                    value={tagForm.textCol}
                    onChange={(e) => setTagForm({ ...tagForm, textCol: e.target.value })}
                    className="w-full h-8 cursor-pointer rounded border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-secondary mb-1">标签评定逻辑说明</label>
                <textarea
                  required
                  rows="3"
                  value={tagForm.desc}
                  onChange={(e) => setTagForm({ ...tagForm, desc: e.target.value })}
                  placeholder="该判定逻辑需要满足的具体条件说明..."
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-text-dark"
                ></textarea>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddTagOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-text-dark font-bold rounded shadow-sm cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-[#1b3d6f] text-white font-bold rounded shadow cursor-pointer transition-colors"
              >
                保存并发布
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================================
          DRAWER 2: TAG DETAIL VIEW (查看标签详情右侧抽屉)
          ====================================================================== */}
      {isDetailDrawerOpen && selectedDetails && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsDetailDrawerOpen(false)}></div>

          {/* Details Panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="p-5 border-b bg-slate-50 border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-text-dark flex items-center gap-1.5">
                <Info className="h-4.5 w-4.5 text-primary" />
                <span>评价标签元数据详情</span>
              </h3>
              <button onClick={() => setIsDetailDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              
              <div className="bg-slate-50 border rounded-lg p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#11356A] text-sm">{selectedDetails.code}</span>
                  <span
                    className="px-2.5 py-0.8 rounded-full font-bold text-[10.5px] shadow-sm text-white"
                    style={{ backgroundColor: selectedDetails.color }}
                  >
                    {selectedDetails.name}
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed">{selectedDetails.desc}</p>
              </div>

              {/* Scope details */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-text-dark border-l-4 border-primary pl-2 uppercase tracking-wide">
                  数据治理生命周期
                </div>
                <div className="bg-slate-50 border rounded p-4 space-y-3">
                  <div>
                    <span className="text-text-secondary">所属大分类：</span>
                    <span className="font-bold text-text-dark">{selectedDetails.category}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">系统生成方式：</span>
                    <span className="font-bold text-indigo-700">{selectedDetails.method}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">当前版本：</span>
                    <span className="font-bold text-text-dark">{selectedDetails.version}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">覆盖命中人数：</span>
                    <span className="font-bold font-mono text-[#52C41A]">{selectedDetails.hits} 人</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex items-center justify-end shrink-0">
              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="px-4 py-2 bg-primary hover:bg-[#1b3d6f] text-white text-xs font-bold rounded shadow-sm cursor-pointer"
              >
                确认关闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: ADD CATEGORY (新增标签分类对话框/模态窗口)
          ====================================================================== */}
      {isAddCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsAddCatOpen(false)}></div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setCategories([...categories, catForm])
              triggerNotification(`已新增标签大分类: ${catForm.name}`, 'success')
              setIsAddCatOpen(false)
            }}
            className="relative bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col z-10 overflow-hidden animate-zoom-in text-xs"
          >
            <div className="p-4 border-b bg-slate-50 border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-dark">新增标签大分类</h3>
              <button type="button" onClick={() => setIsAddCatOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-bold text-text-secondary mb-1">分类名称</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="如: 工会模范表彰类"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-text-dark"
                />
              </div>
              <div>
                <label className="block font-bold text-text-secondary mb-1">分类功能方向描述</label>
                <textarea
                  required
                  rows="3"
                  value={catForm.desc}
                  onChange={(e) => setCatForm({ ...catForm, desc: e.target.value })}
                  placeholder="简要描述该维度用于什么样的贴签规则判定..."
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-text-dark"
                ></textarea>
              </div>
            </div>
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddCatOpen(false)} className="px-4 py-2 bg-white border rounded shadow-sm font-bold text-text-dark cursor-pointer">
                取消
              </button>
              <button type="submit" className="px-4 py-2 bg-[#52C41A] text-white rounded shadow font-bold cursor-pointer">
                新增分类
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}

```

## File: src/pages/PortraitCenter.jsx

```javascript
import { useState, useMemo } from 'react'
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  Sliders,
  Check,
  Tag,
  Phone,
  Briefcase,
  Calendar,
  Award,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  FileText,
  Heart,
  TrendingUp,
  ArrowLeft,
  ShieldCheck,
  Activity,
  QrCode,
  UserCheck,
  Plus,
  X,
  Sparkles,
  Download,
  Printer,
  RefreshCw,
  Layers,
  CheckCircle2,
  Cpu,
  Info
} from 'lucide-react'

// Workers Database
const INITIAL_WORKERS = [
  {
    id: 'w1',
    name: '张建国',
    age: 46,
    idCard: '3701021980******56',
    score: 94,
    grade: 'A 级',
    team: '钢筋一班',
    enterprise: '中建一局集团',
    jobType: '特种塔吊工',
    status: '在岗',
    years: 15,
    region: '北京朝阳',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    tags: ['全勤标兵', '工匠先锋', '健康良好', '安全之星', '优秀班组', 'A级工人'],
    radar: { ability: 95, fulfill: 90, safety: 96, health: 92, credit: 98 },
    history: {
      projects: [
        { time: '2026.01 - 至今', name: '北京CBD东区超高层项目', duty: '特种塔吊班组长', eval: '技术极其过硬，安全意识卓越' },
        { time: '2024.03 - 2025.12', name: '北京大兴机场二期航站楼', duty: '塔吊信号指挥工', eval: '无任何安全违章，按时打卡考勤' }
      ],
      rewards: [
        { time: '2026.07.08', title: '季度百日安全生产卫士奖', agency: '中建一局项目部', file: 'cert_safe_2026.pdf' },
        { time: '2026.06.01', title: '集团百日安全卫士证书', agency: '中建一局集团', file: 'award_group.pdf' }
      ],
      punishments: [],
      certs: [
        { name: '特种作业操作证(塔式起重机驾驶)', grade: '特种高级', agency: '北京市建设委员会', time: '2028-10-12', file: 'cert_lift_verify.pdf' }
      ],
      health: [
        { time: '2026.07.08', result: '健康良好', forbid: '无职业禁忌', agency: '北京市朝阳区第二医院', trend: '血压稳定' }
      ]
    },
    trend: [88, 89, 91, 90, 92, 92, 93, 94, 94, 94, 94, 94]
  },
  {
    id: 'w2',
    name: '李强',
    age: 38,
    idCard: '4201061988******90',
    score: 85,
    grade: 'B 级',
    team: '架子二班',
    enterprise: '中建一局集团',
    jobType: '架子工',
    status: '在岗',
    years: 10,
    region: '湖北武汉',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    tags: ['安全可信', '优秀履约', '健康良好'],
    radar: { ability: 82, fulfill: 88, safety: 80, health: 90, credit: 92 },
    history: {
      projects: [
        { time: '2026.02 - 至今', name: '北京CBD东区超高层项目', duty: '高处双排脚手架搭设工', eval: '高空防护严密，遵守违章红线' }
      ],
      rewards: [
        { time: '2026.07.08', title: '优秀班组标兵表彰', agency: '中建一局项目部', file: 'reward_team.pdf' }
      ],
      punishments: [],
      certs: [
        { name: '建筑施工特种作业操作证(建筑架子工)', grade: '中级', agency: '湖北省建设厅', time: '2027-08-15', file: 'cert_scaff_verify.pdf' }
      ],
      health: [
        { time: '2026.06.15', result: '健康良好', forbid: '无职业禁忌', agency: '建工体检中心', trend: '正常' }
      ]
    },
    trend: [82, 83, 85, 84, 85, 85, 86, 85, 85, 85, 85, 85]
  },
  {
    id: 'w3',
    name: '王朝阳',
    age: 34,
    idCard: '1301021992******67',
    score: 72,
    grade: 'C 级',
    team: '泥工一班',
    enterprise: '中铁十一局',
    jobType: '泥工',
    status: '待入场',
    years: 8,
    region: '河北石家庄',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    tags: ['健康良好', '安全可信'],
    radar: { ability: 78, fulfill: 65, safety: 70, health: 80, credit: 75 },
    history: {
      projects: [
        { time: '2026.03 - 2026-06', name: '北京轨道交通28号线项目', duty: '普通混凝土泥水工', eval: '服从项目日常调度，实操考核及格' }
      ],
      rewards: [],
      punishments: [],
      certs: [
        { name: '普通行业抹灰上岗资格证', grade: '初级', agency: '石家庄技能鉴定所', time: '2029-01-10', file: 'cert_plaster.pdf' }
      ],
      health: [
        { time: '2026.03.01', result: '健康良好', forbid: '无职业禁忌', agency: '石家庄市第三医院', trend: '正常' }
      ]
    },
    trend: [70, 71, 71, 72, 72, 72, 72, 72, 72, 72, 72, 72]
  },
  {
    id: 'w4',
    name: '刘小虎',
    age: 29,
    idCard: '5101051997******45',
    score: 58,
    grade: 'E 级',
    team: '普工班组',
    enterprise: '中铁十一局',
    jobType: '普工',
    status: '离场',
    years: 3,
    region: '四川成都',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    tags: ['高空禁忌', '违章警示'],
    radar: { capability: 50, attendance: 62, safety: 45, health: 80, credit: 60 },
    history: {
      projects: [
        { time: '2026.04 - 2026-07', name: '北京轨道交通28号线项目', duty: '材料搬运及辅助杂工', eval: '多次高空违章作业警告，扣减安全分' }
      ],
      rewards: [],
      punishments: [
        { time: '2026.06.12', title: '未戴安全防护帽警告通报', agency: '安检部', file: 'punish_record.pdf' }
      ],
      certs: [],
      health: [
        { time: '2026.04.10', result: '高血压禁忌项', forbid: '高血压、恐高症高空作业禁忌', agency: '北京市朝阳区第二医院', trend: '轻度异常' }
      ]
    },
    trend: [65, 62, 60, 58, 58, 58, 58, 58, 58, 58, 58, 58]
  }
];

export default function PortraitCenter({ triggerNotification }) {
  const [activeTab, setActiveTab] = useState('talent-pool') // talent-pool, compare-analytics

  // Search filters
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterJob, setFilterJob] = useState('ALL')
  const [filterCorp, setFilterCorp] = useState('ALL')
  const [filterLevel, setFilterLevel] = useState('ALL')
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)

  // Worker select for Right digital portrait visualizer
  const [selectedWorkerId, setSelectedWorkerId] = useState('w1')
  const [rightSubTab, setRightSubTab] = useState('portrait') // portrait, experience, certs, ai-advice

  // Worker compare states
  const [compareWorkerAId, setCompareWorkerAId] = useState('w1')
  const [compareWorkerBId, setCompareWorkerBId] = useState('w2')

  // PDF report export drawer state
  const [isPdfDrawerOpen, setIsPdfDrawerOpen] = useState(false)

  // Selected worker object
  const activeWorker = useMemo(() => {
    return INITIAL_WORKERS.find(w => w.id === selectedWorkerId) || INITIAL_WORKERS[0]
  }, [selectedWorkerId])

  // Filters search query
  const filteredWorkers = useMemo(() => {
    return INITIAL_WORKERS.filter(w => {
      const matchKey = w.name.includes(searchKeyword) || w.idCard.includes(searchKeyword)
      const matchJob = filterJob === 'ALL' || w.jobType === filterJob
      const matchCorp = filterCorp === 'ALL' || w.enterprise.includes(filterCorp)
      const matchLevel = filterLevel === 'ALL' || w.grade === filterLevel
      return matchKey && matchJob && matchCorp && matchLevel
    })
  }, [searchKeyword, filterJob, filterCorp, filterLevel])

  return (
    <div className="flex-grow flex flex-col gap-6">
      
      {/* 1. Page Header */}
      <div className="bg-white border border-border-gray rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
            <Users className="h-5.5 w-5.5 text-primary animate-pulse" />
            产业工人人才画像中心
            <span className="text-xs font-normal text-text-secondary bg-[#11356A]/5 border border-[#11356A]/20 px-2 py-0.5 rounded">
              大数据劳务建档大厅
            </span>
          </h2>
          <p className="text-xs text-text-secondary mt-1.5">
            穿透查看在场产业工人的五维雷达大模型评价、折线成长轨迹、智能贴签画像，以及安全/奖励/处罚/体检综合成长履历。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPdfDrawerOpen(true)
              triggerNotification('开始编译 PDF 画像报告模板预览...', 'success')
            }}
            className="px-3.5 py-1.5 bg-[#11356A] hover:bg-primary-hover text-white rounded font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
          >
            <Printer className="h-3.5 w-3.5" />
            一键导出画像报告
          </button>
        </div>
      </div>

      {/* 2. Top KPI Cards (5 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 shrink-0">
        {[
          { title: '累计评价工人数', val: '1,265 人', desc: '全建制在册库', time: '自动同步', icon: <Users className="h-5 w-5 text-primary" /> },
          { title: 'A级杰出人才数', val: '248 人', desc: '综合评分 90 分以上', time: '模型评定', icon: <Award className="h-5 w-5 text-success-green" /> },
          { title: '重点培养工人数', val: '124 人', desc: '塔吊/架子核心班组', time: 'AI画像识别', icon: <Sparkles className="h-5 w-5 text-orange-500" /> },
          { title: '高风险警退人数', val: '15 人', desc: '含高血压/高频违章', time: '系统预警', icon: <AlertTriangle className="h-5 w-5 text-danger-red animate-pulse" /> },
          { title: '今日评价更新', val: '142 人次', desc: '新增打卡画像重塑', time: '今日跑分', icon: <Activity className="h-5 w-5 text-indigo-600" /> }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-border-gray p-4 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-all border-l-4 border-l-primary">
            <div className="flex items-start justify-between">
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{kpi.title}</div>
              <div className="bg-slate-50 p-1.5 rounded">{kpi.icon}</div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-black text-text-dark font-mono leading-none">{kpi.val}</div>
              <div className="flex items-center justify-between text-[10px] text-text-secondary mt-2">
                <span className="font-semibold text-primary">{kpi.desc}</span>
                <span>{kpi.time.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Primary Tabs Navigation */}
      <div className="bg-white border border-border-gray rounded shadow-sm flex flex-col flex-grow min-h-[500px]">
        
        {/* Navigation tabs */}
        <div className="flex border-b border-border-gray bg-slate-50 px-4 pt-3 shrink-0">
          {[
            { id: 'talent-pool', label: '企业人才库与画像看板 (左右布局)', icon: <Users className="h-4 w-4" /> },
            { id: 'compare-analytics', label: '人才对比与报告分析', icon: <Sliders className="h-4 w-4" /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4.5 py-3 text-xs font-bold border-t-2 border-x transition-all duration-150 cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white border-x-border-gray border-t-primary text-primary -mb-[1px] relative z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]'
                  : 'bg-transparent border-transparent text-text-secondary hover:text-primary hover:bg-slate-100'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Panels */}
        <div className="p-6 flex-grow flex flex-col min-h-[380px]">
          
          {/* ==========================================
              TAB 1: 企业人才库与画像看板 (左右布局 40% : 60%)
              ========================================== */}
          {activeTab === 'talent-pool' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
              
              {/* Left Column (40% width): Enterprise Talent Pool Grid Table */}
              <div className="lg:col-span-5 bg-white border border-border-gray rounded-lg p-4 flex flex-col gap-4 shadow-sm overflow-hidden">
                
                {/* Advanced Search bar */}
                <div className="space-y-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="检索姓名、身份证号..."
                        className="w-full bg-white border border-slate-300 rounded px-2.5 pl-8 py-1.5 text-xs text-text-dark"
                      />
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <button
                      onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border rounded font-bold text-xs text-text-dark flex items-center gap-1 cursor-pointer"
                    >
                      <Filter className="h-3.5 w-3.5 text-primary" />
                      高级筛选
                    </button>
                  </div>

                  {isAdvancedFiltersOpen && (
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 border p-3 rounded-lg text-xs animate-slide-down">
                      <div>
                        <label className="block text-text-secondary mb-1">选择工种</label>
                        <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)} className="w-full bg-white border rounded p-1">
                          <option value="ALL">全部工种</option>
                          <option value="特种塔吊工">特种塔吊工</option>
                          <option value="架子工">架子工</option>
                          <option value="电焊工">电焊工</option>
                          <option value="泥工">泥工</option>
                          <option value="普工">普工</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-text-secondary mb-1">选择企业</label>
                        <select value={filterCorp} onChange={(e) => setFilterCorp(e.target.value)} className="w-full bg-white border rounded p-1">
                          <option value="ALL">全部合作分包企业</option>
                          <option value="中建一局">中建一局集团</option>
                          <option value="中铁十一局">中铁十一局</option>
                          <option value="上海建工">上海建工</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-text-secondary mb-1">选择评价级别</label>
                        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-full bg-white border rounded p-1 font-mono font-bold">
                          <option value="ALL">全部等级</option>
                          <option value="A 级">A 级</option>
                          <option value="B 级">B 级</option>
                          <option value="C 级">C 级</option>
                          <option value="E 级">E 级</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Workers list table */}
                <div className="flex-grow border border-slate-200 rounded-lg overflow-y-auto">
                  <table className="b-table text-xs">
                    <thead>
                      <tr>
                        <th>姓名</th>
                        <th>工种</th>
                        <th>所属项目/状态</th>
                        <th>评分/等级</th>
                        <th className="text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWorkers.map(item => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedWorkerId(item.id)}
                          className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                            selectedWorkerId === item.id ? 'bg-[#11356A]/5 border-l-4 border-l-[#11356A]' : ''
                          }`}
                        >
                          <td className="font-bold text-text-dark">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                                {item.name.slice(0, 1)}
                              </div>
                              {item.name}
                            </div>
                          </td>
                          <td>{item.jobType}</td>
                          <td>
                            <div className="space-y-0.5">
                              <div className="truncate max-w-[120px] text-text-secondary">北京东区工地</div>
                              <span className={`inline-block text-[9.5px] px-1.5 py-0.2 rounded font-bold ${
                                item.status === '在岗' ? 'bg-emerald-50 text-success-green border border-emerald-200' :
                                item.status === '待入场' ? 'bg-blue-50 text-primary border border-blue-200 animate-pulse' :
                                'bg-slate-100 text-slate-400 border border-slate-200'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold">{item.score}分</span>
                              <span
                                className="px-1.5 py-0.2 rounded font-mono font-bold text-[9px] text-white"
                                style={{
                                  backgroundColor:
                                    item.grade === 'A 级' ? '#52C41A' :
                                    item.grade === 'B 级' ? '#1890FF' :
                                    item.grade === 'C 级' ? '#722ED1' : '#F5222D'
                                }}
                              >
                                {item.grade.split(' ')[0]}
                              </span>
                            </div>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedWorkerId(item.id)
                                setIsPdfDrawerOpen(true)
                              }}
                              className="text-[#11356A] hover:text-primary-hover font-bold text-xs bg-slate-50 border px-2 py-1 rounded"
                            >
                              画像报告
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Right Column (60% width): Digital Portrait workspace panel */}
              <div className="lg:col-span-7 bg-white border border-border-gray rounded-lg p-5 flex flex-col gap-6 shadow-sm overflow-y-auto max-h-[700px]">
                
                {/* 1. Top Identity block */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 shrink-0 bg-slate-50/50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-[#11356A] text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow">
                      {activeWorker.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-text-dark leading-none">{activeWorker.name}</h3>
                        <span className="bg-[#11356A]/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold">
                          {activeWorker.jobType}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-secondary mt-1.5 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>所属：{activeWorker.enterprise} | {activeWorker.team}</span>
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono mt-1">身份证号：{activeWorker.idCard}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Rank indices */}
                    <div className="text-right text-[10px] text-text-secondary space-y-0.5 font-semibold">
                      <div>项目排名：<strong className="text-primary font-mono text-xs">第 3 名</strong></div>
                      <div>企业排名：<strong className="text-primary font-mono text-xs">第 12 名</strong></div>
                      <div>全国排名：<strong className="text-slate-400 font-mono text-[10px]">前 2.5%</strong></div>
                    </div>
                    
                    {/* Overall score gauge */}
                    <div className="bg-white border rounded p-2 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-[9px] text-text-secondary font-bold uppercase leading-none mb-1">大模型综合分</span>
                      <span className="text-2xl font-black font-mono text-[#52C41A] leading-none">{activeWorker.score}</span>
                      <span
                        className="px-1.5 py-0.2 rounded font-mono font-bold text-[9px] text-white mt-1"
                        style={{
                          backgroundColor:
                            activeWorker.grade === 'A 级' ? '#52C41A' :
                            activeWorker.grade === 'B 级' ? '#1890FF' :
                            activeWorker.grade === 'C 级' ? '#722ED1' : '#F5222D'
                        }}
                      >
                        {activeWorker.grade}
                      </span>
                    </div>

                    <div className="bg-white border rounded p-1 flex items-center justify-center shadow-sm" title="电子工人卡二维码">
                      <QrCode className="h-10 w-10 text-text-dark" />
                    </div>
                  </div>
                </div>

                {/* 2. AI Comprehensive Evaluation Card */}
                <div className="bg-indigo-50 border border-indigo-150 rounded-lg p-4 flex items-start gap-3 text-xs shrink-0">
                  <div className="bg-indigo-500/10 p-1.5 rounded-full shrink-0">
                    <Cpu className="h-5.5 w-5.5 text-indigo-500 animate-spin" />
                  </div>
                  <div>
                    <span className="font-bold text-[#11356A] block">AI 综合评价推演分析</span>
                    <p className="text-[11px] text-indigo-900 leading-relaxed mt-1">
                      该工人近一年履约表现优秀，连续出勤超过180天，无安全处罚，拥有特种操作证，综合评价等级为 {activeWorker.grade}。
                      建议：<strong>列为特种高空作业班组长后备人选</strong>，并积极推荐参加一级建造施工及BIM建模实操课程。
                    </p>
                  </div>
                </div>

                {/* 3. Sub Tabs within digital portrait workspace */}
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start shrink-0">
                  {[
                    { id: 'portrait', label: '维度雷达 & 画像标签' },
                    { id: 'experience', label: '成长履历与经历' },
                    { id: 'certs', label: '证书资质与健康' },
                    { id: 'ai-advice', label: '培养建议与风险' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setRightSubTab(tab.id)}
                      className={`px-3 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                        rightSubTab === tab.id ? 'bg-[#11356A] text-white shadow-sm' : 'text-text-secondary hover:text-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 4. Sub panels */}
                <div className="flex-grow flex flex-col gap-6 min-h-[300px]">
                  
                  {/* Sub panel: Portrait (Radar & tag cloud) */}
                  {rightSubTab === 'portrait' && (
                    <div className="flex-grow flex flex-col gap-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                        {/* Radar Chart */}
                        <div className="bg-slate-50 border rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
                          <span className="font-bold text-[10px] text-text-secondary mb-4 uppercase">五维画像雷达评分</span>
                          
                          {/* SVG Radar */}
                          <div className="relative w-44 h-44 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                              {/* Background grid */}
                              <polygon points="50,15 85,40 72,80 28,80 15,40" fill="transparent" stroke="#E2E8F0" strokeWidth="1" />
                              <polygon points="50,25 78,45 68,75 32,75 22,45" fill="transparent" stroke="#E2E8F0" strokeWidth="1" />
                              <polygon points="50,35 71,50 63,70 37,70 29,50" fill="transparent" stroke="#CBD5E1" strokeWidth="0.5" />
                              
                              {/* Axis lines */}
                              <line x1="50" y1="50" x2="50" y2="15" stroke="#CBD5E1" strokeWidth="0.5" />
                              <line x1="50" y1="50" x2="85" y2="40" stroke="#CBD5E1" strokeWidth="0.5" />
                              <line x1="50" y1="50" x2="72" y2="80" stroke="#CBD5E1" strokeWidth="0.5" />
                              <line x1="50" y1="50" x2="28" y2="80" stroke="#CBD5E1" strokeWidth="0.5" />
                              <line x1="50" y1="50" x2="15" y2="40" stroke="#CBD5E1" strokeWidth="0.5" />

                              {/* Value Polygon */}
                              {(() => {
                                const abilityY = 50 - (activeWorker.radar.ability || activeWorker.radar.capability || 80) * 0.35
                                const fulfillX = 50 + (activeWorker.radar.fulfill || activeWorker.radar.attendance || 80) * 0.35
                                const safetyY = 50 + (activeWorker.radar.safety || 80) * 0.3
                                const healthX = 50 - (activeWorker.radar.health || 80) * 0.22
                                const creditX = 50 - (activeWorker.radar.credit || 80) * 0.35
                                return (
                                  <polygon
                                    points={`50,${abilityY} ${fulfillX},40 72,${safetyY} 28,80 ${creditX},40`}
                                    fill="rgba(17, 53, 106, 0.2)"
                                    stroke="#11356A"
                                    strokeWidth="1.5"
                                  />
                                )
                              })()}
                            </svg>

                            {/* Label tags */}
                            <span className="absolute top-0 text-[8px] font-bold text-text-dark bg-white px-1 border rounded">职业能力 ({activeWorker.radar.ability || activeWorker.radar.capability})</span>
                            <span className="absolute right-0 top-16 text-[8px] font-bold text-text-dark bg-white px-1 border rounded">履约 ({activeWorker.radar.fulfill || activeWorker.radar.attendance})</span>
                            <span className="absolute bottom-0 right-2 text-[8px] font-bold text-text-dark bg-white px-1 border rounded">安全 ({activeWorker.radar.safety})</span>
                            <span className="absolute bottom-0 left-2 text-[8px] font-bold text-text-dark bg-white px-1 border rounded">健康 ({activeWorker.radar.health})</span>
                            <span className="absolute left-0 top-16 text-[8px] font-bold text-text-dark bg-white px-1 border rounded">信用 ({activeWorker.radar.credit})</span>
                          </div>
                        </div>

                        {/* Growth line chart */}
                        <div className="bg-slate-50 border rounded-lg p-4 flex flex-col justify-between shadow-sm">
                          <span className="font-bold text-[10px] text-text-secondary mb-2 uppercase">12个月综合评分成长曲线</span>
                          
                          {/* SVG Line chart */}
                          <div className="h-28 w-full flex items-end justify-between border-b border-l pb-2 pl-2">
                            <svg className="w-full h-full" viewBox="0 0 120 40">
                              {/* Gradient Area under curve */}
                              <path
                                d={`M10,35 L20,33 L30,30 L40,32 L50,28 L60,26 L70,22 L80,20 L90,20 L100,20 L110,20 L120,20 L120,40 L10,40 Z`}
                                fill="rgba(17, 53, 106, 0.05)"
                              />
                              {/* Actual Line */}
                              <path
                                d={`M10,35 L20,33 L30,30 L40,32 L50,28 L60,26 L70,22 L80,20 L90,20 L100,20 L110,20 L120,20`}
                                fill="transparent"
                                stroke="#11356A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                          
                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-1">
                            <span>前12月</span>
                            <span>前6月</span>
                            <span>本月</span>
                          </div>
                        </div>
                      </div>

                      {/* Tag Cloud */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-text-secondary block">画像智能诊断标签云（点击查看逻辑）</span>
                        <div className="flex flex-wrap gap-2 bg-slate-50 border p-4 rounded-lg">
                          {activeWorker.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              onClick={() => triggerNotification(`标签「${tag}」源于大模型判定逻辑匹配。`, 'info')}
                              className="px-3.5 py-1.5 rounded-full font-bold text-[10.5px] cursor-pointer hover:scale-105 transition-all text-white shadow-sm"
                              style={{
                                backgroundColor:
                                  tag === '工匠先锋' || tag === 'A级工人' ? '#FAAD14' :
                                  tag === '全勤标兵' || tag === '优秀履约' ? '#52C41A' :
                                  tag === '安全之星' ? '#1890FF' : '#722ED1'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Sub panel: Experience (Timeline) */}
                  {rightSubTab === 'experience' && (
                    <div className="flex-grow flex flex-col gap-4 text-xs">
                      
                      <div className="space-y-4">
                        <span className="font-bold text-text-secondary block">工人成长活动时间轴</span>
                        
                        <div className="space-y-4 pl-4 border-l border-slate-200">
                          {/* Timeline items */}
                          <div className="relative">
                            <div className="absolute -left-[21px] top-0 h-4 w-4 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center">
                              <div className="h-2 w-2 bg-[#52C41A] rounded-full"></div>
                            </div>
                            <div className="bg-slate-50 border p-3 rounded-lg">
                              <span className="font-mono text-[10px] text-text-secondary">2026.07 - 至今</span>
                              <div className="font-bold text-text-dark mt-1">入职项目及首发结算：北京CBD东区超高层项目</div>
                              <p className="text-[11px] text-text-secondary mt-1">岗位职务：{activeWorker.history.projects[0]?.duty || '特种架手'}</p>
                            </div>
                          </div>

                          <div className="relative">
                            <div className="absolute -left-[21px] top-0 h-4 w-4 rounded-full border-2 border-indigo-500 bg-white flex items-center justify-center">
                              <div className="h-2 w-2 bg-primary rounded-full"></div>
                            </div>
                            <div className="bg-slate-50 border p-3 rounded-lg">
                              <span className="font-mono text-[10px] text-text-secondary">2026.07.08</span>
                              <div className="font-bold text-text-dark mt-1">季度百日安全生产卫士奖表彰奖励</div>
                              <p className="text-[11px] text-text-secondary mt-1">颁发机关：中建一局安全督察部</p>
                            </div>
                          </div>

                          {activeWorker.history.rewards.length > 1 && (
                            <div className="relative">
                              <div className="absolute -left-[21px] top-0 h-4 w-4 rounded-full border-2 border-indigo-500 bg-white flex items-center justify-center">
                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                              </div>
                              <div className="bg-slate-50 border p-3 rounded-lg">
                                <span className="font-mono text-[10px] text-text-secondary">2026.06.01</span>
                                <div className="font-bold text-text-dark mt-1">集团百日安全卫士加分</div>
                                <p className="text-[11px] text-text-secondary mt-1">评定为 A级 评级工人</p>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                    </div>
                  )}

                  {/* Sub panel: Certs & Health */}
                  {rightSubTab === 'certs' && (
                    <div className="flex-grow flex flex-col gap-6 text-xs">
                      
                      {/* Certificates */}
                      <div className="space-y-2">
                        <span className="font-bold text-text-secondary block">执业及特种作业资格证书</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeWorker.history.certs.length > 0 ? (
                            activeWorker.history.certs.map((c, i) => (
                              <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex flex-col justify-between shadow-sm">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-text-dark">{c.name}</span>
                                    <span className="bg-emerald-50 text-success-green border border-emerald-250 text-[9px] px-1.5 py-0.2 rounded font-bold">
                                      {c.grade}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-text-secondary space-y-1">
                                    <div>核发机关：{c.agency}</div>
                                    <div>有效期至：<span className="font-mono">{c.time}</span></div>
                                  </div>
                                </div>
                                <a href="#" onClick={(e) => { e.preventDefault(); triggerNotification(`证书附件 ${c.file} 加载成功！`, 'success') }} className="text-[10px] text-primary font-bold hover:underline flex items-center gap-0.5 mt-3">
                                  <span>查看证件扫描件 PDF</span>
                                  <ArrowRight className="h-3 w-3" />
                                </a>
                              </div>
                            ))
                          ) : (
                            <div className="bg-slate-50 border p-4 rounded-lg text-text-secondary font-semibold text-center md:col-span-2">
                              无证书备案数据。
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Health Logs */}
                      <div className="space-y-2">
                        <span className="font-bold text-text-secondary block">最近体检筛查与健康档案</span>
                        <div className="bg-slate-50 border rounded-lg p-4 text-xs space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>体检日期：<span className="font-bold font-mono text-text-dark">{activeWorker.history.health[0]?.time || '无数据'}</span></div>
                            <div>结论状态：<span className="font-bold text-success-green">{activeWorker.history.health[0]?.result || '无数据'}</span></div>
                            <div>职业病禁忌：<span className="font-semibold text-danger-red">{activeWorker.history.health[0]?.forbid || '无禁忌'}</span></div>
                            <div>诊断趋势：<span className="font-semibold text-text-secondary">{activeWorker.history.health[0]?.trend || '稳定'}</span></div>
                          </div>
                          <div className="text-[10.5px] text-text-secondary border-t pt-2 mt-2">
                            体检实施机构：{activeWorker.history.health[0]?.agency || '无'}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Sub panel: AI advice & risks */}
                  {rightSubTab === 'ai-advice' && (
                    <div className="flex-grow flex flex-col gap-6 text-xs">
                      
                      {/* AI advice */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-text-dark border-l-4 border-primary pl-2 uppercase tracking-wide">
                          🧠 AI 大脑培养策略建议
                        </div>
                        <div className="bg-slate-50 border rounded-lg p-4 space-y-2 leading-relaxed">
                          <div className="flex items-center gap-1.5 font-bold text-text-dark">
                            <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                            <span>推荐培养方向：特种塔吊金牌工长</span>
                          </div>
                          <div className="space-y-1 text-text-secondary">
                            <div>- 建议委任为项目“班组长后备库”，带领新进场学徒组建班组。</div>
                            <div>- 推荐参与“特种设备安全防倾翻实操技能大赛”获取省市级竞赛加分。</div>
                            <div>- 建议下周安排参与“智能吊装数据化终端”操作培训。</div>
                          </div>
                        </div>
                      </div>

                      {/* AI risks */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-text-dark border-l-4 border-danger-red pl-2 uppercase tracking-wide">
                          ⚠️ AI 风险隐患预警通知
                        </div>
                        <div className="bg-red-50/50 border border-red-200 rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-danger-red">
                            <AlertCircle className="h-4.5 w-4.5 animate-bounce" />
                            <span>中度风险警告</span>
                          </div>
                          <div className="space-y-1 text-text-secondary">
                            {activeWorker.id === 'w4' ? (
                              <>
                                <div>- <strong>健康禁忌风险：</strong> 体检诊断含有高血压且高空禁忌，已拦截其高空施工派工单！</div>
                                <div>- <strong>违章高频风险：</strong> 发生过习惯性不戴安全帽违章，需进行三级安全重考。</div>
                              </>
                            ) : (
                              <>
                                <div>- <strong>证件临期预警：</strong> 塔吊特种特业证将在 90 天内到期，请督促其到建委端口申请延期审核。</div>
                                <div>- <strong>连续作业提醒：</strong> 最近连续作业超过 14 天，建议适当排班轮休防止疲劳操作。</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              TAB 2: 人才对比与报告分析 (Dynamic workbench)
              ========================================== */}
          {activeTab === 'compare-analytics' && (
            <div className="flex-grow flex flex-col gap-6 text-xs">
              
              <div className="grid grid-cols-2 gap-6 bg-slate-50 border p-4 rounded-lg">
                <div>
                  <label className="block text-text-secondary font-bold mb-1.5">对比人才 A</label>
                  <select value={compareWorkerAId} onChange={(e) => setCompareWorkerAId(e.target.value)} className="w-full bg-white border rounded px-3 py-2 text-xs">
                    {INITIAL_WORKERS.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.jobType} - {w.score}分)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-text-secondary font-bold mb-1.5">对比人才 B</label>
                  <select value={compareWorkerBId} onChange={(e) => setCompareWorkerBId(e.target.value)} className="w-full bg-white border rounded px-3 py-2 text-xs">
                    {INITIAL_WORKERS.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.jobType} - {w.score}分)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 flex-grow">
                {/* Panel Worker A */}
                {(() => {
                  const workerA = INITIAL_WORKERS.find(w => w.id === compareWorkerAId)
                  if (!workerA) return null
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
                      <div className="flex items-center gap-3 border-b pb-3">
                        <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                          {workerA.name.slice(0, 1)}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-text-dark">{workerA.name}</span>
                          <span className="bg-slate-100 text-text-secondary text-[10px] px-1.5 rounded ml-2">{workerA.jobType}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>综合评分：<strong className="text-[#52C41A] font-mono text-sm">{workerA.score}分</strong> ({workerA.grade})</div>
                        <div>所属企业：<span className="text-text-secondary">{workerA.enterprise}</span></div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {workerA.tags.map((t, idx) => <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[9.5px] border">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* Panel Worker B */}
                {(() => {
                  const workerB = INITIAL_WORKERS.find(w => w.id === compareWorkerBId)
                  if (!workerB) return null
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
                      <div className="flex items-center gap-3 border-b pb-3">
                        <div className="h-8 w-8 bg-[#1890FF] text-white rounded-full flex items-center justify-center font-bold text-xs">
                          {workerB.name.slice(0, 1)}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-text-dark">{workerB.name}</span>
                          <span className="bg-slate-100 text-text-secondary text-[10px] px-1.5 rounded ml-2">{workerB.jobType}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>综合评分：<strong className="text-[#52C41A] font-mono text-sm">{workerB.score}分</strong> ({workerB.grade})</div>
                        <div>所属企业：<span className="text-text-secondary">{workerB.enterprise}</span></div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {workerB.tags.map((t, idx) => <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[9.5px] border">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ======================================================================
          DRAWER: EXPORT PDF PREVIEW (PDF 报告导出及预览右侧抽屉)
          ====================================================================== */}
      {isPdfDrawerOpen && activeWorker && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={() => setIsPdfDrawerOpen(false)}></div>

          {/* PDF Page layout */}
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="p-4 border-b bg-slate-50 border-slate-200 flex items-center justify-between shrink-0 text-xs">
              <h3 className="font-black text-text-dark flex items-center gap-1.5">
                <Printer className="h-4.5 w-4.5 text-primary" />
                <span>产业工人人才数字画像 PDF 报告模板预览</span>
              </h3>
              <button onClick={() => setIsPdfDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Printable canvas container */}
            <div className="flex-1 p-8 overflow-y-auto bg-slate-100 flex justify-center">
              
              {/* Simulated A4 Page */}
              <div className="bg-white p-8 shadow-lg border rounded text-left space-y-6 max-w-xl w-full text-xs font-serif leading-relaxed text-text-dark">
                
                {/* Header branding */}
                <div className="flex justify-between items-start border-b-2 border-primary pb-3">
                  <div>
                    <h1 className="text-lg font-black tracking-wide text-[#11356A]">建筑产业工人数字画像评估报告</h1>
                    <span className="text-[9px] text-text-secondary font-sans font-semibold">国家建筑产业工人智能评价体系评估中心</span>
                  </div>
                  <QrCode className="h-10 w-10 text-slate-800" />
                </div>

                {/* Grid identity */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 border rounded">
                  <div className="h-14 w-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm font-sans">
                    {activeWorker.name.slice(0, 1)}
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 flex-grow font-sans text-[10px]">
                    <div><strong>姓名：</strong> {activeWorker.name}</div>
                    <div><strong>工种分类：</strong> {activeWorker.jobType}</div>
                    <div><strong>身份证号：</strong> {activeWorker.idCard}</div>
                    <div><strong>工作年限：</strong> {activeWorker.years} 年</div>
                    <div className="col-span-2"><strong>所属企业：</strong> {activeWorker.enterprise}</div>
                  </div>
                </div>

                {/* Score & Radar */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 border p-4 rounded flex flex-col items-center justify-center text-center">
                    <span className="font-sans font-bold text-[10px] text-text-secondary uppercase">综合评价大模型得分</span>
                    <div className="text-4xl font-black font-mono text-[#52C41A] mt-2">{activeWorker.score}</div>
                    <span className="px-2 py-0.5 rounded font-sans font-bold text-[10px] text-white bg-[#52C41A] mt-2">
                      {activeWorker.grade}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 border p-3 rounded font-sans space-y-1.5 text-[9.5px]">
                    <div className="font-bold border-b pb-1 mb-1">五维画像评分细节：</div>
                    <div>职业能力得：{activeWorker.radar.ability || activeWorker.radar.capability}分</div>
                    <div>履约天数得：{activeWorker.radar.fulfill || activeWorker.radar.attendance}分</div>
                    <div>安全质量得：{activeWorker.radar.safety}分</div>
                    <div>信用管理得：{activeWorker.radar.credit}分</div>
                    <div>健康档案得：{activeWorker.radar.health}分</div>
                  </div>
                </div>

                {/* AI Comprehensive report */}
                <div className="bg-indigo-50/50 border border-indigo-150 p-4 rounded-lg font-sans">
                  <span className="font-bold text-[#11356A] block text-[10.5px]">🧠 AI 大脑画像审计结论：</span>
                  <p className="text-[10px] text-indigo-900 mt-1.5 leading-relaxed">
                    该工人近一年履约表现优秀，出勤稳定达标，且其特种设备执业证书经 OCR 校对处于真实有效状态。安全违规处罚记录零异常。
                    建议：<strong>符合骨干班组长培养条件</strong>。
                  </p>
                </div>

                {/* Footer timestamp */}
                <div className="text-right text-[8px] text-slate-400 font-sans pt-12 border-t mt-8">
                  防伪验证编码: RPT_EVAL_987625143 | 出具时间: 2026-07-09
                </div>

              </div>

            </div>

            {/* Footer operations */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsPdfDrawerOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-text-dark font-bold rounded shadow-sm text-xs cursor-pointer"
              >
                关闭预览
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerNotification('PDF 画像评估报告开始本地序列化生成...', 'success')
                  setIsPdfDrawerOpen(false)
                }}
                className="px-5 py-2 bg-[#52C41A] hover:bg-emerald-600 text-white font-bold rounded shadow text-xs cursor-pointer flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                下载 PDF 报告文档
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

```

