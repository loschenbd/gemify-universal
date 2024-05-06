import { ScrollView, XStack, YStack, GemCard, Text } from '@my/ui'
import { api } from 'app/utils/api'
import { useQuery } from '@tanstack/react-query'
import { formatDuration } from 'app/utils/formatDuration'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import React from 'react'
import { Platform } from 'react-native'
import { useLink, Link } from 'solito/link'

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

  const { data, isLoading, error } = useQuery(['userGems', user?.id], {
    queryFn: async () => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from('gems')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
  })

  return { data, isLoading, error }
}
const GemCards = () => {
  const { data: userGems, isLoading, error } = useUserGems()
  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>Error: {error.message}</Text>
  }
  return (
    <YStack p="$2" gap="$2">
      {userGems.map((gem) => (
        <Link key={gem.id} replace href={`/gem/${gem.id}`}>
          <GemCard
            title={gem.title}
            author={gem.author}
            duration={formatDuration(gem.duration)}
            date={gem.date}
          />
        </Link>
      ))}
    </YStack>
  )
}
