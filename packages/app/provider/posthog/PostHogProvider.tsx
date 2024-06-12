import posthog from 'posthog-js'
import { useEffect } from 'react'

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    console.log('Vercel Environment Variables:')
    console.log('NEXT_PUBLIC_POSTHOG_KEY:', process.env.NEXT_PUBLIC_POSTHOG_KEY)
    console.log('NEXT_PUBLIC_POSTHOG_HOST:', process.env.NEXT_PUBLIC_POSTHOG_HOST)

    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      })
    }
  }, [])

  return <>{children}</>
}
