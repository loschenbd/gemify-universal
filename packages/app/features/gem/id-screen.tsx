import { YStack, H1, H3, Text, Button, View, Circle, H4, H6, XStack, Slider, Spinner } from '@my/ui'
import { Gem, Pause, PauseCircle, Play, PlayCircle } from '@tamagui/lucide-icons'
import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'

import { linkMockup } from '../home/screen'
import { set } from 'zod'
import { Pressable } from 'react-native'

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

  return (
    <>
      <YStack alignItems="center">
        <View justify-content="center" alignItems="center" borderRadius="$20" padding="$2">
          <Circle backgroundColor="$gray4" size="$5">
            <Gem size="$3" />
          </Circle>
        </View>
        <H1>{title}</H1>
        <H4>{author}</H4>
        <H6>Tags</H6>
        <AudioPLayer />
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

export const AudioPLayer = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function playSound() {
    console.log('Loading Sound')
    const { sound } = await Audio.Sound.createAsync({
      uri: 'https://lzeujpdftfnvelzhknqe.supabase.co/storage/v1/object/sign/gem-audio/testfile.m4a?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnZW0tYXVkaW8vdGVzdGZpbGUubTRhIiwiaWF0IjoxNzEyODY4OTM2LCJleHAiOjE3MTM0NzM3MzZ9.aNR2JY_NjSmR3qB9tvqrdHIRkoWO57CgYKElXbfLm6M&t=2024-04-11T20%3A55%3A36.201Z',
    })

    setSound(sound)
    setIsPlaying(true)
    await sound.playAsync().catch((error) => {
      console.error(error)
    })
  }

  // TODO: Add Loading Spinner
  async function pauseSound(AudioPlayerViewProps) {
    setIsPlaying(false)
    await sound?.pauseAsync()
  }
  return (
    <>
      <XStack alignItems="center" space="$2">
        <View>
          {error ? (
            <Text>{error}</Text>
          ) : (
            <View>
              {isPlaying ? (
                <Pressable onPress={pauseSound}>
                  <Pause />
                </Pressable>
              ) : (
                <Pressable onPress={playSound}>
                  <Play />
                </Pressable>
              )}
            </View>
          )}
        </View>
        <Slider size="$1" width={200} defaultValue={[0]} max={100} step={1}>
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb index={0} circular elevate />
        </Slider>
      </XStack>
    </>
  )
}
