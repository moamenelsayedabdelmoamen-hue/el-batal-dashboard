import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color?: 'primary' | 'accent' | 'gray' | 'green'
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend,
}: StatCardProps) {
  const colorClasses = {
    primary:
      'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400',
    accent:
      'bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    green: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p
              className={`text-xs font-medium mt-2 ${
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && (
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 mb-4">
          <Icon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'حدث خطأ',
  message = 'حدث خطأ أثناء تحميل البيانات',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 mb-4">
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
          !
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          حاول مرة أخرى
        </button>
      )}
    </div>
  )
}
