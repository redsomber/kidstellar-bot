import { GroupModel } from '@/models/Group'
import { Menu, MenuRange } from '@grammyjs/menu'
import { MyContext } from '@/helpers/bot'
import setRebootFlag from '@/helpers/rebootFlag'

const deleteGroupMenu = new Menu<MyContext>('deleteGroup')
deleteGroupMenu.dynamic(() => {
  const range = new MenuRange<MyContext>()
  range
    .text('Delete', async (ctx) => {
      const selectedGroups = ctx.session.selectedGroups

      if (!selectedGroups || selectedGroups.length === 0) {
        await ctx.deleteMessage()
        await ctx.reply('Не выбрано ни одного чата.')
        return
      }

      try {
        for (const group of selectedGroups) {
          await GroupModel.findOneAndDelete({ group_id: group.group_id })
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
        await ctx.reply(
          `Обновленные чаты:\n${groupList}\n *Рекомендуется выходить из состава удаленных чатов`
        )
      } catch (error) {
        console.error('Failed to delete groups:', error)
        await ctx.reply(
          'Возникла ошибка при удалении чата. Пожалуйста, попробуйте еще раз.'
        )
      }
    })
    .text('Cancel', async (ctx) => {
      await ctx.deleteMessage()
      await ctx.reply('Удаление отменено.')
    })

  return range
})

export default deleteGroupMenu
