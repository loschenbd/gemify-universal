import { ScrollView, XStack, YStack, GemCard, Text, AnimatePresence } from '@my/ui'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDuration } from 'app/utils/formatDuration'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import React, { useEffect } from 'react'
import { Link } from 'solito/link'

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
  const queryClient = useQueryClient()

  const query = useQuery(
    ['userGems', user?.id],
    async () => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from('gems')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching gems:', error.message)
        throw error
      }

      return data as Gem[]
    },
    {
      enabled: !!user?.id,
    }
  )

  useEffect(() => {
    if (!user?.id) return

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
          if (payload.eventType === 'DELETE') {
            // Remove the deleted gem from the query data
            queryClient.setQueryData(['userGems', user?.id], (prevGems: Gem[] | undefined) =>
              prevGems?.filter((gem) => gem.id !== payload.old.id)
            )
          } else {
            // Refetch the data when a new gem is added or updated
            query.refetch()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, query, queryClient])

  return query
}

const GemCards: React.FC = () => {
  const { data: userGems = [], isLoading, error } = useUserGems()

  if (isLoading) {
    return <Text>...Loading</Text>
  }

  if (error) {
    return <Text>Error: {(error as Error).message}</Text>
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
