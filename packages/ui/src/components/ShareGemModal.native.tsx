import { Theme, YStack, Text, XStack, Button, Dialog, Input, useToastController } from '@my/ui'
import * as Clipboard from 'expo-clipboard'
import QRCode from 'react-native-qrcode-svg'

type ShareGemModalProps = {
  isOpen: boolean
  onClose: () => void
  sharingToken: string
  id: string
}

export const ShareGemModal = ({ isOpen, onClose, sharingToken, id }: ShareGemModalProps) => {
  // const deepLinkUrl = `gemify://gem/${id}?sharedToken=${sharingToken}`
  const fallbackWebUrl = `${process.env.NEXT_PUBLIC_URL}/gem/${id}?sharedToken=${sharingToken}`

  // const shareableUrl = `${deepLinkUrl}&fallback=${encodeURIComponent(fallbackWebUrl)}`
  const toast = useToastController()

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(fallbackWebUrl)
    toast.show('Shareable URL copied to clipboard!', {
      duration: 2000,
    })
  }

  return (
    <Theme>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* <Dialog.Trigger asChild>
          <Button>Share</Button>
        </Dialog.Trigger> */}

        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            o={0.5}
            enterStyle={{ o: 0 }}
            exitStyle={{ o: 0 }}
          />

          <Dialog.Content
            bordered
            elevate
            key="content"
            animation={[
              'quick',
              {
                o: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, o: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, o: 0, scale: 0.95 }}
            gap
          >
            <Dialog.Title>Share Gem</Dialog.Title>
            <Dialog.Description pb="$4">
              Did you record this to give to somebody else?
            </Dialog.Description>

            <YStack gap="$4" ai="center">
              <QRCode value={fallbackWebUrl} size={200} />
              <Text>Scan the QR code or copy the link below to share it</Text>
              <XStack maw="100%" ai="center" pb="$4" gap="$4">
                <Input
                  onPressIn={copyToClipboard}
                  numberOfLines={1}
                  fs={1}
                  editable={false}
                  value={fallbackWebUrl}
                />
              </XStack>
            </YStack>

            <Dialog.Close asChild>
              <Button theme="active">Close</Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </Theme>
  )
}
