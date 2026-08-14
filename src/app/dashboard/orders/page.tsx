'use client'

import { useEffect, useState } from 'react'
import { Order, OrderStatus } from '@/types'
import { getOrders } from '@/lib/firestore'
import { LoadingState, EmptyState, ErrorState, StatCard } from '@/components/ui/Cards'
import { ShoppingCart, Search, Filter, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const statusLabels: Record<OrderStatus, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  delivered: 'تم التوصيل',
  cancelled: 'ملغى',
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200',
  confirmed:
    'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200',
  delivered:
    'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200',
  cancelled: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.includes(searchTerm) ||
      order.customerName.includes(searchTerm) ||
      order.restaurantName.includes(searchTerm)

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState onRetry={fetchOrders} />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          الطلبات
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          إدارة جميع طلبات التوصيل
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12">
          <EmptyState
            title="لا توجد طلبات حاليًا"
            description="سيتم عرض الطلبات هنا عند استقبالها"
            icon={ShoppingCart}
          />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="إجمالي الطلبات"
              value={orders.length}
              icon={ShoppingCart}
              color="primary"
            />
            <StatCard
              title="قيد الانتظار"
              value={orders.filter((o) => o.status === 'pending').length}
              icon={ShoppingCart}
              color="accent"
            />
            <StatCard
              title="مؤكدة"
              value={orders.filter((o) => o.status === 'confirmed').length}
              icon={ShoppingCart}
              color="gray"
            />
            <StatCard
              title="مكتملة"
              value={orders.filter((o) => o.status === 'delivered').length}
              icon={ShoppingCart}
              color="green"
            />
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث برقم الطلب أو اسم العميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as OrderStatus | 'all')
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="delivered">تم التوصيل</option>
                  <option value="cancelled">ملغى</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              عدد النتائج: {filteredOrders.length} من {orders.length} طلب
            </p>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {filteredOrders.length === 0 ? (
              <EmptyState
                title="لا توجد نتائج"
                description="لم نجد طلبات مطابقة للبحث"
                icon={ShoppingCart}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        رقم الطلب
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        العميل
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        المطعم
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        الكابتن
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        السعر
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {order.restaurantName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {order.driverName || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              statusColors[order.status]
                            }`}
                          >
                            {statusLabels[order.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {order.price} ر.س
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
