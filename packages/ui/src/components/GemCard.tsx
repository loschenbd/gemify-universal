import { Gem } from '@tamagui/lucide-icons'
import { Card, Circle, H3, H4, Text, View, XStack, YStack, isWeb } from 'tamagui'
import { ReactNode } from 'react'

export type GemCardProps = {
  title?: ReactNode
  author?: string
  duration?: string
  date?: string
}

export const GemCard: React.FC<GemCardProps> = ({ title, author, duration, date }) => {
  return (
    <Card
      p="$2"
      unstyled={false}
      backgroundColor={
        typeof title === 'string' && title === 'Polishing Gem' ? 'transparent' : undefined
      }
      opacity={typeof title === 'string' && title === 'Polishing Gem' ? 0.5 : 1}
    >
      <XStack ai="center">
        <View jc="center" ai="center" br="$10" p="$2">
          <Circle bc="$gray4" size="$4">
            <Gem size="$2" />
          </Circle>
        </View>
        <YStack pl="$1.5" f={1}>
          <H3 ellipse>{title}</H3>
          {typeof title === 'string' && title !== 'Polishing Gem' && (
            <XStack>
              <Text col="$gray10">{author}</Text>
              {title && (
                <Text col="$gray10" pl="$2">
                  {duration}
                </Text>
              )}
            </XStack>
          )}
        </YStack>
        {isWeb && (
          <Text pt="$1" pr="$1" ml="auto" mb="auto" col="$gray10" jc="flex-end">
            {date}
          </Text>
        )}
      </XStack>
    </Card>
  )
}
