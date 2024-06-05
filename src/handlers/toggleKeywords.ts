import { Keyword, KeywordModel } from '@/models/Keyword'
import { MyContext, MyConversation } from '@/helpers/bot'
import toggleKeywordMenu from '@/menus/toggleKeywordMenu'

export default async function toggleKeywords(
  conversation: MyConversation,
  ctx: MyContext
) {
  try {
    const keywords = await KeywordModel.find().exec()

    if (keywords.length === 0) {
      await ctx.reply('Нет ключей.')
      return
    }

    const keywordList = keywords
      .map(
        (keyword, index) =>
          `${index + 1}) ${keyword.turn_on ? '✅' : '🚫'} ${keyword.word} `
      )
      .join('\n')

    await ctx.reply(
      `Доступные ключи:\n${keywordList}\n\nПожалуйста, введите номера для переключения\n\nПример:\n1/3/4`
    )

    const { message } = await conversation.wait()

    if (!message?.text) {
      return console.log('Empty message')
    }

    const input = message.text.split('/').map((num) => parseInt(num, 10) - 1)

    if (input.some((index) => index < 0 || index >= keywords.length)) {
      await ctx.reply('Ошибка ввода. Пожалуйста, попробуйте еще раз.')
      return
    }

    const selectedKeywords: Keyword[] = input.map((index) => keywords[index])
    const selectedKeywordsList = selectedKeywords
      .map(
        (keyword) =>
          `${keyword.turn_on ? '✅' : '🚫'} ${keyword.word || 'unknown'} `
      )
      .join('\n')

    conversation.session.selectedKeywords = selectedKeywords

    await ctx.reply(
      `Вы выбрали следующее ключи:\n${selectedKeywordsList}\n\nВы действительно хотите переключить их?`,
      {
        reply_markup: toggleKeywordMenu,
      }
    )
  } catch (error) {
    console.error('Failed to handle toggle group command:', error)
    await ctx.reply('Возникла ошибка. Пожалуйста, попробуйте еще раз.')
  }
}
