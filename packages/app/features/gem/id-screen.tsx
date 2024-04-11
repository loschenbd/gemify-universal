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
const audioUrl =
  'https://lzeujpdftfnvelzhknqe.supabase.co/storage/v1/object/sign/gem-audio/testfile.m4a?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnZW0tYXVkaW8vdGVzdGZpbGUubTRhIiwiaWF0IjoxNzEyODY4OTM2LCJleHAiOjE3MTM0NzM3MzZ9.aNR2JY_NjSmR3qB9tvqrdHIRkoWO57CgYKElXbfLm6M&t=2024-04-11T20%3A55%3A36.201Z'

export const AudioPLayer = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl })
      setSound(sound)

      sound.setOnPlaybackStatusUpdate((status) => {
        setPlaying(status.isPlaying)
        setProgress(status.positionMillis / status.durationMillis)
        setDuration(status.durationMillis)
      })
    }

    loadSound()

    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [])

  const handlePlayPause = async () => {
    if (sound) {
      if (playing) {
        await sound.pauseAsync()
      } else {
        await sound.playAsync()
      }
    }
  }

  const handleSliderValueChange = async (value) => {
    if (sound && sound.durationMillis && !isNaN(sound.durationMillis)) {
      try {
        await sound.setPositionAsync(value * sound.durationMillis)
      } catch (error) {
        console.error('Error setting position:', error)
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    }
  }

  const formatDuration = (durationMillis) => {
    if (!durationMillis || durationMillis === 0) {
      return '00:00' // Return a default value for 0 or undefined duration
    }

    const totalSeconds = Math.floor(durationMillis / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <XStack alignItems="center" space="$2">
        <View>
          {error ? (
            <Text>{error}</Text>
          ) : (
            <View>
              {playing ? (
                <Pressable onPress={handlePlayPause}>
                  <Pause />
                </Pressable>
              ) : (
                <Pressable onPress={handlePlayPause}>
                  <Play />
                </Pressable>
              )}
            </View>
          )}
        </View>
        <Slider
          size="$1"
          width={200}
          defaultValue={[0]}
          max={1}
          step={0.00001}
          value={[progress]} // Use the progress state as the value
          onValueChange={handleSliderValueChange}
        >
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb index={0} circular elevate />
        </Slider>
        <Text>{formatDuration(duration)}</Text>
      </XStack>
    </>
  )
}
