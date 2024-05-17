import { YStack, H3, Text, View, Circle, ScrollView, AudioPlayer, Button, XStack } from '@my/ui'
import { Gem, ArrowLeftCircle, Trash2 } from '@tamagui/lucide-icons'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useGem } from 'app/utils/useGem'
import { Audio } from 'expo-av'
import { useState, useEffect, useCallback } from 'react'
import { Pressable } from 'react-native'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { AlertDialog } from 'tamagui'
import { useFocusEffect } from 'expo-router'

const { useParam } = createParam<{ id: string }>()

export const IdScreen = () => {
  const supabase = useSupabase()

  const { back } = useRouter()
  const [id] = useParam('id')
  const gemId = id ? parseInt(id, 10) : undefined

  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isSoundLoading, setIsSoundLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)
  const [soundError, setSoundError] = useState<string | null>(null)

  const { data: gem, isLoading: isGemLoading, error: gemError } = useGem(gemId)

  useEffect(() => {
    const loadSound = async () => {
      setIsSoundLoading(true)
      try {
        console.log('Loading audio:', gem.audio_url)
        const { data: signedUrl, error: signedUrlError } = await supabase.storage
          .from('gem-audio')
          .createSignedUrl(gem.audio_url, 600)

        if (signedUrlError) {
          console.error('Error getting signed URL:', signedUrlError)
          setSoundError('Failed to load audio')
          setIsSoundLoading(false)
          return
        }

        console.log('Signed URL:', signedUrl)

        const { sound, status } = await Audio.Sound.createAsync({ uri: signedUrl.signedUrl })
        sound.setAudioMode
        setSound(sound)
        console.log('Sound loaded:', status)

        sound.setOnPlaybackStatusUpdate((status) => {
          console.log('Playback status:', status.positionMillis)
          setPlaying(status.isPlaying)
          setProgress(status.positionMillis / (status.durationMillis || 1))
          setRemainingTime(status.durationMillis - status.positionMillis)
        })

        setIsSoundLoading(false)
      } catch (error) {
        console.error('Error loading audio:', error)
        setSoundError('Failed to load audio')
        setIsSoundLoading(false)
      }
    }

    if (gem && gem.audio_url) {
      loadSound()
    }

    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [gem])

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (sound && playing) {
          sound.pauseAsync()
        }
      }
    }, [sound, playing])
  )

  const playPause = async () => {
    if (sound) {
      if (playing) {
        await sound.pauseAsync()
      } else {
        await sound.playAsync()
      }
    }
  }

  const handleSliderValueChange = async (value: number) => {
    if (sound && gem) {
      const positionMillis = value * gem.duration
      await sound.setPositionAsync(positionMillis)
      setProgress(value)
      setRemainingTime(gem.duration - positionMillis)
    }
  }

  if (isGemLoading) {
    return <Text>Loading gem data...</Text>
  }

  if (gemError) {
    return <Text>Error: {gemError.message}</Text>
  }

  if (!gem) {
    return <Text>Gem not found</Text>
  }

  const onGoBack = () => {
    back()
  }

  const handleDelete = async () => {
    if (gemId) {
      console.log('Gem deleted:', gemId)

      const { data, error } = await supabase.from('gems').delete().eq('id', gemId)

      if (error) {
        console.error('Error deleting gem:', error)
      } else {
        back()
      }
    }
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
        <YStack ai="center">
          <View jc="center" ai="center" br="$20">
            <Circle bg="$gray5" size="$5">
              <Gem size="$3" />
            </Circle>
          </View>
          <H3 p="$2">{gem.title}</H3>
          <Text pb="$3">{gem.author}</Text>
          <AudioPlayer
            url={gem.audio_url}
            durationMillis={gem.duration}
            isSoundLoading={isSoundLoading}
            playing={playing}
            progress={progress}
            remainingTime={remainingTime}
            error={soundError}
            playPause={playPause}
            handleSliderValueChange={handleSliderValueChange}
          />
        </YStack>
        <YStack $platform-web={{ w: 500 }}>
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
                  <Text pl=yarn build
"$1.5">{topic}</Text>
                </XStack>
              ))}
            </View>
          )}

          {gem.transcript && (
            <View p="$4">
              <H3 p="$2">Transcript</H3>
              <Text py="$1" px="$3">
                <YStack space="$1">
                  {gem.transcript.map((paragraph, index) => (
                    <Text py="$1" px="$3" key={index}>
                      {paragraph}
                    </Text>
                  ))}
                </YStack>
              </Text>
            </View>
          )}
        </YStack>
      </ScrollView>
    </>
  )
}
