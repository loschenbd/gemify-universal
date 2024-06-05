import { YStack, XStack, AnimatePresence, View } from 'tamagui'

export const Skeleton = () => {
  return (
    <AnimatePresence>
      <YStack miw="$20" gap="$2" p="$4">
        <XStack gap="$2" ai="center">
          <View animation="pulse" bc="$gray4" br="$10" size="$4" o={0.5} hoverStyle={{ o: 1 }} />
          <View
            animation="pulse"
            bc="$gray6"
            br="$4"
            height="$2"
            width="70%"
            o={0.5}
            hoverStyle={{ o: 1 }}
          />
        </XStack>
        <View animation="pulse" bc="$gray6" br="$4" height="$2" o={0.5} hoverStyle={{ o: 1 }} />
        <View animation="pulse" bc="$gray6" br="$4" height="$2" o={0.5} hoverStyle={{ o: 1 }} />
      </YStack>
    </AnimatePresence>
  )
}
