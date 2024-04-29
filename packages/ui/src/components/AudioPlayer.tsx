import { Text, View, XStack, Slider, Spinner } from 'tamagui'
import { Pause, Play } from '@tamagui/lucide-icons'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'

export type AudioPlayerProps = {
  url: string
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const supabase = useSupabase()

  useEffect(() => {
    const loadSound = async () => {
      setIsLoading(true)
      try {
        const { data: signedUrl, error: signedUrlError } = await supabase.storage
          .from('gem-audio')
          .createSignedUrl(url, 600)

        if (signedUrlError) {
          console.error('Error getting public URL:', signedUrlError)
          setError('Failed to load audio')
          setIsLoading(false)
          return
        }

        const { sound } = await Audio.Sound.createAsync({ uri: signedUrl.signedUrl })
        setSound(sound)

        sound.setOnPlaybackStatusUpdate((status) => {
          setPlaying(status.isPlaying)
          setProgress(status.positionMillis / (status.durationMillis || 1))
          setDuration(status.durationMillis)
          setRemainingTime(status.durationMillis - status.positionMillis)
        })

        setIsLoading(false)
      } catch (error) {
        setError('Failed to load audio')
        console.error('Failed to load audio', error)
        setIsLoading(false)
      }
    }

    loadSound()

    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [url])

  const handlePlayPause = async () => {
    if (sound) {
      if (playing) {
        await sound.pauseAsync()
      } else {
        await sound.playAsync()
      }
    }
  }

  const handleSliderValueChange = async (value: number) => {
    if (sound && duration > 0) {
      const positionMillis = value * duration
      await sound.setPositionAsync(positionMillis)
      setProgress(value)
      console.log(progress)
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
              {isLoading ? (
                <Spinner />
              ) : (
                <Pressable onPress={handlePlayPause}>{playing ? <Pause /> : <Play />}</Pressable>
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
          onValueChange={(value) => handleSliderValueChange(value[0])}
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
