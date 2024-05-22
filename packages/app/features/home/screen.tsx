import { ScrollView, XStack, YStack, GemCard, Text, AnimatePresence } from '@my/ui'

import { useQuery } from '@tanstack/react-query'
import { formatDuration } from 'app/utils/formatDuration'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import React, { useEffect, useState } from 'react'
import { useLink, Link } from 'solito/link'

interface Gem {
  id: number
  title: string
  author: string
  date: string
  name: string
  description: string
  audio_url: string
  created_at: string
  profile_id: number
  duration: number
}
export function HomeScreen() {
  return (
    <XStack>
      <ScrollView f={3} fb={0}>
        <YStack gap="$3" pt="$5" pb="$8">
          <GemCards />
        </YStack>
      </ScrollView>
    </XStack>
  )
}
function useUserGems() {
  const { user } = useUser()
  const supabase = useSupabase()
  const [gems, setGems] = useState<Gem[]>([])

  useEffect(() => {
    if (!user?.id) return

    const fetchGems = async () => {
      const { data, error } = await supabase
        .from('gems')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching gems:', error.message)
      } else {
        setGems(data)
      }
    }

    fetchGems()

    const channel = supabase
      .channel('gems')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gems',
          filter: `profile_id=eq.${user.id}`,
        },
        (payload) => {
          setGems((prevGems) => [payload.new as Gem, ...prevGems])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  return { data: gems }
}
const GemCards = () => {
  const {
    data: userGems,
    isLoading,
    error,
  } = useUserGems() as { data: Gem[]; isLoading: boolean; error: Error | null }
  const [, setTriggerRender] = useState(0)

  useEffect(() => {
    setTriggerRender((prevTrigger) => prevTrigger + 1)
  }, [userGems])

  if (isLoading) {
    return <Text>...Loading</Text>
  }

  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  const sortedGems = userGems.sort((a, b) => {
    if (!a.title && b.title) return -1
    if (a.title && !b.title) return 1
    return 0
  })

  return (
    <AnimatePresence>
      <YStack p="$2" gap="$2">
        {sortedGems.map((gem) => (
          <YStack
            key={gem.id}
            animation="bouncy"
            enterStyle={{ o: 0, scale: 0.8 }}
            exitStyle={{ o: 0, scale: 0.8 }}
          >
            {!gem.title ? (
              <GemCard
                title="Polishing Gem"
                author={gem.author}
                duration={formatDuration(gem.duration)}
                date={gem.date}
              />
            ) : (
              <Link href={`/gem/${gem.id}`}>
                <GemCard
                  title={gem.title}
                  author={gem.author}
                  duration={formatDuration(gem.duration)}
                  date={gem.date}
                />
              </Link>
            )}
          </YStack>
        ))}
      </YStack>
    </AnimatePresence>
  )
}
