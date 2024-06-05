import { GroupModel } from '@/models/Group'
import { MyContext } from '@/helpers/bot'

export default async function watchGroups(ctx: MyContext) {
  try {
    // Fetch groups sorted by catch_count in descending order
    const groups = await GroupModel.find().sort({ catch_count: -1 }).exec()

    if (groups.length === 0) {
      await ctx.reply('Нет чатов.')
      return
    }

    // Prepare the response
    let response = 'Текущие чаты:\n\n'

    groups.forEach((group, index) => {
      const groupTitle = group.title || 'Unknown'
      const groupUsername = group.group_username || 'Unknown'
      response += `${
        index + 1
      }) ${groupTitle} (@${groupUsername})\nПоймано сообщений: ${
        group.catch_count
      }\n`
    })

    // Send the response
    await ctx.reply(response)
  } catch (error) {
    console.error('Error fetching group statistics:', error)
    await ctx.reply('Возникла ошибка. Пожалуйста, попробуйте еще раз.')
  }
}
