'use client'

import { useEffect, useState } from 'react'
import { Customer } from '@/types'
import { getCustomers } from '@/lib/firestore'
import { LoadingState, EmptyState, ErrorState, StatCard } from '@/components/ui/Cards'
import { Users, Search, Filter } from 'lucide-react'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    'all'
  )

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      console.error('Error fetching customers:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      (customer.email?.includes(searchTerm) || false)

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && customer.isActive) ||
      (statusFilter === 'inactive' && !customer.isActive)

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState onRetry={fetchCustomers} />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          العملاء
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          إدارة بيانات العملاء
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12">
          <EmptyState
            title="لا يوجد عملاء مسجلين"
            description="لم يتم العثور على أي عملاء في النظام"
            icon={Users}
          />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="إجمالي العملاء"
              value={customers.length}
              icon={Users}
              color="primary"
            />
            <StatCard
              title="نشطين"
              value={customers.filter((c) => c.isActive).length}
              icon={Users}
              color="green"
            />
            <StatCard
              title="غير نشطين"
              value={customers.filter((c) => !c.isActive).length}
              icon={Users}
              color="gray"
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
                  placeholder="ابحث باسم العميل أو الهاتف أو البريد..."
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
                    setStatusFilter(
                      e.target.value as 'all' | 'active' | 'inactive'
                    )
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              عدد النتائج: {filteredCustomers.length} من {customers.length} عميل
            </p>
          </div>

          {/* Customers Table */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {filteredCustomers.length === 0 ? (
              <EmptyState
                title="لا توجد نتائج"
                description="لم نجد عملاء مطابقين للبحث"
                icon={Users}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        الاسم
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        الهاتف
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        البريد الإلكتروني
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        عدد الطلبات
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        إجمالي الإنفاق
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {customer.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {customer.email || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              customer.isActive
                                ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {customer.isActive ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {customer.totalOrders}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {customer.totalSpent} ر.س
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
