import { Meta, StoryObj } from '@storybook/react'
import { GemCard } from './GemCard'

const meta: Meta<typeof GemCard> = {
  title: 'ui/GemCard',
  parameters: { layout: 'centered' },
  component: GemCard,
}

type Story = StoryObj<typeof GemCard>

export const Basic: Story = {
  args: {},
}

export default meta
