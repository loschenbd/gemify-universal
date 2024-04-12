import { Meta, StoryObj } from '@storybook/react'
import { AudioPlayer } from './AudioPlayer'

const meta: Meta<typeof AudioPlayer> = {
  title: 'ui/AudioPlayer',
  parameters: { layout: 'centered' },
  component: AudioPlayer,
}

type Story = StoryObj<typeof AudioPlayer>

export const Basic: Story = {
  args: {},
}

export default meta
