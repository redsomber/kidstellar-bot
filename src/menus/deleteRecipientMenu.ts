import { Menu, MenuRange } from '@grammyjs/menu'
import { MyContext } from '@/helpers/bot'
import { RecipientModel } from '@/models/Recipient'

const deleteRecipientMenu = new Menu<MyContext>('deleteRecipient')
deleteRecipientMenu.dynamic(() => {
  const range = new MenuRange<MyContext>()
  range
    .text('Delete', async (ctx) => {
      const selectedUsers = ctx.session.selectedUsers

      if (!selectedUsers || selectedUsers.length === 0) {
        await ctx.deleteMessage()
        await ctx.reply('Не выбрано ни одного наблюдателя.')
        return
      }

      try {
        for (const recipient of selectedUsers) {
          await RecipientModel.findOneAndDelete({ user_id: recipient.user_id })
        }

        const recipients = await RecipientModel.find().exec()
        const recipientList = recipients
          .map(
            (recipient, index) =>
              `${index + 1}) @${recipient.username || 'unknown'} | id: ${
                recipient.user_id
              }`
          )
          .join('\n')

        await ctx.deleteMessage()
        await ctx.reply(`Наблюдатели:\n${recipientList || 'Отсутствуют'}\n`)
      } catch (error) {
        console.error('Failed to delete groups:', error)
        await ctx.reply(
          'Возникла ошибка при удалении наблюдателя. Пожалуйста, попробуйте еще раз.'
        )
      }
    })
    .text('Cancel', async (ctx) => {
      await ctx.deleteMessage()
      await ctx.reply('Удаление отменено.')
    })

  return range
})

export default deleteRecipientMenu
