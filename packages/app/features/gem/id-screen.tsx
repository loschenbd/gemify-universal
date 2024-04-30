import { YStack, H3, Text, View, Circle, ScrollView, AudioPlayer, Button, XStack } from '@my/ui'
import { Gem, ArrowLeftCircle, Trash2 } from '@tamagui/lucide-icons'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useGem } from 'app/utils/useGem'
import { Pressable } from 'react-native'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { AlertDialog } from 'tamagui'

const { useParam } = createParam<{ id: string }>()
export const IdScreen = () => {
  const supabase = useSupabase()

  const { back } = useRouter()
  const onGoBack = () => {
    back()
  }

  const handleDelete = async () => {
    if (gemId) {
      console.log('Gem deleted:', gemId)

      const { data, error } = await supabase.from('gems').delete().eq('id', gemId)

      if (error) {
        console.error('Error deleting gem:', error)
        // Handle the error, show an error message, etc.
      } else {
        // Gem deleted successfully
        // Navigate back to the previous screen or any other desired action
        back()
      }
    }
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
        <XStack px="$4" ai="center" jc="space-between">
          <Pressable onPress={onGoBack}>
            <ArrowLeftCircle size="$3" color="$gray20" />
          </Pressable>
          <AlertDialog native>
            <AlertDialog.Trigger asChild>
              <Trash2 jc="flex-end" size="$1.5" color="$gray10" />
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
              <AlertDialog.Overlay
                key="overlay"
                animation="quick"
                opacity={0.5}
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
              <AlertDialog.Content
                bordered
                elevate
                key="content"
                animation={[
                  'quick',
                  {
                    opacity: {
                      overshootClamping: true,
                    },
                  },
                ]}
                enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                x={0}
                scale={1}
                opacity={1}
                y={0}
              >
                <YStack space>
                  <AlertDialog.Title>Delete Gem?</AlertDialog.Title>
                  <AlertDialog.Description>
                    This will permanently delete your gem. Are you sure you want to continue?
                  </AlertDialog.Description>

                  <XStack space="$3" jc="flex-end">
                    <AlertDialog.Cancel asChild>
                      <Button>Cancel</Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action onPress={handleDelete} asChild>
                      <Button theme="active">Delete</Button>
                    </AlertDialog.Action>
                  </XStack>
                </YStack>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog>
        </XStack>
        <YStack alignItems="center">
          <View justify-content="center" alignItems="center" borderRadius="$20">
            <Circle backgroundColor="$gray5" size="$5">
              <Gem size="$3" />
            </Circle>
          </View>
          <H3 p="$2">{gem.title}</H3>
          <Text pb="$3">{gem.author}</Text>
          <AudioPlayer url={gem.audio_url} durationMillis={gem.duration} />
        </YStack>
        <YStack justify-content="center">
          {/* Main Points */}
          {gem.main_points && (
            <View p="$4">
              <H3 p="$2">Main Points</H3>
              {gem.main_points.map((point, index) => (
                <XStack py="$1" px="$3" key={index}>
                  <Text>•</Text>
                  <Text pl="$1.5">{point}</Text>
                </XStack>
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
                <XStack py="$1" px="$3" key={index}>
                  <Text>•</Text>
                  <Text pl="$1.5">{item}</Text>
                </XStack>
              ))}
            </View>
          )}

          {/* Follow-up Questions */}
          {gem.follow_up && (
            <View p="$4">
              <H3 p="$2">Follow-up Questions</H3>
              {gem.follow_up.map((question, index) => (
                <XStack py="$1" px="$3" key={index}>
                  <Text>•</Text>
                  <Text pl="$1.5">{question}</Text>
                </XStack>
              ))}
            </View>
          )}

          {/* Action Items */}
          {gem.action_items && (
            <View p="$4">
              <H3 p="$2">Potential Action Items</H3>
              {gem.action_items.map((action, index) => (
                <XStack py="$1" px="$3" key={index}>
                  <Text>•</Text>
                  <Text pl="$1.5">{action}</Text>
                </XStack>
              ))}
            </View>
          )}

          {/* Bible Verses */}
          {gem.bible_verses && (
            <View p="$4">
              <H3 p="$2">Supporting Scriptures</H3>
              {gem.bible_verses.map((verse, index) => (
                <XStack py="$1" px="$3" key={index}>
                  <Text>•</Text>
                  <Text pl="$1.5">{verse}</Text>
                </XStack>
              ))}
            </View>
          )}

          {/* Related Topics */}
          {gem.related_topics && (
            <View p="$4">
              <H3 p="$2">Related Topics</H3>
              {gem.related_topics.map((topic, index) => (
                <XStack py="$1" px="$3" key={index}>
                  <Text>•</Text>
                  <Text pl="$1.5">{topic}</Text>
                </XStack>
              ))}
            </View>
          )}

          {gem.transcript && (
            <View p="$4">
              <H3 p="$2">Transcript</H3>
              <Text py="$1" px="$3">
                {gem.related_topics.map((transcript, index) => (
                  <Text py="$1" px="$3" key={index}>
                    {transcript}
                  </Text>
                ))}
              </Text>
            </View>
          )}
        </YStack>
      </ScrollView>
    </>
  )
}
