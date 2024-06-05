import { KeywordModel } from '@/models/Keyword'
import { Menu, MenuRange } from '@grammyjs/menu'
import { MyContext } from '@/helpers/bot'
import setRebootFlag from '@/helpers/rebootFlag'

const addKeywordMenu = new Menu<MyContext>('addKeyword')
addKeywordMenu.dynamic(() => {
  const range = new MenuRange<MyContext>()
  range
    .text('Add', async (ctx) => {
      const addedKeywords = ctx.session.addedKeywords

      if (!addedKeywords || addedKeywords.length === 0) {
        await ctx.deleteMessage()
        await ctx.reply('Не выбрано ни одного ключа.')
        return
      }

      for (const word of addedKeywords) {
        try {
          const keywordExists = await KeywordModel.findOne({ word })
          if (!keywordExists) {
            const newKeyword = new KeywordModel({ word })
            await newKeyword.save()
          }
        } catch (error) {
          console.error(`Failed to add keyword '${word}':`, error)
          await ctx.reply(
            `Возникла ошибка при добавлении ключа '${word}'. Пожалуйста, попробуйте еще раз.`
          )
        }
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
      await ctx.reply(`Ключи:\n${keywordList}`)
    })
    .text('Cancel', async (ctx) => {
      await ctx.deleteMessage()
      await ctx.reply('Добавление отменено.')
    })

  return range
})

export default addKeywordMenu
