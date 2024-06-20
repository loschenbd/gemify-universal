import { ArrowLeftCircle } from '@tamagui/lucide-icons'
import { YStack } from 'tamagui'
import { useRouter } from 'solito/router'

export type BackButtonProps = {}

export const BackButton: React.FC<BackButtonProps> = (props) => {
  const { back } = useRouter()

  const handlePress = () => {
    back()
  }
  return (
    <YStack onPress={handlePress}>
      <ArrowLeftCircle size="$3" col="$gray10" />
    </YStack>
  )
}
