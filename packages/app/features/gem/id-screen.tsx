import { YStack, H1, H3, Text, Button, View, Circle, H4, H6 } from '@my/ui'
import { Gem } from '@tamagui/lucide-icons'
import { linkMockup } from '../home/screen'
import { useEffect, useState } from 'react'
import { Audio } from 'expo-av'

export const IdScreen = () => {
  const {
    title,
    summary,
    duration,
    author,
    date,
    main_points,
    stories_examples_citations,
    follow_up_questions,
    supporting_scriptures,
    related_topics,
    transcript,
  } = linkMockup[0]

  const audio_url =
    'http://localhost:54321/storage/v1/object/public/gem-audio/Richard%20Gordon%20(needs%20edit).m4a'
  const [sound, setSound] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audio_url })
      setSound(sound)
    } catch (err) {
      setError(err)
    }
  }
  const playSound = async () => {
    try {
      if (sound) {
        await sound.playAsync()
        setIsPlaying(true)
      } else {
        console.warn('Sound object is not loaded yet')
      }
    } catch (err) {
      setError(err)
    }
  }

  const stopSound = async () => {
    try {
      await sound.stopAsync()
      setIsPlaying(false)
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => {
    loadSound()

    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [])

  return (
    <>
      <View>
        {error ? (
          <Text>{error.message}</Text>
        ) : (
          <Button onPress={isPlaying ? stopSound : playSound}>{isPlaying ? 'Stop' : 'Play'}</Button>
        )}
      </View>
      <YStack alignItems="center">
        <View justify-content="center" alignItems="center" borderRadius="$20" padding="$2">
          <Circle backgroundColor="$gray4" size="$5">
            <Gem size="$3" />
          </Circle>
        </View>
        <H1>{title}</H1>
        <H4>{author}</H4>
        <H6>Tags</H6>
      </YStack>
      <YStack p="$2" justify-content="center">
        <View>
          <H3>Main Points</H3>
          {main_points.map((point, index) => (
            <Text key={index}>• {point}</Text>
          ))}
        </View>
        <View>
          <H3>Summary</H3>
          <Text>{summary}</Text>
        </View>
        <View>
          <H3>Stories, Examples, Citations</H3>
          {stories_examples_citations.map((item, index) => (
            <Text key={index}>• {item}</Text>
          ))}
        </View>
        <View>
          <H3>Follow-up Questions</H3>
          {follow_up_questions.map((question, index) => (
            <Text key={index}>• {question}</Text>
          ))}
        </View>
        <View>
          <H3>Supporting Scriptures</H3>
          {supporting_scriptures.map((scripture, index) => (
            <Text key={index}>• {scripture}</Text>
          ))}
        </View>
        <View>
          <H3>Related Topics</H3>
          {related_topics.map((topic, index) => (
            <Text key={index}>• {topic}</Text>
          ))}
        </View>
        <View>
          <H3>Transcript</H3>
          <Text>{transcript}</Text>
        </View>
      </YStack>
    </>
  )
}
