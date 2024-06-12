import { PostHogProvider as PostHogProviderNative } from 'posthog-react-native/lib/posthog-react-native'

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PostHogProviderNative
      apiKey={Constants.manifest.extra.POSTHOG_KEY}
      options={{
        host: Constants.manifest.extra.POSTHOG_HOST,
      }}
    >
      {children}
    </PostHogProviderNative>
  )
}
