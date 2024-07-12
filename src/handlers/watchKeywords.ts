import { KeywordModel } from '@/models/Keyword'
import { MyContext } from '@/helpers/bot'

export default async function watchKeywords(ctx: MyContext) {
  try {
    const groups = await KeywordModel.find().sort({ catch_count: -1 }).exec()

    if (groups.length === 0) {
      await ctx.reply('Нет ключей.')
      return
    }

    let response = 'Текущие ключи:\n\n'

    groups.forEach((keyword, index) => {
      const foundKeyword = keyword.word
      response += `${index + 1}) ${foundKeyword}\nПоймано сообщений: ${
        keyword.catch_count
      }\n`
    })

    await ctx.reply(response)
  } catch (error) {
    console.error('Error fetching group statistics:', error)
    await ctx.reply('Возникла ошибка. Пожалуйста, попробуйте еще раз.')
  }
}
