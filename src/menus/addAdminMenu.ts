import { AdminModel } from '@/models/Admin'
import { Menu, MenuRange } from '@grammyjs/menu'
import { MyContext } from '@/helpers/bot'

const addAdminMenu = new Menu<MyContext>('addAdmin')
addAdminMenu.dynamic(() => {
  const range = new MenuRange<MyContext>()
  range
    .text('Add', async (ctx) => {
      const addedAdmins = ctx.session.addedUsers

      if (!addedAdmins || addedAdmins.length === 0) {
        await ctx.deleteMessage()
        await ctx.reply('Не выбрано ни одного админа.')
        return
      }

      for (const admin of addedAdmins) {
        try {
          const adminExists = await AdminModel.findOne({
            user_id: admin.user_id,
          })
          if (!adminExists) {
            const newAdmin = new AdminModel(admin)
            await newAdmin.save()
          } else {
            await ctx.reply(`Админ '${admin.user_id}'уже добавлен.`)
          }
        } catch (error) {
          console.error(`Failed to add admin '${admin.user_id}':`, error)
          await ctx.reply(
            `Возникла ошибка при добавлении админа '${admin.user_id}'. Пожалуйста, попробуйте еще раз.`
          )
        }
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
      await ctx.reply(`Админы бота:\n${adminList}`)
    })
    .text('Cancel', async (ctx) => {
      await ctx.deleteMessage()
      await ctx.reply('Добавление отменено.')
    })

  return range
})

export default addAdminMenu
