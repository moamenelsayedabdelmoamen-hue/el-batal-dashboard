import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/DashboardLayout'

export const metadata: Metadata = {
  title: 'لوحة التحكم - El Batal Express',
  description: 'لوحة التحكم الرئيسية',
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
