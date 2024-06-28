import { useSupabase } from '@my/app/utils/supabase/useSupabase'
import { Circle, Theme, YStack, Button, RecordModal } from '@my/ui'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import * as Sentry from '@sentry/react-native'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Circle as CircleIcon } from '@tamagui/lucide-icons'
import { useToastController } from '@tamagui/toast'
import { useUser } from 'app/utils/useUser'
import { Audio } from 'expo-av'
import { Recording } from 'expo-av/build/Audio'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { nanoid } from 'nanoid/non-secure'
import { useState } from 'react'
import { Upload } from 'tus-js-client'

type TabBarIconProps = Parameters<Exclude<BottomTabNavigationOptions['tabBarIcon'], undefined>>[0]

export const RecordButton = ({ size }: TabBarIconProps) => {
  const toast = useToastController()

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
    if (isRecording) {
      console.warn('Recording is already in progress')
      return
    }

    activateKeepAwakeAsync()
    setIsRecording(true)
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
        staysActiveInBackground: true,
        interruptionModeIOS: 1,
      })

      console.log('Starting recording..')
      const newRecording = new Audio.Recording()
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)

      newRecording.setOnRecordingStatusUpdate((status) => {
        const currentDuration = status.durationMillis
        setDuration(currentDuration)

        if (status.isRecording && status.metering !== undefined) {
          setMeteringData((prevData) => [...prevData, status.metering])
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
      setDuration(durationMillis)
      setFinalDuration(durationMillis)

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

    const MAX_RETRIES = 3
    let retryCount = 0

    async function attemptUpload(): Promise<any> {
      try {
        const response = await fetch(recordingUri)
        const fileData = await response.blob()

        const {
          data: { session },
        } = await supabase.auth.getSession()

        const sharing_token = nanoid()

        return new Promise((resolve, reject) => {
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
            chunkSize: 1 * 1024 * 1024,
            onError: async (error) => {
              console.error('Upload failed:', error)
              Sentry.captureException(error)
              Sentry.addBreadcrumb({
                category: 'upload',
                message: 'Error reading or uploading audio',
                level: 'error',
              })
              toast.show('Upload failed', {
                message: 'There was an error uploading your audio. Please try again.',
                type: 'error',
              })

              if (retryCount < MAX_RETRIES) {
                retryCount++
                console.log(`Retrying upload (attempt ${retryCount} of ${MAX_RETRIES})...`)
                toast.show('Upload failed', {
                  message: `Retrying upload (attempt ${retryCount} of ${MAX_RETRIES})...`,
                  type: 'warning',
                })
                try {
                  const result = await attemptUpload()
                  resolve(result)
                } catch (retryError) {
                  reject(retryError)
                }
              } else {
                toast.show('Upload failed', {
                  message: 'Maximum retry attempts reached. Please try again later.',
                  type: 'error',
                })
                reject(error)
              }
            },
            onShouldRetry: (error, retryAttempt, options) => {
              console.log(`Considering retry ${retryAttempt}`)

              // Don't retry if we've already retried 3 times
              if (retryAttempt > 3) {
                console.log('Max retries reached, not retrying')
                return false
              }

              // Don't retry for client errors (4xx status codes)
              if (
                error.originalResponse &&
                error.originalResponse.getStatus() >= 400 &&
                error.originalResponse.getStatus() < 500
              ) {
                console.log('Client error, not retrying')
                return false
              }

              // Retry for server errors or network issues
              console.log('Server error or network issue, retrying')
              return true
            },
            onSuccess: async () => {
              console.log('onSuccess callback triggered')
              console.log('Audio uploaded successfully')
              Sentry.addBreadcrumb({
                category: 'upload',
                message: 'Audio uploaded successfully',
                level: 'info',
              })

              const fileUrl = `${folderName}/${fileName}`

              try {
                const { data: gemData, error: insertError } = await supabase.from('gems').insert({
                  audio_url: fileUrl,
                  duration: durationMillis,
                  profile_id: user.profile?.id,
                  author,
                  sharing_token,
                })

                if (insertError) throw insertError

                console.log('Gem record inserted successfully:', gemData)
                Sentry.addBreadcrumb({
                  category: 'database',
                  message: 'Gem record inserted successfully',
                  level: 'info',
                })

                // Optionally, show another toast after database insertion
                toast.show('Record Saved', {
                  message: 'Your gem has been successfully saved.',
                  id: 'record-saved',
                })

                resolve(gemData)
              } catch (error) {
                console.error('Error inserting gem record:', error)
                Sentry.captureException(error)

                // Show an error toast if database insertion fails
                toast.show('Database Error', {
                  message:
                    'Your audio was uploaded but we encountered an error saving the record. Please try again.',
                })

                reject(error)
              }
            },

            onProgress: (bytesUploaded, bytesTotal) => {
              const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
              console.log(bytesUploaded, bytesTotal, percentage + '%')
            },
          })

          upload.start()
        })
      } catch (error) {
        console.error('Error preparing upload:', error)
        Sentry.captureException(error)
        throw error
      }
    }

    return attemptUpload()
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
      <RecordModal
        open={open}
        setOpen={setOpen}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        duration={duration}
        meteringData={meteringData}
        stopRecording={stopRecording}
        finalDuration={finalDuration}
        author={author}
        setAuthor={setAuthor}
        saveRecording={saveRecording}
        recordingUri={recordingUri}
      />
    </>
  )
}
