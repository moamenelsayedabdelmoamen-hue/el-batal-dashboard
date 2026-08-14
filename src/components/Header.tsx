'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Moon, Sun, LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export function Header({ onMenuToggle, isMobileMenuOpen = false }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const storedTheme = localStorage.getItem('elbatal-theme') as 'light' | 'dark' | null
    const preferredTheme =
      storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

    setTheme(preferredTheme)
    document.documentElement.classList.toggle('dark', preferredTheme === 'dark')
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('elbatal-theme', theme)
  }, [theme, mounted])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold">
              ب
            </div>
            <span className="hidden sm:block font-bold text-lg text-gray-900 dark:text-white">
              El Batal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="تبديل المظهر"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                {user?.email || 'Admin'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors text-red-600 dark:text-red-400"
            aria-label="تسجيل الخروج"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
