import { Meta, StoryObj } from '@storybook/react'
import { BackButton } from './BackButton'

const meta: Meta<typeof BackButton> = {
  title: 'ui/BackButton',
  parameters: { layout: 'centered' },
  component: BackButton,
}

type Story = StoryObj<typeof BackButton>

export const Basic: Story = {
  args: {},
}

export default meta
