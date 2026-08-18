import { useState } from 'react'
import { AlertTriangle, Bell, Building2, CheckCircle2, Cpu, LayoutDashboard, Sliders, Users } from 'lucide-react'
import DataAcquisitionCenter from './pages/MvpDataAcquisitionCenter'
import EnterpriseDashboard from './pages/EnterpriseDashboard'
import IndexCenter from './pages/MvpIndexCenter'
import PortraitCenter from './pages/MvpPortraitCenter'
import HomeDashboard from './pages/HomeDashboard'

const menus = [
  { key: 'enterprise-dashboard', label: '企业数据看板', icon: Building2 },
  { key: 'dashboard', label: '首页看板', icon: LayoutDashboard },
  { key: 'acquisition', label: '数据采集中心', icon: Cpu },
  { key: 'index', label: '工人评价模型', icon: Sliders },
  { key: 'portrait', label: '工人画像与工人库', icon: Users }
]

export default function AppFixed() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [dashboardProjectId, setDashboardProjectId] = useState('P001')
  const [notifications, setNotifications] = useState([])

  const openProjectFromEnterprise = (projectId) => {
    setDashboardProjectId(projectId)
    setActiveMenu('dashboard')
  }

  const triggerNotification = (message, type = 'success') => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id))
    }, 2800)
  }

  const ActivePage = {
    'enterprise-dashboard': EnterpriseDashboard,
    dashboard: HomeDashboard,
    acquisition: DataAcquisitionCenter,
    index: IndexCenter,
    portrait: PortraitCenter
  }[activeMenu]

  const activeLabel = menus.find((item) => item.key === activeMenu)?.label

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-gray text-text-dark">
      <div className="fixed right-5 top-5 z-50 flex flex-col gap-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex min-w-[280px] items-start gap-3 rounded border border-border-gray bg-white px-4 py-3 shadow-lg"
          >
            {item.type === 'warning' ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 text-warning-orange" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-success-green" />
            )}
            <span className="text-sm leading-5">{item.message}</span>
          </div>
        ))}
      </div>

      <aside className="flex w-[248px] shrink-0 flex-col border-r border-border-gray bg-white">
        <div className="border-b border-border-gray px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-white">
              <span className="text-lg font-bold">评</span>
            </div>
            <div>
              <div className="text-base font-bold">工人智能评价平台</div>
              <div className="text-xs text-text-secondary">课题验收 MVP 版</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {menus.map((item) => {
            const Icon = item.icon
            const active = activeMenu === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveMenu(item.key)}
                className={`flex w-full items-center gap-3 border-r-3 px-5 py-3 text-left text-[13px] transition ${
                  active
                    ? 'border-r-primary bg-[#E6F7FF] font-bold text-primary'
                    : 'border-r-transparent text-text-dark hover:bg-[#F5F7FA]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-border-gray p-4">
          <div className="rounded bg-[#F6FAFF] p-3 text-xs leading-5 text-text-secondary">
            <div className="mb-1 font-semibold text-text-dark">V1.0 MVP 目标</div>
            打通“数据采集 - 指标配置 - 模型计算 - 标签生成 - 画像展示”的最小闭环。
          </div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between bg-primary px-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold">{activeLabel}</span>
            <span className="rounded bg-white/15 px-2 py-0.5 text-xs">MVP 精简实施版</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Bell className="h-4 w-4" />
            <span>管理员</span>
          </div>
        </header>

        <main className={`min-h-0 flex-1 ${activeMenu === 'dashboard' || activeMenu === 'enterprise-dashboard' ? 'overflow-hidden p-3' : 'overflow-auto p-6'}`}>
          <ActivePage
            triggerNotification={triggerNotification}
            onNavigate={setActiveMenu}
            projectId={activeMenu === 'dashboard' ? dashboardProjectId : undefined}
            onOpenProject={activeMenu === 'enterprise-dashboard' ? openProjectFromEnterprise : undefined}
          />
        </main>
      </section>
    </div>
  )
}
