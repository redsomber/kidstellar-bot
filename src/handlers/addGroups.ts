import { MyContext, MyConversation } from '@/helpers/bot'
import addGroupMenu from '@/menus/addGroupMenu'
import getChatIdByUsername from '@/helpers/getChat'

export default async function addGroups(
  conversation: MyConversation,
  ctx: MyContext
) {
  await ctx.reply(
    'Введите линки групп через слеш:\n\nПример:\n@channel_1/@channel_2...'
  )

  const { message } = await conversation.wait()

  if (!message?.text) {
    await ctx.reply(
      'Ошибка ввода. Пожалуйста, введите желаемые чаты через слеш.'
    )
    return
  }

  const usernames = message.text.split('/').map((username) => username.trim())
  let responseText = ''

  const addedGroups = []

  for (const username of usernames) {
    const chatInfo = await getChatIdByUsername(username)
    if (chatInfo) {
      const { id, title, username } = chatInfo
      addedGroups.push({ group_id: id, group_username: username, title: title })
      responseText += `🆗@${username} | Title: ${title}\n`
    } else {
      responseText += `❌Невозможно получить ID ${username}\n`
    }
  }

  conversation.session.addedGroups = addedGroups

  await ctx.reply(
    `Вы выбрали следующие чаты:\n\n${responseText}\n\nВы действительно хотите добавить их для отслеживания?`,
    {
      reply_markup: addGroupMenu,
    }
  )
}
