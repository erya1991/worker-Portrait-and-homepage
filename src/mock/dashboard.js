const dashboardSnapshots = {
  p001: {
    scope: { projectId: 'P001', projectName: '北京CBD东区超高层项目', permissionScope: '当前授权项目', updatedAt: '2026-08-04 10:30' },
    overview: {
      workers: { onSite: 128, registered: 136, departed: 8, teamCount: 12 },
      attendance: { rate: 93.3, expected: 120, present: 112, missingEntry: 3, missingExit: 4 },
      contracts: { signRate: 90.6, active: 116, signing: 8, incomplete: 4, expiring: 5, total: 128 },
      ai: { matched: 364, stranger: 18, online: 9, totalDevices: 10 },
      evaluation: { averageScore: 86.8, covered: 120, required: 128 }
    },
    attendanceTrend: [
      { date: '07-29', present: 110 }, { date: '07-30', present: 113 },
      { date: '07-31', present: 111 }, { date: '08-01', present: 114 },
      { date: '08-02', present: 108 }, { date: '08-03', present: 111 },
      { date: '今日', present: 112 }
    ],
    teamDistribution: [{ name: '钢筋一班', value: 26 }, { name: '架子二班', value: 22 }, { name: '机电安装班', value: 18 }, { name: '其他班组', value: 62 }],
    aiTrend: [
      { date: '07-29', value: 42 }, { date: '07-30', value: 51 }, { date: '07-31', value: 48 },
      { date: '08-01', value: 56 }, { date: '08-02', value: 39 }, { date: '08-03', value: 45 }, { date: '今日', value: 47 }
    ],
    contractTrend: [
      { month: '2026-02', value: 12 }, { month: '2026-03', value: 16 }, { month: '2026-04', value: 18 },
      { month: '2026-05', value: 14 }, { month: '2026-06', value: 20 }, { month: '2026-07', value: 15 }
    ],
    evaluation: {
      batchName: '2026 年 7 月工人评价批次', status: '部分成功', completedAt: '2026-08-03 23:10', dataCutoff: '2026-07-31',
      grades: [{ label: 'A', value: 24, color: '#52C41A' }, { label: 'B', value: 52, color: '#1890FF' }, { label: 'C', value: 36, color: '#FAAD14' }, { label: 'D', value: 0, color: '#FF4D4F' }],
      dimensions: [{ label: '职业资质', value: 86 }, { label: '履约能力', value: 88 }, { label: '安全行为', value: 91 }, { label: '工作效率', value: 84 }, { label: '信用记录', value: 90 }],
      talent: { onSite: 128, reusable: 64, validCertificates: 101 }
    }
  },
  p002: {
    scope: { projectId: 'P002', projectName: '轨道交通8号线项目', permissionScope: '当前授权项目', updatedAt: '2026-08-04 10:28' },
    overview: {
      workers: { onSite: 86, registered: 94, departed: 8, teamCount: 8 },
      attendance: { rate: 85.2, expected: 81, present: 69, missingEntry: 2, missingExit: 5 },
      contracts: { signRate: 86.0, active: 74, signing: 6, incomplete: 6, expiring: 2, total: 86 },
      ai: { matched: 218, stranger: 10, online: 7, totalDevices: 9 },
      evaluation: { averageScore: 81.2, covered: 78, required: 86 }
    },
    attendanceTrend: [
      { date: '07-29', present: 72 }, { date: '07-30', present: 70 },
      { date: '07-31', present: 71 }, { date: '08-01', present: 74 },
      { date: '08-02', present: 68 }, { date: '08-03', present: 69 },
      { date: '今日', present: 69 }
    ],
    teamDistribution: [{ name: '泥工一班', value: 21 }, { name: '木工二班', value: 18 }, { name: '水电班组', value: 15 }, { name: '其他班组', value: 32 }],
    aiTrend: [
      { date: '07-29', value: 30 }, { date: '07-30', value: 35 }, { date: '07-31', value: 32 },
      { date: '08-01', value: 38 }, { date: '08-02', value: 27 }, { date: '08-03', value: 34 }, { date: '今日', value: 31 }
    ],
    contractTrend: [
      { month: '2026-02', value: 8 }, { month: '2026-03', value: 11 }, { month: '2026-04', value: 10 },
      { month: '2026-05', value: 12 }, { month: '2026-06', value: 13 }, { month: '2026-07', value: 9 }
    ],
    evaluation: {
      batchName: '2026 年 7 月工人评价批次', status: '成功', completedAt: '2026-07-31 22:10', dataCutoff: '2026-07-28',
      grades: [{ label: 'A', value: 12, color: '#52C41A' }, { label: 'B', value: 31, color: '#1890FF' }, { label: 'C', value: 28, color: '#FAAD14' }, { label: 'D', value: 2, color: '#FF4D4F' }],
      dimensions: [{ label: '职业资质', value: 82 }, { label: '履约能力', value: 79 }, { label: '安全行为', value: 84 }, { label: '工作效率', value: 78 }, { label: '信用记录', value: 83 }],
      talent: { onSite: 86, reusable: 39, validCertificates: 64 }
    }
  }
}

export const dashboardProjects = Object.values(dashboardSnapshots).map(({ scope }) => ({ id: scope.projectId, name: scope.projectName }))

export function getDashboardOverview(projectId = 'P001') {
  return dashboardSnapshots[projectId.toLowerCase()] || dashboardSnapshots.p001
}
