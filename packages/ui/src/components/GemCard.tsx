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
    <Card p="$2" unstyled={!title}>
      <XStack alignItems="center">
        {title && (
          <View justifyContent="center" alignItems="center" borderRadius="$20" padding="$2">
            <Circle backgroundColor="$gray4" size="$4">
              <Gem size="$2" />
            </Circle>
          </View>
        )}
        <YStack pl="$1.5">
          {title ? (
            <H3>{title}</H3>
          ) : (
            <H3 fontStyle="italic" color="$gray10">
              Polishing Gem
            </H3>
          )}
          <XStack>
            <Text color="$gray10">{author}</Text>
            <Text color="$gray10" paddingLeft="$2">
              {duration}
            </Text>
          </XStack>
        </YStack>
        <Text
          pt="$1"
          pr="$1"
          marginLeft="auto"
          marginBottom="auto"
          color="$gray10"
          justify-conent="end"
        >
          {date}
        </Text>
      </XStack>
    </Card>
  )
}
