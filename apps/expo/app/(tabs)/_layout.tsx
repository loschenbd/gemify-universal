import { Avatar, Button, Circle, ColorTokens, Sheet, Text, Theme, YStack, validToken } from '@my/ui'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Home, Circle as CircleIcon } from '@tamagui/lucide-icons'
import { useUser } from 'app/utils/useUser'
import { Stack, Tabs } from 'expo-router'
import { SolitoImage } from 'solito/image'
import { useRouter } from 'solito/router'
import { useState } from 'react'

export default function Layout() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => <Home col={color as ColorTokens} size={size} />,
          }}
        />
        <Tabs.Screen
          name="_create"
          listeners={({ navigation }: any) => ({
            tabPress: (event: any) => {
              event.preventDefault()
            },
          })}
          options={{
            title: 'Record',
            tabBarIcon: RecordButton,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ProfileTabIcon,
          }}
        />
      </Tabs>
    </>
  )
}

type TabBarIconProps = Parameters<Exclude<BottomTabNavigationOptions['tabBarIcon'], undefined>>[0]

const ProfileTabIcon = ({ color, size }: TabBarIconProps) => {
  const { avatarUrl } = useUser()
  return (
    <YStack bw="$1" boc={validToken(color)} br="$10">
      <Avatar circular p="$1" size={size}>
        <SolitoImage src={avatarUrl} alt="your avatar" width={size} height={size} />
      </Avatar>
    </YStack>
  )
}

const RecordButton = ({ size }: TabBarIconProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Theme inverse>
        <Circle
          pos="absolute"
          b={5}
          bg="$color1"
          shac="$shadowColor"
          shar={10}
          shof={{
            height: -5,
            width: 0,
          }}
          w={size + 34}
          h={size + 34}
        />
        <LinearGradient
          onPress={() => setOpen(true)}
          colors={['$gray6', '$gray7']}
          start={[1, 1]}
          end={[0.8, 0]}
          w={size + 34}
          h={size + 34}
          br="$10"
          pos="absolute"
          b={5}
          pressStyle={{
            rotate: '20deg',
          }}
        />
        <YStack
          pos="absolute"
          b={5}
          jc="center"
          ai="center"
          animation="quick"
          pe="none"
          h={size + 34}
        >
          <CircleIcon col="$color" size={size + 20} />
        </YStack>
      </Theme>
      <Sheet modal open={open} snapPoints={[80]} dismissOnOverlayPress={false}>
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.ScrollView>
            <YStack space="$4" padding="$4">
              <Text>This is the modal content.</Text>
              <Button onPress={() => setOpen(false)}>Close</Button>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
