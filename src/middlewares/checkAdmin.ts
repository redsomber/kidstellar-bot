import { AdminModel } from '@/models/Admin'
import { MiddlewareFn } from 'grammy'
import { MyContext } from '@/helpers/bot'

const checkAdmin: MiddlewareFn<MyContext> = async (ctx, next) => {
  if (ctx.from) {
    const admin = await AdminModel.findOne({ user_id: ctx.from.id })
    if (admin) {
      await next()
    } else {
      await ctx.reply('You are not authorized to use this command.')
    }
  } else {
    await ctx.reply('You are not authorized to use this command.')
  }
}

export default checkAdmin
