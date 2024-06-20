import { useSupabase } from '@my/app/utils/supabase/useSupabase'
import {
  Avatar,
  Circle,
  ColorTokens,
  Sheet,
  Text,
  Theme,
  YStack,
  XStack,
  validToken,
  Input,
  Waveform,
} from '@my/ui'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import * as Sentry from '@sentry/react-native'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Home, X, Circle as CircleIcon, StopCircle, CheckCircle } from '@tamagui/lucide-icons'
import { formatDuration } from 'app/utils/formatDuration'
import { useUser } from 'app/utils/useUser'
import { Audio } from 'expo-av'
import { Recording } from 'expo-av/build/Audio'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { Stack, Tabs } from 'expo-router'
import { nanoid } from 'nanoid/non-secure'
import { useState, useEffect } from 'react'
import { SolitoImage } from 'solito/image'
import { Upload } from 'tus-js-client'

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

const RecordButton = ({ size }: TabBarIconProps) => {
  const [open, setOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState<Recording>()
  const [permissionResponse, requestPermission] = Audio.usePermissions()
  const [duration, setDuration] = useState(0)
  const [meteringData, setMeteringData] = useState<number[]>([])
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingUri, setRecordingUri] = useState<string | undefined>(undefined)
  const [finalDuration, setFinalDuration] = useState(0)
  const [author, setAuthor] = useState('')

  const supabase = useSupabase()
  const user = useUser()
  async function startRecording() {
    activateKeepAwakeAsync()
    setIsRecording(true)
    if (!permissionResponse) {
      return
    }
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..')
        await requestPermission()

        // Wait for the permission status to update
        const updatedPermissionResponse = await Audio.getPermissionsAsync()
        if (updatedPermissionResponse.status !== 'granted') {
          console.error('Permission not granted')
          setIsRecording(false)
          return
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      })

      console.log('Starting recording..')
      const newRecording = new Audio.Recording()
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      newRecording.setOnRecordingStatusUpdate((status) => {
        setDuration(status.durationMillis)
        if (status.isRecording) {
          setMeteringData((prevData) =>
            [...prevData, status.metering].filter((value) => value !== undefined)
          )
        } else {
          setRecordingDuration(status.durationMillis)
        }
      })

      newRecording.setProgressUpdateInterval(150)

      await newRecording.startAsync()
      setRecording(newRecording)

      console.log('Recording started')
    } catch (err) {
      console.error('Failed to start recording', err)
      setIsRecording(false)
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
      setMeteringData([])
      deactivateKeepAwake()
      console.log('Recording stopped and stored at', uri)
    } catch (error) {
      console.error('Failed to get recording status:', error)
    }
  }

  async function saveRecording(durationMillis: number, title: string, author: string) {
    if (!user) {
      console.error('User not authenticated')
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'User not authenticated',
        level: 'error',
      })
      return
    }

    const profileId = user.profile?.id
    const fileName = `${profileId}_${Date.now()}.mp3`
    const folderName = profileId

    try {
      const response = await fetch(recordingUri)
      const fileData = await response.blob()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session && session.access_token) {
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'Session token retrieved successfully',
          level: 'info',
        })
      } else {
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'Session token not found',
          level: 'warning',
        })
      }

      const sharing_token = nanoid() // Generate a unique sharing token using nanoid

      const upload = new Upload(fileData, {
        endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          'x-upsert': 'true',
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: 'gem-audio',
          objectName: `${folderName}/${fileName}`,
          contentType: 'audio/mpeg',
          cacheControl: 3600,
          sharing_token,
        },
        chunkSize: 6 * 1024 * 1024,
        onError(error) {
          console.log('Failed because: ' + error)
          Sentry.captureException(error)
          Sentry.addBreadcrumb({
            category: 'upload',
            message: 'Audio upload failed',
            level: 'error',
          })
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
          console.log(bytesUploaded, bytesTotal, percentage + '%')
        },
        onSuccess: async () => {
          console.log('Audio uploaded successfully')
          Sentry.addBreadcrumb({
            category: 'upload',
            message: 'Audio uploaded successfully',
            level: 'info',
          })

          const fileUrl = `${folderName}/${fileName}`
          console.log(fileUrl)
          console.log(durationMillis)

          const { data: gemData, error: insertError } = await supabase.from('gems').insert({
            audio_url: fileUrl,
            duration: durationMillis,
            profile_id: user.profile?.id,
            author,
            sharing_token,
          })

          if (insertError) {
            console.error('Error inserting gem record:', insertError)
            Sentry.captureException(insertError)
            Sentry.addBreadcrumb({
              category: 'database',
              message: 'Error inserting gem record',
              level: 'error',
            })
            return
          }

          console.log('Gem record inserted successfully:', gemData)
          Sentry.addBreadcrumb({
            category: 'database',
            message: 'Gem record inserted successfully',
            level: 'info',
          })
        },
      })

      return upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0])
        }

        upload.start()
      })
    } catch (error) {
      console.error('Error reading or uploading audio:', error)
      Sentry.captureException(error)
      Sentry.addBreadcrumb({
        category: 'upload',
        message: 'Error reading or uploading audio',
        level: 'error',
      })
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
            if (!isRecording) {
              setOpen(true)
              startRecording()
              setDuration(duration)
            }
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
      <Sheet modal moveOnKeyboardChange open={open} snapPoints={[35]} dismissOnOverlayPress={false}>
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.ScrollView>
            {isRecording ? (
              <YStack ai="center" jc="center" f={1} space="$4" p="$4">
                <Text>{formatDuration(duration)}</Text>
                <Waveform data={meteringData} />
                <StopCircle size="$4" onPress={stopRecording} />
              </YStack>
            ) : (
              <YStack ai="center" jc="center" m="auto" f={1} space="$4" p="$4">
                <Input
                  w={250}
                  placeholder="Who gave you this word?"
                  value={author}
                  onChangeText={setAuthor}
                />
                <Text>{formatDuration(finalDuration)}</Text>
                <XStack gap={20}>
                  <CheckCircle
                    size="$4"
                    onPress={async () => {
                      setOpen(false)
                      saveRecording(finalDuration, recordingUri, author)
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
