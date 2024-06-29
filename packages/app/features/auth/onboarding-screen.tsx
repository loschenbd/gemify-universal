import { Onboarding, OnboardingStepInfo, StepContent } from '@my/ui'
import { Platform } from 'react-native'
import { Gem, BookOpenText, Mic } from '@tamagui/lucide-icons'
import React from 'react'
import { useRouter } from 'solito/router'

const steps: OnboardingStepInfo[] = [
  {
    theme: 'orange',
    Content: () => (
      <StepContent
        title="Record Your Words"
        icon={Mic}
        description="Record effortlessly from your phone."
      />
    ),
  },
  {
    theme: 'green',
    Content: () => (
      <StepContent
        title="Full Transcripts + Additional Insights"
        icon={BookOpenText}
        description="We'll create all kinds of facets for your word- main points, follow-up questions, supporting scriptures, and more!"
      />
    ),
  },
  {
    theme: 'blue',
    Content: () => (
      <StepContent
        title=" Daily Declarations"
        icon={Gem}
        description="Get a daily devotional including declarations based on your prophetic words"
      />
    ),
  },
]

/**
 * note: this screen is used as a standalone page on native and as a sidebar on auth layout on web
 */
export const OnboardingScreen = () => {
  const router = useRouter()
  return (
    <Onboarding
      autoSwipe
      onOnboarded={() => {
        if (Platform.OS === 'web') {
          // On web, navigate to sign-in instead
          router.push('/sign-in')
        } else {
          // On native, keep the sign-up navigation
          router.push('/sign-up')
        }
      }}
      steps={steps}
    />
  )
}
