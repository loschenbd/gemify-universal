import * as Sentry from '@sentry/react-native'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useEffect } from 'react'
import { useRouter } from 'solito/router'

const useRedirectAfterSignOut = () => {
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const signOutListener = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'User signed out',
          data: { event },
        })
        router.replace('/sign-in')
      }
    })

    return () => {
      signOutListener.data.subscription.unsubscribe()
    }
  }, [supabase, router])
}

export const AuthStateChangeHandler = () => {
  useRedirectAfterSignOut()
  return null
}
