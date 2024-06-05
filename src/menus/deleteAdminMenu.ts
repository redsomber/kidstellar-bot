import { AdminModel } from '@/models/Admin'
import { Menu, MenuRange } from '@grammyjs/menu'
import { MyContext } from '@/helpers/bot'

const deleteAdminMenu = new Menu<MyContext>('deleteAdmin')
deleteAdminMenu.dynamic(() => {
  const range = new MenuRange<MyContext>()
  range
    .text('Delete', async (ctx) => {
      const selectedUsers = ctx.session.selectedUsers

      if (!selectedUsers || selectedUsers.length === 0) {
        await ctx.deleteMessage()
        await ctx.reply('Не выбрано ни одного админа.')
        return
      }

      try {
        for (const admin of selectedUsers) {
          await AdminModel.findOneAndDelete({ user_id: admin.user_id })
        }

        const admins = await AdminModel.find().exec()
        const adminList = admins
          .map(
            (admin, index) =>
              `${index + 1}) @${admin.username || 'unknown'} | id: ${
                admin.user_id
              }`
          )
          .join('\n')

        await ctx.deleteMessage()
        await ctx.reply(`Админы бота:\n${adminList}\n`)
      } catch (error) {
        console.error('Failed to delete groups:', error)
        await ctx.reply(
          'Возникла ошибка при удалении админа. Пожалуйста, попробуйте еще раз.'
        )
      }
    })
    .text('Cancel', async (ctx) => {
      await ctx.deleteMessage()
      await ctx.reply('Удаление отменено.')
    })

  return range
})

export default deleteAdminMenu
