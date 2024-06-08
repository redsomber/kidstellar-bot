import { GroupModel } from '@/models/Group'
import { Mutex } from 'async-mutex'
import { RecipientModel } from '@/models/Recipient'
import { UserMessage, UserMessageModel } from '@/models/Message'
import { UserModel } from '@/models/User'
import bot from '@/helpers/bot'
import env from '@/helpers/env'
import messagePattern from '@/helpers/messagePattern'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const messageProcessingMutex = new Mutex()

export default async function watchUserMessages() {
  const changeStream = await UserMessageModel.watch([], {
    fullDocument: 'updateLookup',
  })

  changeStream.on(
    'change',
    async (change: { operationType: string; fullDocument: any }) => {
      if (change.operationType === 'insert') {
        await messageProcessingMutex.runExclusive(async () => {
          const newMessage: UserMessage = change.fullDocument

          // Fetch group and user details
          const group = await GroupModel.findOne({
            group_id: newMessage.group_id,
          })
          const user = await UserModel.findOne({ user_id: newMessage.user_id })

          // Fetch all recipients (observers)
          const recipients = await RecipientModel.find().select('user_id -_id')

          // Create the message text
          const messageText = messagePattern(
            group?.title, // Assuming the new message has a title field
            group?.group_username, // Assuming the new message has a group_username field
            newMessage.text,
            user?.username, // Assuming the new message has a username field
            newMessage.keyword
          )

          // Send the message to each recipient
          for (const recipient of recipients) {
            try {
              await bot.api.sendMessage(recipient.user_id, messageText)

              console.log(newMessage.keyword, recipient)
            } catch (error) {
              console.error(
                `Failed to send message to user ${recipient.user_id}`,
                error
              )
            }
            await delay(env.DELAY)
          }
        })
      }
    }
  )

  changeStream.on('error', (error: any) => {
    console.error('Change stream error:', error)
  })
}
