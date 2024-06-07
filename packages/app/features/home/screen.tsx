import { Database } from '@my/supabase/types'
import {
  ScrollView,
  XStack,
  YStack,
  GemCard,
  H2,
  Text,
  Button,
  AnimatePresence,
  isWeb,
  Skeleton,
} from '@my/ui'
import { ArrowDown } from '@tamagui/lucide-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDuration } from 'app/utils/formatDuration'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { format } from 'date-fns'
import React, { useEffect } from 'react'
import { Link } from 'solito/link'

type Gem = Database['public']['Tables']['gems']['Row']

type GemCardsProps = {
  gems?: Gem[]
}

const usePostHog = isWeb
  ? require('posthog-js').usePostHog
  : require('posthog-react-native').usePostHog
export function HomeScreen() {
  const { data: gems, isLoading } = useUserGems()

  const posthog = usePostHog?.()
  const { user } = useUser()

  useEffect(() => {
    if (user?.email && posthog) {
      posthog.identify(user.email)
    }
  }, [user?.email, posthog])
  return (
    <XStack>
      <ScrollView f={3} fb={0}>
        <YStack gap="$3" pt="$5" pb="$8">
          {isLoading ? (
            <AnimatePresence>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </AnimatePresence>
          ) : (
            <GemCards gems={gems} />
          )}
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

  const addGem = async (newGem: Gem) => {
    // Optimistically update the query data
    queryClient.setQueryData(['userGems', user?.id], (prevGems: Gem[] | undefined) => [
      newGem,
      ...(prevGems || []),
    ])

    // Send the new gem to the server
    await supabase.from('gems').insert(newGem)
  }

  const updateGem = async (updatedGem: Gem) => {
    // Optimistically update the query data
    queryClient.setQueryData(['userGems', user?.id], (prevGems: Gem[] | undefined) =>
      prevGems?.map((gem) => (gem.id === updatedGem.id ? updatedGem : gem))
    )

    // Send the updated gem to the server
    await supabase.from('gems').update(updatedGem).eq('id', updatedGem.id)
  }

  const deleteGem = async (gemId: number) => {
    // Optimistically update the query data
    queryClient.setQueryData(['userGems', user?.id], (prevGems: Gem[] | undefined) =>
      prevGems?.filter((gem) => gem.id !== gemId)
    )

    // Send the delete request to the server
    await supabase.from('gems').delete().eq('id', gemId)
  }

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
            queryClient.setQueryData(['userGems', user?.id], (prevGems: Gem[] | undefined) =>
              prevGems?.filter((gem) => gem.id !== payload.old.id)
            )
          } else if (payload.eventType === 'INSERT') {
            queryClient.setQueryData(['userGems', user?.id], (prevGems: Gem[] | undefined) => [
              payload.new as Gem,
              ...(prevGems || []),
            ])
          } else if (payload.eventType === 'UPDATE') {
            queryClient.setQueryData(
              ['userGems', user?.id],
              (prevGems: Gem[] | undefined) =>
                prevGems?.map((gem) => (gem.id === payload.new.id ? payload.new : gem)) as Gem[]
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, queryClient])

  return { ...query, addGem, updateGem, deleteGem }
}

const GemCards: React.FC<GemCardsProps> = ({ gems }) => {
  const { data: userGems = [], isLoading, error, addGem, updateGem, deleteGem } = useUserGems()

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

  if (sortedGems.length === 0) {
    return (
      <YStack ai="center" jc="center" f={1} gap="$2" py="$3">
        {!isWeb && (
          <>
            <H2 ai="center">Make your first Gem.</H2>
            <Text>Tap the recording button below.</Text>
            <AnimatePresence>
              <ArrowDown
                enterStyle={{
                  scale: 1.5,
                  y: -10,
                  o: 0,
                }}
                size="$4"
                animation="bouncy"
              />
            </AnimatePresence>
          </>
        )}
        {isWeb && (
          <AnimatePresence>
            <H2 ai="center">Download the app</H2>
            <Text>and record your first gem to see it displayed below.</Text>
            <ArrowDown
              enterStyle={{
                scale: 1.5,
                y: -10,
                o: 0,
              }}
              size="$4"
              animation="bouncy"
            />
            <Link href="https://testflight.apple.com/join/eAbjTD9i">
              <Button>Get Access Here</Button>
            </Link>
          </AnimatePresence>
        )}
      </YStack>
    )
  }

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
                author={gem.author ?? undefined}
                duration={formatDuration(gem.duration ?? 0)}
                date={format(new Date(gem.created_at), 'MM/dd/yyyy')}
              />
            ) : (
              <Link href={`/gem/${gem.id}`}>
                <GemCard
                  title={gem.title}
                  author={gem.author ?? undefined}
                  duration={formatDuration(gem.duration ?? 0)}
                  date={format(new Date(gem.created_at), 'MM/dd/yyyy')}
                />
              </Link>
            )}
          </YStack>
        ))}
      </YStack>
    </AnimatePresence>
  )
}
