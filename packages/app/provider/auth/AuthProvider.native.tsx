import { Session, SessionContext as SessionContextHelper } from '@supabase/auth-helpers-react'
import { AuthError, User } from '@supabase/supabase-js'
import { supabase } from 'app/utils/supabase/client.native'
import { router, useSegments } from 'expo-router'
import { createContext, useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { AuthProviderProps } from './AuthProvider'
import { AuthStateChangeHandler } from './AuthStateChangeHandler'

interface SessionContextType {
  session: Session | null
  error: AuthError | null
  isLoading: boolean
  supabaseClient: typeof supabase
}

export const SessionContext = createContext<SessionContextType>({
  session: null,
  error: null,
  isLoading: false,
  supabaseClient: supabase,
})

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession ?? null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setSession(session)
        setIsLoading(false)
        setError(null)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setIsLoading(false)
        setError(null)
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(session)
      } else if (event === 'USER_UPDATED') {
        setSession(session)
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  useProtectedRoute(session?.user ?? null)

  return (
    <SessionContext.Provider
      value={{
        session: session ?? null,
        isLoading,
        error: error ?? null,
        supabaseClient: supabase,
      }}
    >
      <AuthStateChangeHandler />
      {children}
    </SessionContext.Provider>
  )
}

export function useProtectedRoute(user: User | null) {
  const segments = useSegments()

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'

    if (!user && !inAuthGroup) {
      replaceRoute('/onboarding')
    } else if (user && inAuthGroup) {
      replaceRoute('/')
    }
  }, [user, segments])
}

const replaceRoute = (href: string) => {
  if (Platform.OS === 'ios') {
    setTimeout(() => {
      router.replace(href)
    }, 1)
  } else {
    setImmediate(() => {
      router.replace(href)
    })
  }
}
