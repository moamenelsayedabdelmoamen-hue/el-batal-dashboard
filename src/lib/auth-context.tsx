'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { auth } from './firebase'

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setUser(null)
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    if (!auth) {
      return
    }

    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
