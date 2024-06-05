import { MyContext, MyConversation } from '@/helpers/bot'
import addKeywordMenu from '@/menus/addKeywordMenu'

export default async function addKeywords(
  conversation: MyConversation,
  ctx: MyContext
) {
  await ctx.reply(
    'Пожалуйста, укажите ключевые через слеш\n\n Пример:\nяблоко/банан/апельсин.'
  )

  const { message } = await conversation.wait()

  if (!message?.text) {
    await ctx.reply(
      'Ошибка ввода. Пожалуйста, укажите ключевые слова, разделенные слешем'
    )
    return
  }

  const addedKeywords = message.text.split('/').map((word) => word.trim())

  conversation.session.addedKeywords = addedKeywords

  const keywordList = addedKeywords
    .map((keyword, index) => `${index + 1}) ${keyword} `)
    .join('\n')

  await ctx.reply(
    `Вы выбрали следующее ключевые слова:\n${keywordList}\n\nВы действительно хотите добавить их?`,
    {
      reply_markup: addKeywordMenu,
    }
  )
}
