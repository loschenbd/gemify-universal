import { Meta, StoryObj } from '@storybook/react'
import { Waveform } from './Waveform'

const meta: Meta<typeof Waveform> = {
  title: 'ui/Waveform',
  parameters: { layout: 'centered' },
  component: Waveform,
}

type Story = StoryObj<typeof Waveform>

export const Basic: Story = {
  args: {},
}

export default meta
