import { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'ui/Skeleton',
  parameters: { layout: 'centered' },
  component: Skeleton,
}

type Story = StoryObj<typeof Skeleton>

export const Basic: Story = {
  args: {},
}

export default meta
