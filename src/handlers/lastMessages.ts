import { GroupModel } from '@/models/Group'
import { MyContext } from '@/helpers/bot'
import { UserMessageModel } from '@/models/Message'
import { UserModel } from '@/models/User'

export default async function lastMessages(ctx: MyContext) {
  try {
    // Fetch the last 3 messages
    const messages = await UserMessageModel.find()
      .sort({ createdAt: -1 })
      .limit(5)

    if (messages.length === 0) {
      await ctx.reply('Нет сообщений.')
      return
    }

    // Prepare the response

    for (const message of messages) {
      // Fetch the group details
      const group = await GroupModel.findOne({ group_id: message.group_id })
      const groupTitle = group?.title || 'Unknown'
      const groupUsername = group?.group_username || 'Unknown'

      // Fetch the user details
      const user = await UserModel.findOne({ user_id: message.user_id })
      const username = user?.username || 'Unknown User'

      const messageDate = message.createdAt?.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })

      // Format the message
      const response = `Чат: ${groupTitle}\nЛинк: @${groupUsername}\n\nОт: @${username}\nДата: ${messageDate}\nСообщение:\n${message.text}`
      await ctx.reply(response)
    }

    // Send the response
  } catch (error) {
    console.error('Error fetching last 3 messages:', error)
    await ctx.reply('Возникла ошибка. Пожалуйста, попробуйте еще раз.')
  }
}
