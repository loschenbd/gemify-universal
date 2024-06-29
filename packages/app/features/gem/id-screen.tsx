import { Database } from '@my/supabase/types'
import {
  YStack,
  H3,
  Text,
  Paragraph,
  View,
  Circle,
  ScrollView,
  AudioPlayer,
  Button,
  XStack,
  Skeleton,
  ShareGemModal,
  isWeb,
  BackButton,
} from '@my/ui'
import { Gem as GemIcon, Trash2, Share } from '@tamagui/lucide-icons'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { Audio, AVPlaybackStatus } from 'expo-av'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import { useState, useEffect } from 'react'
import { Pressable } from 'react-native'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { AlertDialog } from 'tamagui'

type Gem = Database['public']['Tables']['gems']['Row']

type IdScreenProps = {
  sharedToken?: string
}

const { useParam } = createParam<{ id: string; sharedToken?: string }>()

export const IdScreen = ({ sharedToken }: IdScreenProps) => {
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { user } = useUser()

  const { back } = useRouter()
  const [id, setId] = useParam('id')
  const [urlSharedToken] = useParam('sharedToken')
  const gemId = id ? parseInt(id, 10) : undefined

  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined)
  const [isSoundLoading, setIsSoundLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)
  const [soundError, setSoundError] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const token = sharedToken

  const {
    data: gem,
    isLoading: isGemLoading,
    error: gemError,
  } = useQuery<Gem | null>(['gem', gemId, token], async () => {
    if (token) {
      const { data, error } = await supabase
        .from('gems')
        .select('*')
        .eq('sharing_token', token)
        .single()

      if (error) {
        throw new Error('Gem not found')
      }

      return data
    } else if (gemId) {
      const { data, error } = await supabase.from('gems').select('*').eq('id', gemId).single()

      if (error) {
        throw new Error('Gem not found')
      }

      return data
    }

    return null
  })
  useEffect(() => {
    let isMounted = true

    const loadSound = async () => {
      setIsSoundLoading(true)
      try {
        console.log('Loading audio:', gem?.audio_url)
        if (gem?.audio_url) {
          const { data: signedUrl, error: signedUrlError } = await supabase.storage
            .from('gem-audio')
            .createSignedUrl(gem?.audio_url, 600)

          if (signedUrlError) {
            console.error('Error getting signed URL:', signedUrlError)
            setSoundError('Failed to load audio')
            setIsSoundLoading(false)
            return
          }

          if (signedUrlError) {
            console.error('Error getting signed URL:', signedUrlError)
            setSoundError('Failed to load audio')
            setIsSoundLoading(false)
            return
          }

          console.log('Signed URL:', signedUrl)

          const { sound, status } = await Audio.Sound.createAsync({
            uri: signedUrl.signedUrl,
          })

          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
          })

          if (isMounted) {
            setSound(sound)
            console.log('Sound loaded:', status)

            sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
              if (isMounted) {
                console.log('Playback status:', status.isLoaded ? status.positionMillis : undefined)
                setPlaying(status.isLoaded ? status.isPlaying : false)
                setProgress(
                  status.isLoaded ? status.positionMillis / (status.durationMillis || 1) : 0
                )
                setRemainingTime(
                  status.isLoaded ? (status.durationMillis || 0) - status.positionMillis : 0
                )
              }
            })

            setIsSoundLoading(false)
          }
        }
      } catch (error) {
        console.error('Error loading audio:', error)
        if (isMounted) {
          setSoundError('Failed to load audio')
          setIsSoundLoading(false)
        }
      }
    }

    if (gem && gem.audio_url) {
      loadSound()
    }

    return () => {
      isMounted = false

      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [gem])

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [sound])

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
      const positionMillis = gem.duration ? value * gem.duration : 0

      await sound.setPositionAsync(positionMillis)
      setProgress(value)
      setRemainingTime(gem.duration ? gem.duration - positionMillis : 0)
    }
  }

  if (isGemLoading) {
    return (
      <ScrollView>
        <YStack ai="center">
          <Skeleton />
        </YStack>
      </ScrollView>
    )
  }

  if (gemError) {
    return <Text>Error: {gemError instanceof Error ? gemError.message : 'Unknown error'}</Text>
  }

  if (!gem) {
    return <Text>Gem not found</Text>
  }

  const onGoBack = () => {
    back()
  }

  const generateSharingToken = () => {
    return nanoid()
  }
  const handleShare = async () => {
    if (gem) {
      let token = gem.sharing_token

      if (!token) {
        // Generate a new token only if one doesn't exist
        token = generateSharingToken()
        console.log('Generated sharing token:', token)

        // Update the gem's data in the Supabase database
        const { data, error } = await supabase
          .from('gems')
          .update({ sharing_token: token })
          .eq('id', gem.id)
          .single()

        if (error) {
          console.error('Error updating gem with sharing token:', error)
          // Handle the error, show an error message, etc.
          return
        }

        // Update the local gem data with the new sharing token
        gem.sharing_token = token
      }

      // Open the ShareGemModal with the generated sharing token
      console.log(gem.id, token)
      setIsShareModalOpen(true)
    }
  }
  const handleDelete = async () => {
    if (gemId) {
      console.log('Deleting gem:', gemId)

      // Optimistically update the UI by removing the deleted gem
      queryClient.setQueryData(['userGems', user?.id], (prevGems: Gem[] | undefined) =>
        prevGems?.filter((gem) => gem.id !== gemId)
      )

      try {
        // Delete the gem record from the database
        const { error: deleteError } = await supabase.from('gems').delete().eq('id', gemId)

        if (deleteError) {
          throw new Error('Error deleting gem record')
        }

        console.log('Gem record deleted successfully')

        // Delete the audio file from storage
        if (gem && gem.audio_url) {
          const { error } = await supabase.storage.from('audio').remove([gem.audio_url])

          if (error) {
            console.error('Error removing audio:', error)
            throw error
          }
        }

        console.log('Audio file deleted successfully')

        back()
        console.log('Navigation back triggered')
      } catch (error) {
        console.error('Error deleting gem:', error)
        // If the deletion fails, revert the optimistic update
        queryClient.setQueryData(['userGems', user?.id], (prevGems: Gem[] | undefined) => [
          gem,
          ...(prevGems || []),
        ])
        console.log('Optimistic update reverted')
      }
    }
  }

  return (
    <>
      <ScrollView>
        <YStack ai="center">
          {user?.id === gem.profile_id && (
            <XStack w="100%" px="$4" ai="center" jc="space-between">
              <BackButton />
              <AlertDialog>
                <AlertDialog.Trigger asChild>
                  <View>
                    <Trash2 jc="flex-end" size="$2" col="$gray10" />
                  </View>
                </AlertDialog.Trigger>

                <AlertDialog.Portal>
                  <AlertDialog.Overlay
                    key="overlay"
                    animation="quick"
                    enterStyle={{ o: 1 }}
                    exitStyle={{ o: 0 }}
                  />
                  <AlertDialog.Content
                    bordered
                    elevate
                    key="content"
                    animation={[
                      'quick',
                      {
                        o: {
                          overshootClamping: true,
                        },
                      },
                    ]}
                    enterStyle={{ x: 0, y: -20, o: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, o: 0, scale: 0.95 }}
                    x={0}
                    scale={1}
                    o={1}
                    y={0}
                  >
                    <YStack gap>
                      <AlertDialog.Title>Delete Gem?</AlertDialog.Title>
                      <AlertDialog.Description>
                        This will permanently delete your gem. Are you sure you want to continue?
                      </AlertDialog.Description>

                      <XStack gap="$3" jc="flex-end">
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
          )}
          <YStack ai="center">
            <View jc="center" ai="center" br="$10">
              <Circle bg="$gray5" size="$5">
                <GemIcon size="$3" />
              </Circle>
            </View>
            <XStack ai="center">
              <H3 p="$2">{gem.title}</H3>
            </XStack>
            <Text pb="$3">{gem.author}</Text>
            <XStack ai="center">
              {gem.audio_url && (
                <AudioPlayer
                  url={gem.audio_url}
                  durationMillis={gem.duration ?? 0}
                  isSoundLoading={isSoundLoading}
                  playing={playing}
                  progress={progress}
                  remainingTime={remainingTime}
                  error={soundError}
                  playPause={playPause}
                  handleSliderValueChange={handleSliderValueChange}
                />
              )}
              {!isWeb && (
                <>
                  <Pressable onPress={handleShare}>
                    <Share ml="$4" />
                  </Pressable>
                  <ShareGemModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    sharingToken={gem.sharing_token}
                    id={gem.id}
                  />
                </>
              )}
            </XStack>
          </YStack>
          <YStack
            $gtMd={{
              w: 500,
              ai: 'flex-start',
            }}
          >
            {/* Main Points */}
            {gem.main_points && (
              <View p="$4">
                <H3 p="$2">Main Points</H3>
                {gem.main_points.map((point, index) => (
                  <XStack py="$1" px="$3" key={index}>
                    <Paragraph>•</Paragraph>
                    <Paragraph pl="$1.5">{point}</Paragraph>
                  </XStack>
                ))}
              </View>
            )}

            {/* Summary */}
            {gem.summary && (
              <View p="$4">
                <H3 p="$2">Summary</H3>
                <Paragraph py="$1" px="$3">
                  {gem.summary}
                </Paragraph>
              </View>
            )}

            {/* Stories, Examples, Citations */}
            {gem.stories && (
              <View p="$4">
                <H3 p="$2">Stories, Examples, Citations</H3>
                {gem.stories.map((item, index) => (
                  <XStack py="$1" px="$3" key={index}>
                    <Paragraph>•</Paragraph>
                    <Paragraph pl="$1.5">{item}</Paragraph>
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
                    <Paragraph>•</Paragraph>
                    <Paragraph pl="$1.5">{question}</Paragraph>
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
                    <Paragraph>•</Paragraph>
                    <Paragraph pl="$1.5">{action}</Paragraph>
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
                    <Paragraph>•</Paragraph>
                    <Paragraph pl="$1.5">{verse}</Paragraph>
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
                    <Paragraph>•</Paragraph>
                    <Paragraph pl="$1.5">{topic}</Paragraph>
                  </XStack>
                ))}
              </View>
            )}

            {gem.transcript && (
              <View p="$4">
                <H3 p="$2">Transcript</H3>
                <Text py="$1" px="$3">
                  <YStack gap="$1">
                    {gem.transcript.map((paragraph, index) => (
                      <Paragraph py="$1" px="$3" key={index}>
                        {paragraph}
                      </Paragraph>
                    ))}
                  </YStack>
                </Text>
              </View>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </>
  )
}
