import { MyContext, MyConversation } from '@/helpers/bot'
import addRecipientMenu from '@/menus/addRecipientMenu'
import getUserIdByUsername from '@/helpers/getUser'

export default async function addRecipients(
  conversation: MyConversation,
  ctx: MyContext
) {
  await ctx.reply(
    'Введите ID пользователей через слеш:\n\nПример:\n505211555/987654777...'
  )

  const { message } = await conversation.wait()

  if (!message?.text) {
    await ctx.reply('Ошибка ввода. Пожалуйста, введите ID через слеш.')
    return
  }

  const usernames = message.text.split('/').map((username) => username.trim())
  let responseText = ''

  const addedUsers = []

  for (const username of usernames) {
    const userInfo = await getUserIdByUsername(username)
    if (userInfo) {
      const { id, username } = userInfo
      addedUsers.push({ user_id: id, username })
      responseText += `🆗@${username} id: ${id}\n`
    } else {
      responseText += `❌Невозможно найти пользователя ${username}\n`
    }
  }

  conversation.session.addedUsers = addedUsers

  await ctx.reply(
    `Вы выбрали следующих пользователей:\n\n${responseText}\n\nВы действительно хотите добавить их в наблюдатели?`,
    { reply_markup: addRecipientMenu }
  )
}
