import { GroupModel } from '@/models/Group'
import { MyContext } from '@/helpers/bot'
import { UserMessageModel } from '@/models/Message'
import { UserModel } from '@/models/User'

export default async function lastMessages(ctx: MyContext) {
  try {
    const messages = await UserMessageModel.find()
      .sort({ createdAt: -1 })
      .limit(5)

    if (messages.length === 0) {
      await ctx.reply('Нет сообщений.')
      return
    }

    for (const message of messages) {
      const group = await GroupModel.findOne({ group_id: message.group_id })
      const groupTitle = group?.title || 'Unknown'
      const groupUsername = group?.group_username || 'Unknown'

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

      const response = `Чат: ${groupTitle}\nЛинк: @${groupUsername}\n\nОт: @${username}\nДата: ${messageDate}\nСообщение:\n${message.text}`
      await ctx.reply(response)
    }
  } catch (error) {
    console.error('Error fetching last 3 messages:', error)
    await ctx.reply('Возникла ошибка. Пожалуйста, попробуйте еще раз.')
  }
}
