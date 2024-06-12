import { Theme, YStack, Text, XStack, Button, Dialog } from '@my/ui'
import QRCode from 'qrcode.react'
type ShareGemModalProps = {
  isOpen: boolean
  onClose: () => void
  sharingToken: string | null
  id: number | null
}

export const ShareGemModal = ({ isOpen, onClose, sharingToken, id }: ShareGemModalProps) => {
  // const deepLinkUrl = `gemify://gem/${id}?sharedToken=${sharingToken}`
  const fallbackWebUrl = `{${process.env.NEXT_PUBLIC_URL}/gem/${id}?sharedToken=${sharingToken}`

  const shareableUrl = `{${
    process.env.NEXT_PUBLIC_URL
  }/gem/${id}?sharedToken=${sharingToken}&fallback=${encodeURIComponent(fallbackWebUrl)}`

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
            <Dialog.Description>
              Scan the QR code or use the link below to share the gem.
            </Dialog.Description>

            <YStack gap="$4" ai="center">
              <QRCode value={shareableUrl} size={200} />
              <Text>Scan the QR code or use the link below:</Text>
              <XStack ai="center" pb="$4" gap="$2">
                <Text>{shareableUrl}</Text>
                <Button onPress={() => navigator.clipboard.writeText(shareableUrl)}>Copy</Button>
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
