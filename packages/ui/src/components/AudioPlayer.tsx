import { Text, Button, View, Circle, H4, H6, XStack, Slider, Spinner } from '@my/ui'
import { Pause, Play } from '@tamagui/lucide-icons'
import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'
import { linkMockup } from '../home/screen'
import { set } from 'zod'
import { Pressable } from 'react-native'

export type AudioPlayerProps = {}

const audioUrl =
  'https://lzeujpdftfnvelzhknqe.supabase.co/storage/v1/object/sign/gem-audio/testfile.m4a?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnZW0tYXVkaW8vdGVzdGZpbGUubTRhIiwiaWF0IjoxNzEyODY4OTM2LCJleHAiOjE3MTM0NzM3MzZ9.aNR2JY_NjSmR3qB9tvqrdHIRkoWO57CgYKElXbfLm6M&t=2024-04-11T20%3A55%3A36.201Z'

export const AudioPlayer: React.FC<AudioPlayerProps> = (props) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl })
        setSound(sound)

        sound.setOnPlaybackStatusUpdate((status) => {
          setPlaying(status.isPlaying)
          setProgress(status.positionMillis / status.durationMillis)
          setDuration(status.durationMillis)

          const remainingMillis = status.durationMillis - status.positionMillis
          setRemainingTime(remainingMillis)
        })
      } catch (error) {
        setError('Failed to load audio')
        console.error('Failed to load audio', error)
      }
    }

    loadSound()

    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [])

  const handlePlayPause = async () => {
    if (sound) {
      if (playing) {
        await sound.pauseAsync()
      } else {
        await sound.playAsync()
      }
    }
  }

  const handleSliderValueChange = async (value: number[]) => {
    if (sound) {
      const positionMillis = value[0] * duration
      await sound.setPositionAsync(positionMillis)
      setProgress(value[0])
      setRemainingTime(duration - positionMillis)
    }
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
      <XStack p="$4" br="$12" bg="$gray5" alignItems="center" space="$2">
        <View>
          {error ? (
            <Text>{error}</Text>
          ) : (
            <View>
              {playing ? (
                <Pressable onPress={handlePlayPause}>
                  <Pause />
                </Pressable>
              ) : (
                <Pressable onPress={handlePlayPause}>
                  <Play />
                </Pressable>
              )}
            </View>
          )}
        </View>
        <Slider
          size="$1"
          width={200}
          defaultValue={[0]}
          max={1}
          step={0.00001}
          value={[progress]}
          onValueChange={handleSliderValueChange}
        >
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb index={0} circular elevate />
        </Slider>
        <Text>{formatDuration(remainingTime)}</Text>
      </XStack>
    </>
  )
}
