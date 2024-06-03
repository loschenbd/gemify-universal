import posthog from 'posthog-js'
import { useEffect } from 'react'

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })
  }, [])

  return <>{children}</>
}
