import { Group, GroupModel } from '@/models/Group'
import { MyContext, MyConversation } from '@/helpers/bot'
import toggleGroupMenu from '@/menus/toggleGroupMenu'

export default async function toggleGroups(
  conversation: MyConversation,
  ctx: MyContext
) {
  try {
    const groups = await GroupModel.find().exec()

    if (groups.length === 0) {
      await ctx.reply('Нет чатов.')
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
      `Отслеживаемые чаты:\n${groupList}\n\nПожалуйста, введите номера для переключения\n\nПример:\n1/3/4`
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

    conversation.session.selectedGroups = selectedGroups

    await ctx.reply(
      `Вы выбрали следующее чаты:\n${selectedGroupList}\n\nВы действительно хотите переключить их?`,
      {
        reply_markup: toggleGroupMenu,
      }
    )
  } catch (error) {
    console.error('Failed to handle toggle group command:', error)
    await ctx.reply('Возникла ошибка. Пожалуйста, попробуйте еще раз.')
  }
}
