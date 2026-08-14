'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Settings, LogOut, Moon, Sun, Bell, Lock } from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const storedTheme = localStorage.getItem('elbatal-theme') as 'light' | 'dark' | null
    const preferredTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

    setTheme(preferredTheme)
    document.documentElement.classList.toggle('dark', preferredTheme === 'dark')
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('elbatal-theme', theme)
  }, [mounted, theme])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (!mounted) {
    return <div>جاري التحميل...</div>
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          الإعدادات
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          إدارة إعدادات حسابك ولوحة التحكم
        </p>
      </div>

      {/* Account Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5" />
            حسابك
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Email Display */}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              البريد الإلكتروني
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-gray-900 dark:text-white font-medium break-all">
                {user?.email || 'N/A'}
              </p>
            </div>
          </div>

          {/* Account Info */}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              آخر تحديث للبيانات
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-gray-900 dark:text-white">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString(
                      'ar-SA'
                    )
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg font-semibold transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            المظهر
          </h2>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            اختر بين الوضع الفاتح والوضع الداكن
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Light Mode */}
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-red-600 bg-red-50 dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                فاتح
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Light Mode
              </p>
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-red-600 bg-red-50 dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                داكن
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Dark Mode
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            الإشعارات
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-gray-900 dark:text-white font-medium">
                إشعارات الطلبات الجديدة
              </span>
            </label>
            <span className="text-xs bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 px-2 py-1 rounded">
              مفعل
            </span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-gray-900 dark:text-white font-medium">
                إشعارات تغيير حالة الطلبات
              </span>
            </label>
            <span className="text-xs bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 px-2 py-1 rounded">
              مفعل
            </span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-gray-900 dark:text-white font-medium">
                إشعارات مشاكل النظام
              </span>
            </label>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
              مطفأ
            </span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          عن التطبيق
        </h2>

        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              لوحة تحكم El Batal Express
            </p>
            <p>الإصدار 0.1.0</p>
          </div>

          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-2">
              التقنيات المستخدمة:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Next.js 15.1</li>
              <li>React 19</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Firebase</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p>
              صُنعت بـ ❤️ لـ El Batal Express |{' '}
              <a href="#" className="text-red-600 hover:text-red-700">
                سياسة الخصوصية
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
