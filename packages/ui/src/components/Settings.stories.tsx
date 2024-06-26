import { Meta, StoryObj } from '@storybook/react'
import { Box, Cog, Milestone, ShoppingCart, Users } from '@tamagui/lucide-icons'

import { Settings } from './Settings'

const meta: Meta<typeof Settings> = {
  title: 'ui/Settings',
  component: Settings,
  parameters: { layout: 'centered' },
}

type Story = StoryObj<typeof Settings>

export const Basic: Story = {
  render: (props) => (
    <Settings {...props} w={500}>
      <Settings.Items>
        <Settings.Group>
          <Settings.Item icon={Box} accentTheme="green">
            My Items
          </Settings.Item>
          <Settings.Item icon={Users} accentTheme="orange">
            Refer Your Friends
          </Settings.Item>
          <Settings.Item icon={Milestone} accentTheme="blue">
            Address Info
          </Settings.Item>
        </Settings.Group>

        <Settings.Group>
          <Settings.Item icon={ShoppingCart} accentTheme="blue">
            Purchase History
          </Settings.Item>
          <Settings.Item icon={Cog}>Settings</Settings.Item>
        </Settings.Group>
      </Settings.Items>
    </Settings>
  ),
}

export default meta
