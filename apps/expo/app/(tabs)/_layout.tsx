import { useSupabase } from '@my/app/utils/supabase/useSupabase'
import {
  Avatar,
  H2,
  Circle,
  ColorTokens,
  Sheet,
  Text,
  Theme,
  YStack,
  XStack,
  validToken,
  View,
  Button,
  Input,
} from '@my/ui'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Home, X, Circle as CircleIcon, StopCircle, CheckCircle } from '@tamagui/lucide-icons'
import { formatDuration } from 'app/utils/formatDuration'
import { useUser } from 'app/utils/useUser'
import { Audio } from 'expo-av'
import { Recording } from 'expo-av/build/Audio'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
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
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState<Recording>()
  const [permissionResponse, requestPermission] = Audio.usePermissions()
  const [duration, setDuration] = useState(0)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingUri, setRecordingUri] = useState<string | undefined>(undefined)
  const [finalDuration, setFinalDuration] = useState(0)

  const supabase = useSupabase()
  const user = useUser()
  async function startRecording() {
    activateKeepAwakeAsync()
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
        if (!status.isRecording) {
          setRecordingDuration(status.durationMillis)
        }
      })
      await recording.startAsync()
      setRecording(recording)
      setIsRecording(true)
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
    try {
      const status = await recording.getStatusAsync()
      const durationMillis = status.durationMillis
      setRecordingDuration(durationMillis)
      setDuration(durationMillis)
      setFinalDuration(durationMillis) // Save the final duration
      console.log('Recording duration:', durationMillis)

      await recording.stopAndUnloadAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      })
      const uri = recording.getURI()
      setRecordingUri(uri)
      setIsRecording(false)
      deactivateKeepAwake()
      console.log('Recording stopped and stored at', uri)
    } catch (error) {
      console.error('Failed to get recording status:', error)
    }
  }

  async function saveRecording(durationMillis: number, title: string, author: string) {
    if (!user) {
      console.error('User not authenticated')
      return
    }

    const profileId = user.profile?.id
    const fileName = `${profileId}_${Date.now()}.mp3`
    const folderName = profileId

    try {
      const response = await fetch(recordingUri)
      const fileData = await response.blob()

      const reader = new FileReader()
      reader.onloadend = async () => {
        const arrayBuffer = reader.result as ArrayBuffer

        const { data, error: uploadError } = await supabase.storage
          .from('gem-audio')
          .upload(`${folderName}/${fileName}`, arrayBuffer, {
            contentType: 'audio/mpeg',
          })

        if (uploadError) {
          console.error('Error uploading audio:', uploadError)
          return
        }

        console.log('Audio uploaded successfully:', data)

        const { data: signedUrl, error: signedUrlError } = await supabase.storage
          .from('gem-audio')
          .createSignedUrl(`${folderName}/${fileName}`, 600)

        if (signedUrlError) {
          console.error('Error getting public URL:', signedUrlError)
          return
        }

        const fileUrl = `${folderName}/${fileName}`
        console.log(fileUrl)
        console.log(durationMillis)
        // Insert a new row into the 'gems' table with the file URL and other metadata
        const { data: gemData, error: insertError } = await supabase.from('gems').insert({
          audio_url: fileUrl,
          duration: finalDuration,
          profile_id: user.profile?.id,
          // Include other relevant metadata fields
        })

        if (insertError) {
          console.error('Error inserting gem record:', insertError)
          return
        }

        console.log('Gem record inserted successfully:', gemData)
      }

      reader.readAsArrayBuffer(fileData)
    } catch (error) {
      console.error('Error reading or uploading audio:', error)
    }
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
            {isRecording ? (
              <YStack ai="center" jc="center" f={1} space="$4" p="$4">
                <H2>Title</H2>
                <Text>Author</Text>
                <Text>{formatDuration(duration)}</Text>
                <StopCircle size="$4" onPress={stopRecording} />
              </YStack>
            ) : (
              <YStack ai="center" jc="center" f={1} space="$4" p="$4">
                <Input w={250} placeholder="Title" />
                <Input w={250} placeholder="Author" />
                <Text>{formatDuration(recordingDuration)}</Text>
                <XStack gap={20}>
                  <CheckCircle
                    size="$4"
                    onPress={async () => {
                      setOpen(false)
                      saveRecording(recordingUri, recordingDuration)
                    }}
                  />
                  <X
                    size="$4"
                    onPress={() => {
                      setOpen(false)
                    }}
                  />
                </XStack>
              </YStack>
            )}
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
