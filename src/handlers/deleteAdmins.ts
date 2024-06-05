import { Admin, AdminModel } from '@/models/Admin'
import { MyContext, MyConversation } from '@/helpers/bot'
import deleteAdminMenu from '@/menus/deleteAdminMenu'

export default async function deleteAdmins(
  conversation: MyConversation,
  ctx: MyContext
) {
  try {
    const admins = await AdminModel.find().exec()

    if (admins.length <= 1) {
      await ctx.reply('Должен быть хотя бы 1 админ. Удаление невозможно')
      return
    }

    const adminList = admins
      .map((admin, index) => `${index + 1}) @${admin.username} `)
      .join('\n')

    await ctx.reply(
      `Админы бота:\n${adminList}\n\nПожалуйста, введите номера для удаления\n\nПример:\n1/3/4`
    )

    const { message } = await conversation.wait()

    if (!message?.text) {
      return console.log('Empty message')
    }

    const input = message.text.split('/').map((num) => parseInt(num, 10) - 1)

    if (input.some((index) => index < 0 || index >= admins.length)) {
      await ctx.reply('Ошибка ввода. Пожалуйста, попробуйте еще раз.')
      return
    }

    const selectedUsers: Admin[] = input.map((index) => admins[index])
    const selectedAdminList = selectedUsers
      .map((admin) => `@${admin.username || 'unknown'} `)
      .join('\n')

    if (admins.length - selectedUsers.length < 1) {
      await ctx.reply('Должен быть хотя бы 1 админ. Удаление невозможно')
      return
    }

    conversation.session.selectedUsers = selectedUsers

    await ctx.reply(
      `Вы выбрали следующих админов:\n${selectedAdminList}\n\nВы действительно лишить их прав?`,
      {
        reply_markup: deleteAdminMenu,
      }
    )
  } catch (error) {
    console.error('Failed to handle delete group command:', error)
    await ctx.reply('Возникла ошибка. Пожалуйста, попробуйте еще раз.')
  }
}
