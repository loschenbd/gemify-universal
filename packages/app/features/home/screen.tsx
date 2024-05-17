import { ScrollView, XStack, YStack, GemCard, Text } from '@my/ui'
import { useQuery } from '@tanstack/react-query'
import { formatDuration } from 'app/utils/formatDuration'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import React, { useEffect, useState } from 'react'
import { useLink, Link } from 'solito/link'
import { Upload } from 'tus-js-client'

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
  const [gems, setGems] = useState([])

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
          if (payload.eventType === 'INSERT') {
            setGems((prevGems) => [payload.new, ...prevGems])
          } else if (payload.eventType === 'UPDATE') {
            setGems((prevGems) => {
              const updatedGemIndex = prevGems.findIndex((gem) => gem.id === payload.new.id)
              if (updatedGemIndex !== -1) {
                const updatedGems = [...prevGems]
                updatedGems[updatedGemIndex] = payload.new
                return updatedGems
              }
              return prevGems
            })
          } else if (payload.eventType === 'DELETE') {
            setGems((prevGems) => prevGems.filter((gem) => gem.id !== payload.old.id))
          }
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
  const { data: userGems, isLoading, error } = useUserGems()

  if (isLoading) {
    return <Text>Loading...</Text>
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
    <YStack p="$2" gap="$2">
      {sortedGems.map((gem) => {
        if (!gem.title) {
          return (
            <GemCard
              key={gem.id}
              title="Polishing Gem"
              author={gem.author}
              duration={formatDuration(gem.duration)}
              date={gem.date}
            />
          )
        }

        return (
          <Link key={gem.id} replace href={`/gem/${gem.id}`}>
            <GemCard
              title={gem.title}
              author={gem.author}
              duration={formatDuration(gem.duration)}
              date={gem.date}
            />
          </Link>
        )
      })}
    </YStack>
  )
}
