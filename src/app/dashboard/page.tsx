'use client'

import { useEffect, useState } from 'react'
import { DashboardStats } from '@/types'
import { getDashboardStats } from '@/lib/firestore'
import { StatCard, LoadingState, EmptyState } from '@/components/ui/Cards'
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  Users,
  Store,
  BarChart3,
  AlertCircle,
} from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getDashboardStats()
      setStats(data)
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            حدث خطأ في تحميل البيانات
          </p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    )
  }

  const hasData =
    stats &&
    (stats.totalOrders > 0 ||
      stats.totalDrivers > 0 ||
      stats.totalRestaurants > 0 ||
      stats.totalCustomers > 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          لوحة التحكم
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          مرحبًا بك في لوحة تحكم El Batal Express
        </p>
      </div>

      {!hasData ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12">
          <EmptyState
            title="لا توجد بيانات حاليًا"
            description="قم بإضافة طلبات وكباتن ومطاعم لعرض الإحصائيات هنا"
            icon={BarChart3}
          />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="إجمالي الطلبات"
              value={stats?.totalOrders || 0}
              icon={ShoppingCart}
              color="primary"
            />
            <StatCard
              title="طلبات جديدة"
              value={stats?.newOrders || 0}
              icon={Package}
              color="accent"
            />
            <StatCard
              title="قيد التوصيل"
              value={stats?.deliveryOrders || 0}
              icon={Truck}
              color="gray"
            />
            <StatCard
              title="مكتملة"
              value={stats?.completedOrders || 0}
              icon={CheckCircle}
              color="green"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="عدد الكباتن"
              value={stats?.totalDrivers || 0}
              icon={Users}
              color="primary"
            />
            <StatCard
              title="عدد المطاعم"
              value={stats?.totalRestaurants || 0}
              icon={Store}
              color="accent"
            />
            <StatCard
              title="عدد العملاء"
              value={stats?.totalCustomers || 0}
              icon={Users}
              color="gray"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              اختصارات سريعة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/dashboard/orders"
                className="p-4 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors text-center font-medium"
              >
                عرض الطلبات
              </a>
              <a
                href="/dashboard/drivers"
                className="p-4 rounded-lg bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-900 transition-colors text-center font-medium"
              >
                عرض الكباتن
              </a>
              <a
                href="/dashboard/restaurants"
                className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center font-medium"
              >
                عرض المطاعم
              </a>
              <a
                href="/dashboard/customers"
                className="p-4 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 transition-colors text-center font-medium"
              >
                عرض العملاء
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
