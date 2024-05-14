import { YStack, XStack, Theme } from 'tamagui'

export type WaveformProps = {
  data: number[]
}

export const Waveform: React.FC<WaveformProps> = ({ data }) => {
  const meterCount = 40
  const meterWidth = 5
  const minMeterHeight = 2
  const maxMeterHeight = 100

  const scaleMeterValue = (value: number) => {
    const minValue = -60
    const maxValue = 0
    const scaledValue =
      ((value - minValue) / (maxValue - minValue)) * (maxMeterHeight - minMeterHeight) +
      minMeterHeight
    return Math.max(scaledValue, minMeterHeight)
  }

  return (
    <YStack
      h={maxMeterHeight * 2}
      jc="center"
      ai="flex-end"
      height={maxMeterHeight}
      backgroundColor="$gray1"
    >
      <XStack ai="center" gap={5}>
        {Array.from({ length: meterCount }).map((_, index) => {
          const meterValue = data[data.length - meterCount + index] || -60
          const meterHeight = scaleMeterValue(meterValue)

          return (
            <YStack
              key={index}
              width={meterWidth}
              height={meterHeight}
              backgroundColor="$gray12"
              borderRadius="$2"
            />
          )
        })}
      </XStack>
    </YStack>
  )
}
