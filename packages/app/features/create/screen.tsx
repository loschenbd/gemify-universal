import {
  H2,
  Paragraph,
  RecordingPopover,
  SubmitButton,
  Theme,
  YStack,
  isWeb,
  Popover,
  Button,
  Adapt,
  XStack,
  Label,
  Input,
} from '@my/ui'
import { CircleDot } from '@tamagui/lucide-icons'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { z } from 'zod'

export const CreateScreen = () => {
  return (
    <>
      <RecordModal />
      {/* <SchemaForm
        onSubmit={console.log}
        schema={z.object({
          title: formFields.text.min(10).describe("Name // Your project's name"),
          description: formFields.textarea.describe(
            'Description // I need a mobile app for this one customer...'
          ),
          numOfDays: formFields.number.min(2).max(200).describe('Number of Days // 60 '),
          paidProject: formFields.boolean.describe('Paid Project'),
          billingAddress: formFields.address.describe('Billing Address'),
          type: formFields.select.describe('Project Type'),
        })}
        defaultValues={{
          title: '',
          description: '',
          numOfDays: 10,
          paidProject: false,
          billingAddress: {
            street: '',
            zipCode: '',
          },
          type: 'code',
        }}
        props={{
          type: {
            options: [
              {
                name: 'Code',
                value: 'code',
              },
              {
                name: 'Design',
                value: 'design',
              },
              {
                name: 'Consulting',
                value: 'consulting',
              },
            ],
          },
        }}
        renderAfter={({ submit }) => (
          <Theme inverse>
            <SubmitButton onPress={() => submit()}>Submit</SubmitButton>
          </Theme>
        )}
      >
        {(fields) => (
          <>
            <YStack gap="$2" py="$4" pb="$8">
              {isWeb && <H2 ta="center">New Project</H2>}
              <Paragraph ta="center">Dummy page showing a form</Paragraph>
            </YStack>
            {Object.values(fields)}
          </>
        )}
      </SchemaForm> */}
    </>
  )
}
export const RecordModal = () => {
  return (
    <Popover size="$4" placement="bottom">
      <Popover.Trigger asChild>
        <Button icon={CircleDot}>Record</Button>
      </Popover.Trigger>
      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack space="$3">
          <XStack space="$3">
            <Label size="$3" htmlFor="Play">
              Name
            </Label>
            <Input size="$3" id="Play" />
          </XStack>

          <Popover.Close asChild>
            <Button
              size="$3"
              onPress={() => {
                /* Custom code goes here, does not interfere with popover closure */
              }}
            >
              Submit
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
