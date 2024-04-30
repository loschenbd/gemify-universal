import { Gem } from '@tamagui/lucide-icons'
import { Card, Circle, H2, H3, H4, Text, View, XStack, YStack } from 'tamagui'
import { Link } from './Link'
export type GemCardProps = object

export const GemCard: React.FC<GemCardProps> = ({ title, duration, author, date }) => {
  return (
    <Card p="$2" unstyled={false}>
      <XStack alignItems="center">
        <View justifyContent="center" alignItems="center" borderRadius="$20" padding="$2">
          <Circle backgroundColor="$gray4" size="$4">
            <Gem size="$2" />
          </Circle>
        </View>
        <YStack pl="$1.5">
          <H3 size="$4">{title}</H3>
          <XStack>
            <Text color="$gray10">{author}</Text>
            <Text color="$gray10" paddingLeft="$2">
              {duration}
            </Text>
          </XStack>
        </YStack>
        <Text pt="$1" pr="$1" marginLeft="auto" marginBottom="auto" color="$gray10" jc="flex-end">
          {date}
        </Text>
      </XStack>
    </Card>
  )
}
