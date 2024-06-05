import { GroupModel } from '@/models/Group'
import { Menu, MenuRange } from '@grammyjs/menu'
import { MyContext } from '@/helpers/bot'
import setRebootFlag from '@/helpers/rebootFlag'

const addGroupMenu = new Menu<MyContext>('addGroup')
addGroupMenu.dynamic(() => {
  const range = new MenuRange<MyContext>()
  range
    .text('Add', async (ctx) => {
      const addedGroups = ctx.session.addedGroups

      if (!addedGroups || addedGroups.length === 0) {
        await ctx.deleteMessage()
        await ctx.reply('Не выбрано ни одного чата.')
        return
      }

      for (const group of addedGroups) {
        try {
          const groupExists = await GroupModel.findOne({
            group_id: group.group_id,
          })
          if (!groupExists) {
            const newGroup = new GroupModel(group)
            await newGroup.save()
          } else {
            await ctx.reply(`Чат '${group.group_username}'уже добавлен.`)
          }
        } catch (error) {
          console.error(`Failed to add group '${group.group_username}':`, error)
          await ctx.reply(
            `Возникла ошибка при добавлении чата '${group.group_username}'. Пожалуйста, попробуйте еще раз.`
          )
        }
      }

      await setRebootFlag(ctx)

      const groups = await GroupModel.find().exec()
      const groupList = groups
        .map(
          (group, index) =>
            `${index + 1}) ${group.turn_on ? '✅' : '🚫'} @${
              group.group_username
            } `
        )
        .join('\n')

      await ctx.deleteMessage()
      await ctx.reply(`Чаты:\n${groupList}`)
    })
    .text('Cancel', async (ctx) => {
      await ctx.deleteMessage()
      await ctx.reply('Добавление отменено.')
    })

  return range
})

export default addGroupMenu
