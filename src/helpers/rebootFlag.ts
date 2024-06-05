import { MyContext } from '@/helpers/bot'
import { RebootModel } from '@/models/Reboot'
import env from '@/helpers/env'

export default async function setRebootFlag(ctx: MyContext): Promise<void> {
  try {
    await RebootModel.updateOne({ _id: env.REBOOT }, { $set: { value: true } })
    console.log('Reboot flag set to true.')
  } catch (error) {
    console.error('Failed to update reboot flag:', error)
    await ctx.reply(
      'Возникла ошибка при обновлении флага перезагрузки. Пожалуйста, попробуйте еще раз.'
    )
  }
}
