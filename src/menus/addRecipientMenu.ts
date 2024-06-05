import { Menu, MenuRange } from '@grammyjs/menu'
import { MyContext } from '@/helpers/bot'
import { RecipientModel } from '@/models/Recipient'

const addRecipientMenu = new Menu<MyContext>('addRecipient')
addRecipientMenu.dynamic(() => {
  const range = new MenuRange<MyContext>()
  range
    .text('Add', async (ctx) => {
      const addedRecipients = ctx.session.addedUsers

      if (!addedRecipients || addedRecipients.length === 0) {
        await ctx.deleteMessage()
        await ctx.reply('Не выбрано ни одного чата.')
        return
      }

      for (const recipient of addedRecipients) {
        try {
          const recipientExists = await RecipientModel.findOne({
            user_id: recipient.user_id,
          })
          if (!recipientExists) {
            const newRecipient = new RecipientModel(recipient)
            await newRecipient.save()
          } else {
            await ctx.reply(`Админ '${recipient.user_id}'уже добавлен.`)
          }
        } catch (error) {
          console.error(
            `Failed to add recipient '${recipient.user_id}':`,
            error
          )
          await ctx.reply(
            `Возникла ошибка при добавлении наблюдателя '${recipient.user_id}'. Пожалуйста, попробуйте еще раз.`
          )
        }
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
      await ctx.reply(`Наблюдатели:\n${recipientList}`)
    })
    .text('Cancel', async (ctx) => {
      await ctx.deleteMessage()
      await ctx.reply('Добавление отменено.')
    })

  return range
})

export default addRecipientMenu
