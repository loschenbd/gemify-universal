import { Database } from '@my/supabase/types'
import {
  YStack,
  H3,
  Text,
  Paragraph,
  XStack,
  View,
  ScrollView,
  Skeleton,
  H2,
  BackButton,
} from '@my/ui'
import { ArrowUpRight } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { format } from 'date-fns'
import { Link } from 'solito/link'

type ProcessedGem = {
  gemId: string | number
  positive_declarations: string[]
  // Add other properties if needed
}

type DailyUpdate = Database['public']['Tables']['daily_updates']['Row']

function isProcessedGem(obj: any): obj is ProcessedGem {
  return (
    obj &&
    (typeof obj.gemId === 'string' || typeof obj.gemId === 'number') &&
    Array.isArray(obj.positive_declarations)
  )
}

export const DailyUpdateScreen = () => {
  const supabase = useSupabase()
  const { user } = useUser()
  const dbCurrentDate = format(new Date(), 'yyyy-MM-dd')
  const currentDate = format(new Date(), 'MMMM do, yyyy')

  const {
    data: dailyUpdate,
    isLoading: isDailyUpdateLoading,
    error: dailyUpdateError,
  } = useQuery<DailyUpdate | null>(['dailyUpdate', user?.id, dbCurrentDate], async () => {
    if (user?.id) {
      const { data, error } = await supabase
        .from('daily_updates')
        .select('*')
        .eq('profile_id', user.id)
        .eq('date', dbCurrentDate)
        .single()

      if (error) {
        console.error('Error fetching daily update:', error)
        console.error('Profile ID:', user.id)
        console.error('Current Date:', dbCurrentDate)
        throw new Error('Daily update not found')
      }

      return data
    }

    return null
  })

  if (isDailyUpdateLoading) {
    return (
      <ScrollView>
        <YStack ai="center">
          <Skeleton />
        </YStack>
      </ScrollView>
    )
  }

  if (dailyUpdateError) {
    console.error('Daily update error:', dailyUpdateError)
    return (
      <Text>
        Error: {dailyUpdateError instanceof Error ? dailyUpdateError.message : 'Unknown error'}
      </Text>
    )
  }

  if (!dailyUpdate) {
    console.warn('Daily update not found')
    console.warn('Profile ID:', user?.id)
    console.warn('Current Date:', dbCurrentDate)
    return <Text>Daily update not found</Text>
  }

  return (
    <ScrollView>
      <BackButton />
      <YStack>
        <View f={1} ai="center" p="$4">
          <H2>{currentDate}</H2>
        </View>
        {/* Devotional */}
        <View p="$4">
          <H3 p="$2">Devotional</H3>
          <Paragraph p="$2">{dailyUpdate.devotional}</Paragraph>
        </View>

        {/* Positive Declarations */}
        <View px="$4">
          <H3 p="$2">Declarations</H3>
          {dailyUpdate.processed_gems?.map((gem, gemIndex) => (
            <View key={gemIndex}>
              {console.log('Gem:', gem)}
              {isProcessedGem(gem) ? (
                <>
                  {console.log('Positive Declarations:', gem.positive_declarations)}
                  {gem.positive_declarations.map((declaration, declarationIndex) => (
                    <View py="$1" px="$3" key={declarationIndex}>
                      <XStack>
                        <Paragraph pr="$1.5" size="$6">
                          •
                        </Paragraph>
                        <Paragraph>
                          {declaration}
                          <Paragraph>
                            <Link href={`/gem/${gem.gemId}`}>
                              <ArrowUpRight size="$1" />
                            </Link>
                          </Paragraph>
                        </Paragraph>
                      </XStack>
                    </View>
                  ))}
                </>
              ) : (
                console.log('Not a processed gem:', gem)
              )}
            </View>
          ))}
        </View>

        {/* Prayer */}
        <View p="$4">
          <H3 p="$2">Prayer</H3>
          <Paragraph p="$2">{dailyUpdate.prayer}</Paragraph>
        </View>
      </YStack>
    </ScrollView>
  )
}
export const screenOptions = {
  headerShown: false,
}
