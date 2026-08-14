'use client'

import { useEffect, useState } from 'react'
import { Order, OrderStatus, Driver, Customer, Restaurant } from '@/types'
import {
  getOrders,
  getDrivers,
  getCustomers,
  getRestaurants,
} from '@/lib/firestore'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/Cards'
import { BarChart3, AlertCircle } from 'lucide-react'

interface Statistics {
  orders: {
    total: number
    byStatus: Record<OrderStatus, number>
    avgPrice: number
    totalRevenue: number
  }
  drivers: {
    total: number
    avgOrdersPerDriver: number
    avgRating: number
  }
  customers: {
    total: number
    avgOrdersPerCustomer: number
    avgSpendPerCustomer: number
  }
  restaurants: {
    total: number
    active: number
  }
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      setError(false)

      const [orders, drivers, customers, restaurants] = await Promise.all([
        getOrders(),
        getDrivers(),
        getCustomers(),
        getRestaurants(),
      ])

      // Calculate statistics
      const orderStats = {
        total: orders.length,
        byStatus: {
          pending: orders.filter((o) => o.status === 'pending').length,
          confirmed: orders.filter((o) => o.status === 'confirmed').length,
          delivered: orders.filter((o) => o.status === 'delivered').length,
          cancelled: orders.filter((o) => o.status === 'cancelled').length,
        },
        avgPrice:
          orders.length > 0
            ? orders.reduce((sum, o) => sum + o.price, 0) / orders.length
            : 0,
        totalRevenue: orders
          .filter((o) => o.status === 'delivered')
          .reduce((sum, o) => sum + o.price, 0),
      }

      const driverStats = {
        total: drivers.length,
        avgOrdersPerDriver:
          drivers.length > 0
            ? drivers.reduce((sum, d) => sum + d.completedOrders, 0) /
              drivers.length
            : 0,
        avgRating:
          drivers.length > 0
            ? drivers.reduce((sum, d) => sum + (d.rating || 0), 0) /
              drivers.length
            : 0,
      }

      const customerStats = {
        total: customers.length,
        avgOrdersPerCustomer:
          customers.length > 0
            ? customers.reduce((sum, c) => sum + c.totalOrders, 0) /
              customers.length
            : 0,
        avgSpendPerCustomer:
          customers.length > 0
            ? customers.reduce((sum, c) => sum + c.totalSpent, 0) /
              customers.length
            : 0,
      }

      const restaurantStats = {
        total: restaurants.length,
        active: restaurants.filter((r) => r.isActive).length,
      }

      setStats({
        orders: orderStats,
        drivers: driverStats,
        customers: customerStats,
        restaurants: restaurantStats,
      })
    } catch (err) {
      console.error('Error fetching statistics:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState onRetry={fetchStatistics} />
  }

  if (!stats) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12">
        <EmptyState
          title="لا توجد بيانات"
          description="لا توجد إحصائيات متاحة حاليًا"
          icon={BarChart3}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          الإحصائيات
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          تحليل شامل لأداء النظام
        </p>
      </div>

      {/* Orders Statistics */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          إحصائيات الطلبات
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              إجمالي الطلبات
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.orders.total}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              متوسط السعر
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.orders.avgPrice.toFixed(2)} ر.س
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              إجمالي الإيرادات
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.orders.totalRevenue} ر.س
            </p>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            توزيع الطلبات حسب الحالة
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.orders.byStatus.pending}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                قيد الانتظار
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {stats.orders.byStatus.confirmed}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                مؤكدة
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {stats.orders.byStatus.delivered}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                مكتملة
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950">
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {stats.orders.byStatus.cancelled}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                ملغاة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Drivers Statistics */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          إحصائيات الكباتن
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              إجمالي الكباتن
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.drivers.total}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              متوسط الطلبات لكل كابتن
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.drivers.avgOrdersPerDriver.toFixed(1)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              متوسط التقييم
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.drivers.avgRating.toFixed(2)} ⭐
            </p>
          </div>
        </div>
      </div>

      {/* Customers Statistics */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          إحصائيات العملاء
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              إجمالي العملاء
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.customers.total}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              متوسط الطلبات لكل عميل
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.customers.avgOrdersPerCustomer.toFixed(1)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              متوسط الإنفاق لكل عميل
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.customers.avgSpendPerCustomer.toFixed(2)} ر.س
            </p>
          </div>
        </div>
      </div>

      {/* Restaurants Statistics */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          إحصائيات المطاعم
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              إجمالي المطاعم
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.restaurants.total}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              المطاعم النشطة
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.restaurants.active}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
