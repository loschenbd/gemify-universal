import { Avatar, ColorTokens, YStack, validToken, RecordButton } from '@my/ui'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { Home } from '@tamagui/lucide-icons'
import { useUser } from 'app/utils/useUser'
import { Audio } from 'expo-av'
import { Stack, Tabs } from 'expo-router'
import { useEffect } from 'react'
import { SolitoImage } from 'solito/image'

export default function Layout() {
  useEffect(() => {
    async function requestMicrophonePermission() {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== 'granted') {
        alert('Sorry, we need microphone permissions to record audio.')
      }
    }

    requestMicrophonePermission()
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: 'Profile',
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
