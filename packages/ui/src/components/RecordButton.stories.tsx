import { Meta, StoryObj } from '@storybook/react'
import { RecordButton } from './RecordButton'

const meta: Meta<typeof RecordButton> = {
  title: 'ui/RecordButton',
  parameters: { layout: 'centered' },
  component: RecordButton,
}

type Story = StoryObj<typeof RecordButton>

export const Basic: Story = {
  args: {},
}

export default meta
