import {
  Avatar,
  H2,
  Circle,
  ColorTokens,
  Sheet,
  Text,
  Theme,
  YStack,
  validToken,
  View,
  Button,
} from '@my/ui'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Home, X, Circle as CircleIcon, StopCircle } from '@tamagui/lucide-icons'
import { useUser } from 'app/utils/useUser'
import { Audio } from 'expo-av'
import { Recording } from 'expo-av/build/Audio'
import { Stack, Tabs } from 'expo-router'
import { useState } from 'react'
import { SolitoImage } from 'solito/image'

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
  const [recording, setRecording] = useState<Recording>()
  const [permissionResponse, requestPermission] = Audio.usePermissions()
  const [duration, setDuration] = useState(0)

  async function startRecording() {
    if (!permissionResponse) {
      return
    }
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..')
        await requestPermission()
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      console.log('Starting recording..')
      const recording = new Audio.Recording()
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      recording.setOnRecordingStatusUpdate((status) => {
        setDuration(status.durationMillis)
      })
      await recording.startAsync()
      setRecording(recording)
      console.log('Recording started')
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    if (!recording) {
      return
    }
    console.log('Stopping recording..')
    setRecording(undefined)
    await recording.stopAndUnloadAsync()
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })
    const uri = recording.getURI()
    console.log('Recording stopped and stored at', uri)
  }

  const formatDuration = (durationMillis: number) => {
    if (!durationMillis || durationMillis === 0) {
      return '00:00'
    }

    const totalSeconds = Math.floor(durationMillis / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

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
          onPress={() => {
            setOpen(true)
            startRecording()
            setDuration(duration)
          }}
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
      <Sheet modal open={open} snapPoints={[35]} dismissOnOverlayPress={false}>
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.ScrollView>
            <YStack ai="center" jc="center" f={1} space="$4" p="$4">
              <X jc="flex-end" onPress={() => setOpen(false)} />
              <H2>Title</H2>
              <Text>Author</Text>
              <Text>{formatDuration(duration)}</Text>
              <StopCircle onPress={stopRecording} />
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
