'use client'

import { useState, ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { ProtectedRoute } from './ProtectedRoute'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header
          onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isMobileMenuOpen={isMobileSidebarOpen}
        />
        <div className="flex">
          <Sidebar
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
