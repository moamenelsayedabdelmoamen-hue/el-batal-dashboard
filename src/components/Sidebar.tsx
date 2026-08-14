'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Store,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'الرئيسية',
    href: '/dashboard',
  },
  {
    icon: ShoppingCart,
    label: 'الطلبات',
    href: '/dashboard/orders',
  },
  {
    icon: UserCheck,
    label: 'الكباتن',
    href: '/dashboard/drivers',
  },
  {
    icon: Store,
    label: 'المطاعم',
    href: '/dashboard/restaurants',
  },
  {
    icon: Users,
    label: 'العملاء',
    href: '/dashboard/customers',
  },
  {
    icon: BarChart3,
    label: 'الإحصائيات',
    href: '/dashboard/statistics',
  },
  {
    icon: Settings,
    label: 'الإعدادات',
    href: '/dashboard/settings',
  },
]

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 right-0 w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 transform transition-transform duration-300 z-30 ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              القائمة
            </h2>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </span>
                  {active && (
                    <ChevronRight className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg font-semibold transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
