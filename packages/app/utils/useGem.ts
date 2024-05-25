import { useQuery } from '@tanstack/react-query'
import { useSupabase } from 'app/utils/supabase/useSupabase'

interface Gem {
  id: string
  // Add other properties of a Gem here
  // For example:
  // name: string;
  // description: string;
  // ...
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

export { useGem, Gem }
