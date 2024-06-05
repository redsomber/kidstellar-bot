import { KeywordModel } from '@/models/Keyword'
import { Menu, MenuRange } from '@grammyjs/menu'
import { MyContext } from '@/helpers/bot'
import setRebootFlag from '@/helpers/rebootFlag'

const toggleKeywordMenu = new Menu<MyContext>('toggleKeyword')
toggleKeywordMenu.dynamic(() => {
  const range = new MenuRange<MyContext>()
  range
    .text('Toggle', async (ctx) => {
      const selectedKeywords = ctx.session.selectedKeywords

      if (!selectedKeywords || selectedKeywords.length === 0) {
        await ctx.deleteMessage()
        await ctx.reply('Не выбрано ни одного ключа.')
        return
      }

      try {
        for (const keyword of selectedKeywords) {
          await KeywordModel.findOneAndUpdate(
            { word: keyword.word },
            { $set: { turn_on: !keyword.turn_on } }
          )
        }

        await setRebootFlag(ctx)

        const keywords = await KeywordModel.find().exec()
        const keywordList = keywords
          .map(
            (keyword, index) =>
              `${index + 1}) ${keyword.turn_on ? '✅' : '🚫'} ${keyword.word}`
          )
          .join('\n')

        await ctx.deleteMessage()
        await ctx.reply(`Обновленные ключи:\n${keywordList}`)
      } catch (error) {
        console.error('Failed to toggle keywords:', error)
        await ctx.reply(
          'Возникла ошибка при переключении ключа. Пожалуйста, попробуйте еще раз.'
        )
      }
    })
    .text('Cancel', async (ctx) => {
      await ctx.deleteMessage()
      await ctx.reply('Переключение отменено.')
    })

  return range
})

export default toggleKeywordMenu
