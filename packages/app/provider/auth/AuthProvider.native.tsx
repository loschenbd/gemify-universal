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

const setUserContext = (user: User | null) => {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      // Add any additional user properties
    })
  } else {
    Sentry.setUser(null)
  }
}

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
        setUserContext(newSession?.user ?? null)
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'Session retrieved',
          level: 'info',
          data: { session: newSession },
        })
      })
      .catch((error) => {
        setError(new AuthError(error.message))
        Sentry.captureException(error)
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'Error retrieving session',
          level: 'error',
          data: { error: error.message },
        })
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUserContext(newSession?.user ?? null)

      switch (_event) {
        case 'SIGNED_IN':
          Sentry.addBreadcrumb({
            category: 'auth',
            message: 'User signed in',
            level: 'info',
            data: { session: newSession },
          })
          break
        case 'SIGNED_OUT':
          Sentry.addBreadcrumb({
            category: 'auth',
            message: 'User signed out',
            level: 'info',
          })
          break
        case 'USER_UPDATED':
          Sentry.addBreadcrumb({
            category: 'auth',
            message: 'User updated',
            level: 'info',
            data: { session: newSession },
          })
          break
        case 'PASSWORD_RECOVERY':
          Sentry.addBreadcrumb({
            category: 'auth',
            message: 'Password recovery initiated',
            level: 'info',
          })
          break
        default:
          Sentry.addBreadcrumb({
            category: 'auth',
            message: 'Unknown auth event',
            level: 'info',
            data: { event: _event },
          })
      }
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
