'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'
import { AlertCircle, LogIn, Loader } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!auth || !isFirebaseConfigured) {
      setError('Firebase غير مُعد بشكل صحيح. تحقق من متغيرات البيئة في Vercel.')
      return
    }

    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (err: any) {
      const errorMessage = err.message || 'خطأ في تسجيل الدخول'
      if (errorMessage.includes('user-not-found')) {
        setError('البريد الإلكتروني غير مسجل')
      } else if (errorMessage.includes('wrong-password')) {
        setError('كلمة المرور غير صحيحة')
      } else if (errorMessage.includes('invalid-email')) {
        setError('صيغة البريد الإلكتروني غير صحيحة')
      } else {
        setError('خطأ في تسجيل الدخول. حاول مرة أخرى')
      }
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4">
            <span className="text-3xl font-bold text-primary-600">ب</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">El Batal</h1>
          <p className="text-primary-100">لوحة تحكم التوصيل</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            تسجيل الدخول
          </h2>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@elbatal.com"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  جاري التحميل...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  دخول
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            لوحة تحكم مخصصة | El Batal Express
          </p>
        </div>
      </div>
    </div>
  )
}
