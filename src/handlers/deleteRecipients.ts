import { MyContext, MyConversation } from '@/helpers/bot'
import { Recipient, RecipientModel } from '@/models/Recipient'
import deleteRecipientMenu from '@/menus/deleteRecipientMenu'

export default async function deleteRecipients(
  conversation: MyConversation,
  ctx: MyContext
) {
  try {
    const recipients = await RecipientModel.find().exec()

    const recipientList = recipients
      .map((recipient, index) => `${index + 1}) @${recipient.username} `)
      .join('\n')

    await ctx.reply(
      `Наблюдатели:\n${recipientList}\n\nПожалуйста, введите номера для удаления\n\nПример:\n1/3/4`
    )

    const { message } = await conversation.wait()

    if (!message?.text) {
      return console.log('Empty message')
    }

    const input = message.text.split('/').map((num) => parseInt(num, 10) - 1)

    if (input.some((index) => index < 0 || index >= recipients.length)) {
      await ctx.reply('Ошибка ввода. Пожалуйста, попробуйте еще раз.')
      return
    }

    const selectedUsers: Recipient[] = input.map((index) => recipients[index])
    const selectedRecipientList = selectedUsers
      .map((recipient) => `@${recipient.username || 'unknown'} `)
      .join('\n')

    conversation.session.selectedUsers = selectedUsers

    await ctx.reply(
      `Вы выбрали следующих наблюдателей:\n${selectedRecipientList}\n\nВы действительно лишить их прав?`,
      {
        reply_markup: deleteRecipientMenu,
      }
    )
  } catch (error) {
    console.error('Failed to handle delete group command:', error)
    await ctx.reply('Возникла ошибка. Пожалуйста, попробуйте еще раз.')
  }
}
