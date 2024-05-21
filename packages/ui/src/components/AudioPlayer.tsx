import { Pause, Play } from '@tamagui/lucide-icons'
import { formatDuration } from 'app/utils/formatDuration'
import { Pressable } from 'react-native'
import { Text, View, XStack, Slider, Spinner } from 'tamagui'

export type AudioPlayerProps = {
  url: string
  durationMillis: number
  isSoundLoading: boolean
  playing: boolean
  progress: number
  remainingTime: number
  error: string | null
  playPause: () => void
  handleSliderValueChange: (value: number) => void
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  url,
  durationMillis,
  isSoundLoading,
  playing,
  progress,
  remainingTime,
  error,
  playPause,
  handleSliderValueChange,
}) => {
  return (
    <>
      <XStack p="$4" br="$12" bg="$gray5" ai="center" gap="$2">
        <View>
          {error ? (
            <Text>{error}</Text>
          ) : (
            <View>
              {isSoundLoading ? (
                <Spinner />
              ) : (
                <Pressable onPress={playPause}>{playing ? <Pause /> : <Play />}</Pressable>
              )}
            </View>
          )}
        </View>
        <Slider
          p="$1"
          size="$1"
          w={200}
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
        <Text p="$1">{formatDuration(Math.max(remainingTime, 0))}</Text>
      </XStack>
    </>
  )
}
