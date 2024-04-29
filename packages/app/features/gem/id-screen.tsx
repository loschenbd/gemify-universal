import { YStack, H3, Text, View, Circle, ScrollView, AudioPlayer, Spinner } from '@my/ui'
import { Gem, ArrowLeftCircle } from '@tamagui/lucide-icons'
import { useGem } from 'app/utils/useGem'
import { Pressable } from 'react-native'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'

const { useParam } = createParam<{ id: string }>()
export const IdScreen = () => {
  const { back } = useRouter()
  const onGoBack = () => {
    back()
  }

  const [id] = useParam('id')
  const gemId = id ? parseInt(id, 10) : undefined

  const { data: gem, isLoading, error } = useGem(gemId)

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  if (!gem) {
    return <Text>Gem not found</Text>
  }

  return (
    <>
      <ScrollView>
        <View p="$4">
          <Pressable onPress={onGoBack}>
            <ArrowLeftCircle size="$3" color="$gray20" />
          </Pressable>
        </View>
        <YStack alignItems="center">
          <View justify-content="center" alignItems="center" borderRadius="$20">
            <Circle backgroundColor="$gray5" size="$5">
              <Gem size="$3" />
            </Circle>
          </View>
          <H3 p="$2">{gem.title}</H3>
          <Text pb="$3">{gem.author}</Text>
          <AudioPlayer url={gem.audio_url} />
        </YStack>
        <YStack justify-content="center">
          {/* Main Points */}
          {gem.main_points && (
            <View p="$4">
              <H3 p="$2">Main Points</H3>
              {gem.main_points.map((point, index) => (
                <Text py="$1" px="$3" key={index}>
                  • {point}
                </Text>
              ))}
            </View>
          )}

          {/* Summary */}
          {gem.summary && (
            <View p="$4">
              <H3 p="$2">Summary</H3>
              <Text py="$1" px="$3">
                {gem.summary}
              </Text>
            </View>
          )}

          {/* Stories, Examples, Citations */}
          {gem.stories && (
            <View p="$4">
              <H3 p="$2">Stories, Examples, Citations</H3>
              {gem.stories.map((item, index) => (
                <Text py="$1" px="$3" key={index}>
                  • {item}
                </Text>
              ))}
            </View>
          )}

          {/* Follow-up Questions */}
          {gem.follow_up && (
            <View p="$4">
              <H3 p="$2">Follow-up Questions</H3>
              {gem.follow_up.map((question, index) => (
                <Text py="$1" px="$3" key={index}>
                  • {question}
                </Text>
              ))}
            </View>
          )}

          {/* Action Items */}
          {gem.action_items && (
            <View p="$4">
              <H3 p="$2">Potential Action Items</H3>
              {gem.action_items.map((question, index) => (
                <Text py="$1" px="$3" key={index}>
                  • {question}
                </Text>
              ))}
            </View>
          )}

          {/* Bible Verses */}
          {gem.bible_verses && (
            <View p="$4">
              <H3 p="$2">Supporting Scriptures</H3>
              {gem.bible_verses.map((verse, index) => (
                <Text py="$1" px="$3" key={index}>
                  • {verse}
                </Text>
              ))}
            </View>
          )}

          {/* Related Topics */}
          {gem.related_topics && (
            <View p="$4">
              <H3 p="$2">Related Topics</H3>
              {gem.related_topics.map((topic, index) => (
                <Text py="$1" px="$3" key={index}>
                  • {topic}
                </Text>
              ))}
            </View>
          )}

          {gem.transcript && (
            <View p="$4">
              <H3 p="$2">Transcript</H3>
              <Text py="$1" px="$3">
                {gem.transcript}
              </Text>
            </View>
          )}
        </YStack>
      </ScrollView>
    </>
  )
}
