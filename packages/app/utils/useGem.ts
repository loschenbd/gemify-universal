import { useQuery } from '@tanstack/react-query'
import { useSupabase } from 'app/utils/supabase/useSupabase'

export interface GemType {
  id: number
  title: string
  author: string
  audio_url: string
  duration: number
  main_points?: string[]
  summary?: string
  stories?: string[]
  follow_up?: string[]
  action_items?: string[]
  bible_verses?: string[]
  related_topics?: string[]
  transcript?: string[]
}

function useGem(gemId?: number) {
  const supabase = useSupabase()

  const { data, isLoading, error } = useQuery(['gem', gemId], {
    queryFn: async () => {
      if (gemId === undefined) {
        return null
      }

      const { data, error } = await supabase.from('gems').select('*').eq('id', gemId).single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
  })

  return { data, isLoading, error }
}

export { useGem }
