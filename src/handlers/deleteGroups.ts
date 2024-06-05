import { Group, GroupModel } from '@/models/Group'
import { MyContext, MyConversation } from '@/helpers/bot'
import deleteGroupMenu from '@/menus/deleteGroupMenu'

export default async function deleteGroups(
  conversation: MyConversation,
  ctx: MyContext
) {
  try {
    const groups = await GroupModel.find().exec()

    if (groups.length <= 1) {
      await ctx.reply(
        'Хотя бы один чат должен находиться на отслеживании. Удаление невозможно'
      )
      return
    }

    const groupList = groups
      .map(
        (group, index) =>
          `${index + 1}) ${group.turn_on ? '✅' : '🚫'} @${
            group.group_username
          } `
      )
      .join('\n')

    await ctx.reply(
      `Отслеживаемые чаты:\n${groupList}\n\nПожалуйста, введите номера для удаления\n\nПример:\n1/3/4`
    )

    const { message } = await conversation.wait()

    if (!message?.text) {
      return console.log('Empty message')
    }

    const input = message.text.split('/').map((num) => parseInt(num, 10) - 1)

    if (input.some((index) => index < 0 || index >= groups.length)) {
      await ctx.reply('Ошибка ввода. Пожалуйста, попробуйте еще раз.')
      return
    }

    const selectedGroups: Group[] = input.map((index) => groups[index])
    const selectedGroupList = selectedGroups
      .map(
        (group) =>
          `${group.turn_on ? '✅' : '🚫'} @${
            group.group_username || 'unknown'
          } `
      )
      .join('\n')

    if (groups.length - selectedGroups.length < 1) {
      await ctx.reply(
        'Хотя бы один чат должен находиться на отслеживании. Удаление невозможно.'
      )
      return
    }

    conversation.session.selectedGroups = selectedGroups

    await ctx.reply(
      `Вы выбрали следующее чаты:\n${selectedGroupList}\n\nВы действительно хотите удалить их?`,
      {
        reply_markup: deleteGroupMenu,
      }
    )
  } catch (error) {
    console.error('Failed to handle delete group command:', error)
    await ctx.reply('Возникла ошибка. Пожалуйста, попробуйте еще раз.')
  }
}
