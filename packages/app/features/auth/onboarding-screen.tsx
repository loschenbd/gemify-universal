import { Onboarding, OnboardingStepInfo, StepContent } from '@my/ui'
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
        title="Get Full Transcripts"
        icon={BookOpenText}
        description="Listen or read through the full word any time."
      />
    ),
  },
  {
    theme: 'blue',
    Content: () => (
      <StepContent
        title=" Receive Additional Insights"
        icon={Gem}
        description="Get scriptural insights, actionable ideas, prayer and journal Prompts, and more."
      />
    ),
  },
]

/**
 * note: this screen is used as a standalone page on native and as a sidebar on auth layout on web
 */
export const OnboardingScreen = () => {
  const router = useRouter()
  return <Onboarding autoSwipe onOnboarded={() => router.push('/sign-up')} steps={steps} />
}
