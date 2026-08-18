const projectItems = [
  { projectId: 'P001', projectName: '北京CBD东区超高层项目', branchName: '北京分公司', onSiteWorkerCount: 128, attendanceRate: 93.3, contractSignRate: 90.6, evaluationCoverageRate: 93.8, aRate: 21.4 },
  { projectId: 'P002', projectName: '轨道交通8号线项目', branchName: '北京分公司', onSiteWorkerCount: 86, attendanceRate: 82.4, contractSignRate: 84.2, evaluationCoverageRate: 88.5, aRate: 16.4 },
  { projectId: 'P003', projectName: 'XX产业园项目', branchName: '华北分公司', onSiteWorkerCount: 214, attendanceRate: 87.1, contractSignRate: 86.5, evaluationCoverageRate: 81.3, aRate: 14.2 },
  { projectId: 'P004', projectName: 'XX住宅项目', branchName: '华东分公司', onSiteWorkerCount: 176, attendanceRate: 85.7, contractSignRate: 78.6, evaluationCoverageRate: 76.9, aRate: 11.8 },
  { projectId: 'P005', projectName: '城市绿心剧院机电安装项目', branchName: '华东分公司', onSiteWorkerCount: 92, attendanceRate: 89.9, contractSignRate: 88.2, evaluationCoverageRate: 90.1, aRate: 18.6 },
  { projectId: 'P006', projectName: '滨江综合管廊项目', branchName: '华南分公司', onSiteWorkerCount: 148, attendanceRate: 91.8, contractSignRate: 92.4, evaluationCoverageRate: 86.8, aRate: 20.1 },
  { projectId: 'P007', projectName: '机场三期扩建项目', branchName: '华南分公司', onSiteWorkerCount: 236, attendanceRate: 94.1, contractSignRate: 95.5, evaluationCoverageRate: 94.7, aRate: 24.5 },
  { projectId: 'P008', projectName: '西部能源基地项目', branchName: '西北分公司', onSiteWorkerCount: 119, attendanceRate: 88.6, contractSignRate: 89.1, evaluationCoverageRate: 79.4, aRate: 13.6 }
]

const extraProjects = Array.from({ length: 28 }, (_, index) => {
  const sequence = index + 9
  const attendanceRate = 87 + (sequence % 9) * 0.8
  const contractSignRate = 84 + (sequence % 10) * 1.1
  return {
    projectId: `P${String(sequence).padStart(3, '0')}`,
    projectName: `示例建设项目${String(sequence).padStart(2, '0')}`,
    branchName: ['北京分公司', '华东分公司', '华南分公司', '西北分公司'][index % 4],
    onSiteWorkerCount: 96 + (sequence % 8) * 17,
    attendanceRate: Math.round(attendanceRate * 10) / 10,
    contractSignRate: Math.round(contractSignRate * 10) / 10,
    evaluationCoverageRate: 78 + (sequence % 12) * 1.4,
    aRate: 12 + (sequence % 11) * 1.1
  }
})

const allProjects = [...projectItems, ...extraProjects]

export const organizationOptions = [
  { orgId: 'ORG001', name: '全公司', level: 1 },
  { orgId: 'BR001', name: '南京分公司', level: 2 },
  { orgId: 'BR002', name: '苏南分公司', level: 2 },
  { orgId: 'BR003', name: '华东分公司', level: 2 },
  { orgId: 'BR004', name: '华南分公司', level: 2 }
]

const trendValues = [
  [2898, 89.7], [2926, 90.1], [2942, 90.4], [2918, 89.9], [2960, 90.8],
  [2984, 91.1], [3002, 91.6], [2978, 90.9], [2996, 91.3], [3010, 91.8],
  [3022, 92.0], [2990, 91.5], [3008, 91.7], [3034, 92.2], [3042, 92.4],
  [3018, 91.9], [3038, 92.3], [3051, 92.6], [3044, 92.5], [3060, 92.8],
  [3048, 92.4], [3032, 92.1], [3058, 92.7], [3070, 93.0], [3064, 92.9],
  [3042, 92.5], [3028, 92.0], [3016, 91.8], [3036, 92.3], [3018, 92.6]
]

const attendanceTrend = trendValues.map(([present, rate], index) => {
  const day = String(index + 19).padStart(2, '0')
  return { date: `08-${day}`, present, rate }
})

export const enterpriseDashboardMock = {
  scope: {
    orgId: 'ORG001',
    orgName: '全公司',
    updatedAt: '2026-08-17 14:30'
  },
  summary: {
    activeProjectCount: 36,
    onSiteWorkerCount: 3258,
    attendance: { rate: 92.6, presentCount: 3018, expectedCount: 3260 },
    contracts: { signRate: 94.3, signedWorkerCount: 3856, requiredWorkerCount: 4088 },
    workerPool: { totalWorkerCount: 8260, averageScore: 85.6, scoreAvailable: true },
    cameraAi: { totalRecordCount: 6852, matchedCount: 6597 },
    aiCollection: { totalCount: 1268, confirmedCount: 1083 }
  },
  projects: {
    items: allProjects,
    total: allProjects.length,
    page: 1,
    pageSize: 5
  },
  attention: {
    lowAttendanceProjects: [
      { projectId: 'P002', projectName: '轨道交通8号线项目', value: 82.4 },
      { projectId: 'P004', projectName: 'XX住宅项目', value: 85.7 },
      { projectId: 'P003', projectName: 'XX产业园项目', value: 87.1 }
    ],
    lowContractProjects: [
      { projectId: 'P004', projectName: 'XX住宅项目', value: 78.6 },
      { projectId: 'P002', projectName: '轨道交通8号线项目', value: 84.2 },
      { projectId: 'P003', projectName: 'XX产业园项目', value: 86.5 }
    ]
  },
  workerPool: {
    tags: [
      { tagId: 'T-002', name: '履约稳定', value: 2386, property: '正向' },
      { tagId: 'T-003', name: '安全之星', value: 612, property: '正向' },
      { tagId: 'T-005', name: '健康合格', value: 4826, property: '正向' },
      { tagId: 'T-004', name: '重点关注', value: 128, property: '警示' }
    ],
    grades: [
      { label: 'A', value: 1286, color: '#52C41A' },
      { label: 'B', value: 3452, color: '#1890FF' },
      { label: 'C', value: 2876, color: '#FAAD14' },
      { label: 'D', value: 646, color: '#FF4D4F' }
    ]
  },
  attendanceTrend
}

export const enterpriseDashboardScenarios = {
  standard: enterpriseDashboardMock,
  noEvaluation: {
    ...enterpriseDashboardMock,
    summary: {
      ...enterpriseDashboardMock.summary,
      workerPool: { totalWorkerCount: 8260, averageScore: null, scoreAvailable: false }
    },
    workerPool: { ...enterpriseDashboardMock.workerPool, grades: [] }
  },
  emptyProjects: {
    ...enterpriseDashboardMock,
    scope: { ...enterpriseDashboardMock.scope, updatedAt: '2026-08-17 14:30' },
    summary: { ...enterpriseDashboardMock.summary, activeProjectCount: 0, onSiteWorkerCount: 0 },
    projects: { items: [], total: 0, page: 1, pageSize: 5 },
    attention: { lowAttendanceProjects: [], lowContractProjects: [] }
  }
}
