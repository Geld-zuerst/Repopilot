'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, clearTokens, getAccessToken, login, register, saveTokens, type User } from '../lib/api'

type Session = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (username: string, email: string, password: string, password2: string) => Promise<void>
  signOut: () => void
  reloadUser: () => Promise<void>
}

const SessionContext = createContext<Session | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const reloadUser = useCallback(async () => {
    await Promise.resolve()
    if (!getAccessToken()) {
      setUser(null)
      return
    }
    try {
      setUser(await api<User>('/api/auth/profile/'))
    } catch {
      clearTokens()
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let active = true
    if (!getAccessToken()) {
      Promise.resolve().then(() => { if (active) setLoading(false) })
      return () => { active = false }
    }
    api<User>('/api/auth/profile/')
      .then((profile) => { if (active) setUser(profile) })
      .catch(() => {
        if (active) {
          clearTokens()
          setUser(null)
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password)
    saveTokens(response.tokens)
    setUser(response.user)
  }

  const signUp = async (username: string, email: string, password: string, password2: string) => {
    const response = await register(username, email, password, password2)
    saveTokens(response.tokens)
    setUser(response.user)
  }

  const signOut = () => {
    clearTokens()
    setUser(null)
  }

  return (
    <SessionContext.Provider value={{ user, loading, signIn, signUp, signOut, reloadUser }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const session = useContext(SessionContext)
  if (!session) throw new Error('useSession must be used inside AuthProvider')
  return session
}
