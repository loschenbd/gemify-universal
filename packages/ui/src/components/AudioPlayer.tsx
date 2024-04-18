import { Text, View, XStack, Slider, Spinner } from 'tamagui'
import { Pause, Play } from '@tamagui/lucide-icons'
import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'

export type AudioPlayerProps = object

const audioUrl =
  'https://lzeujpdftfnvelzhknqe.supabase.co/storage/v1/object/sign/gem-audio/testfile.m4a?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnZW0tYXVkaW8vdGVzdGZpbGUubTRhIiwiaWF0IjoxNzEzNDY1OTE3LCJleHAiOjE3NDUwMDE5MTd9.hwuOFFgZZ_T5lfxn8DdUZ6ItrzEIPjdXq0VDKHYVNXU&t=2024-04-18T18%3A45%3A17.881Z'

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
      if (duration > 0) {
        const positionMillis = value[0] * duration
        await sound.setPositionAsync(positionMillis)
        setProgress(value[0])
        setRemainingTime(duration - positionMillis)
      }
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
          p="$1"
          size="$1"
          width={200}
          defaultValue={[0]}
          max={1}
          step={0.00001}
          value={[progress]}
          onValueChange={handleSliderValueChange}
          disabled={duration === 0}
        >
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb index={0} circular elevate />
        </Slider>
        <Text p="$1">{formatDuration(remainingTime)}</Text>
      </XStack>
    </>
  )
}
