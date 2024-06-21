import * as Sentry from '@sentry/react-native'
import { Session, SessionContext as SessionContextHelper } from '@supabase/auth-helpers-react'
import { AuthError, User } from '@supabase/supabase-js'
import { supabase } from 'app/utils/supabase/client.native'
import { router, useSegments } from 'expo-router'
import { createContext, useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { AuthProviderProps } from './AuthProvider'
import { AuthStateChangeHandler } from './AuthStateChangeHandler'

export const SessionContext = createContext<SessionContextHelper>({
  session: null,
  error: null,
  isLoading: false,
  supabaseClient: supabase,
})

export const AuthProvider = ({ children, initialSession }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(initialSession || null)
  const [error, setError] = useState<AuthError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  useProtectedRoute(session?.user ?? null)
  useEffect(() => {
    setIsLoading(true)
    supabase.auth
      .getSession()
      .then(({ data: { session: newSession } }) => {
        setSession(newSession)
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'Session retrieved',
          data: { session: newSession },
        })
      })
      .catch((error) => {
        setError(new AuthError(error.message))
        Sentry.captureException(error)
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Auth state changed',
        data: { event: _event, session: newSession },
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <SessionContext.Provider
      value={
        session
          ? {
              session,
              isLoading: false,
              error: null,
              supabaseClient: supabase,
            }
          : error
          ? {
              error,
              isLoading: false,
              session: null,
              supabaseClient: supabase,
            }
          : {
              error: null,
              isLoading,
              session: null,
              supabaseClient: supabase,
            }
      }
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

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      replaceRoute('/onboarding')
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      replaceRoute('/')
    }
  }, [user, segments])
}

/**
 * temporary fix
 *
 * see https://github.com/expo/router/issues/740
 * see https://github.com/expo/router/issues/745
 *  */
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
