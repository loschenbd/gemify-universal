import { Gem } from '@tamagui/lucide-icons'
import { Card, Circle, H3, H4, Text, View, XStack, YStack } from 'tamagui'

export type GemCardProps = {
  title?: string
  author?: string
  duration?: string
  date?: string
}

export const GemCard: React.FC<GemCardProps> = ({ title, author, duration, date }) => {
  return (
    <Card
      p="$2"
      unstyled={false}
      backgroundColor={title === 'Polishing Gem' ? 'transparent' : undefined}
      opacity={title === 'Polishing Gem' ? 0.5 : 1}
    >
      <XStack ai="center">
        <View jc="center" ai="center" br="$20" padding="$2">
          <Circle backgroundColor="$gray4" size="$4">
            <Gem size="$2" />
          </Circle>
        </View>
        <YStack pl="$1.5" flex={1}>
          <H3 ellipse>{title}</H3>
          {title !== 'Polishing Gem' && (
            <XStack>
              <Text color="$gray10">{author}</Text>
              {title && (
                <Text color="$gray10" paddingLeft="$2">
                  {duration}
                </Text>
              )}
            </XStack>
          )}
        </YStack>
        <Text pt="$1" pr="$1" ml="auto" mb="auto" color="$gray10" jc="flex-end">
          {date}
        </Text>
      </XStack>
    </Card>
  )
}
