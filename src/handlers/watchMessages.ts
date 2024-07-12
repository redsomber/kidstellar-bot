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

function createChangeStream() {
  const changeStream = UserMessageModel.watch([], {
    fullDocument: 'updateLookup',
  })

  changeStream.on(
    'change',
    async (change: { operationType: string; fullDocument: any }) => {
      if (change.operationType === 'insert') {
        await messageProcessingMutex.runExclusive(async () => {
          const newMessage: UserMessage = change.fullDocument

          const group = await GroupModel.findOne({
            group_id: newMessage.group_id,
          })
          const user = await UserModel.findOne({ user_id: newMessage.user_id })

          const recipients = await RecipientModel.find().select('user_id -_id')

          const messageText = messagePattern(
            group?.title,
            group?.group_username,
            newMessage.text,
            user?.username,
            newMessage.keyword
          )

          for (const recipient of recipients) {
            try {
              await bot.api.sendMessage(recipient.user_id, messageText)
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

  changeStream.on('error', async (error: any) => {
    console.error('Change stream error:', error)
    if (
      error.message.includes('The server is in quiesce mode and will shut down')
    ) {
      console.log('Attempting to reconnect to MongoDB...')
      await delay(5000)
      await createChangeStream()
    }
  })

  return changeStream
}

export default async function watchUserMessages() {
  await createChangeStream()
}
