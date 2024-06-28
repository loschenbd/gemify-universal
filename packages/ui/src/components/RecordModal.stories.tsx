import { Meta, StoryObj } from '@storybook/react'
import { RecordModal } from './RecordModal'

const meta: Meta<typeof RecordModal> = {
  title: 'ui/RecordModal',
  parameters: { layout: 'centered' },
  component: RecordModal,
}

type Story = StoryObj<typeof RecordModal>

export const Basic: Story = {
  args: {},
}

export default meta
