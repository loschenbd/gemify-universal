import { Database } from '@my/supabase/types'
import { useQuery } from '@tanstack/react-query'
import { useSupabase } from 'app/utils/supabase/useSupabase'

type Gem = Database['public']['Tables']['gems']['Row']

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

      return data as Gem
    },
  })

  return { data, isLoading, error }
}

export { useGem }
