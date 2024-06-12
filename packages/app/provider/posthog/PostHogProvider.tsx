import posthog from 'posthog-js'

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })
  }
  return <>{children}</>
}
