import { Pause, Play } from '@tamagui/lucide-icons'
import { formatDuration } from 'app/utils/formatDuration'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { Text, View, XStack, Slider, Spinner } from 'tamagui'

export type AudioPlayerProps = {
  url: string
  durationMillis: number
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, durationMillis }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(durationMillis)
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
