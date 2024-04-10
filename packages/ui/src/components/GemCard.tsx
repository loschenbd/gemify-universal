import { Gem } from '@tamagui/lucide-icons'
import { Card, Circle, H2, H3, H4, Text, View, XStack, YStack } from 'tamagui'
export type GemCardProps = object

export const GemCard: React.FC<GemCardProps> = (props) => {
  return (
    <Card p="$2" unstyled={false}>
      <XStack>
        <View justify-content="center" alignItems="center" borderRadius="$20" padding="$2">
          <Circle backgroundColor="$gray4" size="$4">
            <Gem size="$2" />
          </Circle>
        </View>
        <YStack pl="$1.5">
          <H3>Title</H3>
          <XStack>
            <Text color="$gray10">Author</Text>
            <Text color="$gray10" paddingLeft="$2">
              00:00
            </Text>
          </XStack>
        </YStack>
        <Text marginLeft="auto" color="$gray10" justify-conent="end">
          04/08/2024
        </Text>
      </XStack>
    </Card>
  )
}
