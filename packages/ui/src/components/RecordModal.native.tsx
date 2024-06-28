import { Sheet, Text, Input, Waveform, YStack, XStack } from '@my/ui'
import { StopCircle, CheckCircle, X } from '@tamagui/lucide-icons'
import { formatDuration } from 'app/utils/formatDuration'
import { Alert } from 'react-native'

type RecordModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  isRecording: boolean
  setIsRecording: (isRecording: boolean) => void
  duration: number
  meteringData: number[]
  stopRecording: () => void
  finalDuration: number
  author: string
  setAuthor: (author: string) => void
  saveRecording: (durationMillis: number, title: string, author: string) => void
  recordingUri: string
}

export const RecordModal = ({
  open,
  setOpen,
  isRecording,
  setIsRecording,
  duration,
  meteringData,
  stopRecording,
  finalDuration,
  author,
  setAuthor,
  saveRecording,
  recordingUri,
}: RecordModalProps) => {
  return (
    <Sheet modal moveOnKeyboardChange open={open} snapPoints={[35]} dismissOnOverlayPress={false}>
      <Sheet.Overlay />
      <Sheet.Frame>
        <Sheet.ScrollView>
          {isRecording ? (
            <YStack ai="center" jc="center" f={1} space="$4" p="$4">
              <Text>{formatDuration(duration)}</Text>
              <Waveform data={meteringData} />
              <StopCircle size="$4" onPress={stopRecording} />
            </YStack>
          ) : (
            <YStack ai="center" jc="center" m="auto" f={1} space="$4" p="$4">
              <Input
                w={250}
                placeholder="Who gave you this word?"
                value={author}
                onChangeText={setAuthor}
              />
              <Text>{formatDuration(finalDuration)}</Text>
              <XStack p="$4" w="80%" jc="space-between" gap={20}>
                <CheckCircle
                  size="$4"
                  onPress={async () => {
                    setOpen(false)
                    saveRecording(finalDuration, recordingUri, author)
                    setAuthor('')
                  }}
                />
                <X
                  size="$4"
                  col="$red10"
                  onPress={() => {
                    Alert.alert(
                      'Confirm Delete',
                      'Are you sure you want to permanently delete this recording?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => {
                            setOpen(false)
                            setAuthor('')
                          },
                        },
                      ],
                      { cancelable: false }
                    )
                  }}
                />
              </XStack>
            </YStack>
          )}
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
