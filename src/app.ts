import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { Middleware } from 'grammy'
import { apiThrottler } from '@grammyjs/transformer-throttler'
import { conversations, createConversation } from '@grammyjs/conversations'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { run } from '@grammyjs/runner'
import Reboot from '@/handlers/reboot'
import addAdminMenu from '@/menus/addAdminMenu'
import addAdmins from '@/handlers/addAdmins'
import addGroupMenu from '@/menus/addGroupMenu'
import addGroups from '@/handlers/addGroups'
import addKeywordMenu from '@/menus/addKeywordMenu'
import addKeywords from '@/handlers/addKeywords'
import addRecipientMenu from '@/menus/addRecipientMenu'
import addRecipients from '@/handlers/addRecipients'
import bot, { MyContext } from '@/helpers/bot'
import checkAdmin from '@/middlewares/checkAdmin'
import customSession from '@/helpers/session'
import deleteAdminMenu from '@/menus/deleteAdminMenu'
import deleteAdmins from '@/handlers/deleteAdmins'
import deleteGroupMenu from '@/menus/deleteGroupMenu'
import deleteGroups from '@/handlers/deleteGroups'
import deleteKeywordMenu from '@/menus/deleteKeywordMenu'
import deleteKeywords from '@/handlers/deleteKeywords'
import deleteRecipientMenu from '@/menus/deleteRecipientMenu'
import deleteRecipients from '@/handlers/deleteRecipients'
import env from '@/helpers/env'
import lastMessages from '@/handlers/lastMessages'
import startMongo from '@/helpers/startMongo'
import toggleGroupMenu from '@/menus/toggleGroupMenu'
import toggleGroups from '@/handlers/toggleGroups'
import toggleKeywordMenu from '@/menus/toggleKeywordMenu'
import toggleKeywords from '@/handlers/toggleKeywords'
import watchGroups from '@/handlers/watchGroups'
import watchKeywords from '@/handlers/watchKeywords'
import watchUserMessages from '@/handlers/watchMessages'

async function runApp() {
  console.log('Starting app...')
  await startMongo()
  console.log('Mongo connected')

  const sequentializeMiddleware: Middleware<MyContext> = sequentialize()
  const ignoreOldMiddleware: Middleware<MyContext> = ignoreOld()

  const throttler = apiThrottler()
  bot.api.config.use(throttler)

  bot
    // Middlewares
    .use(sequentializeMiddleware)
    .use(ignoreOldMiddleware)
    .use(customSession)
    .use(conversations())
    .use(addGroupMenu)
    .use(addKeywordMenu)
    .use(addAdminMenu)
    .use(addRecipientMenu)
    .use(toggleGroupMenu)
    .use(toggleKeywordMenu)
    .use(deleteGroupMenu)
    .use(deleteKeywordMenu)
    .use(deleteAdminMenu)
    .use(deleteRecipientMenu)

    .use(createConversation(addGroups))
    .use(createConversation(addKeywords))
    .use(createConversation(addAdmins))
    .use(createConversation(addRecipients))
    .use(createConversation(toggleGroups))
    .use(createConversation(toggleKeywords))
    .use(createConversation(deleteGroups))
    .use(createConversation(deleteKeywords))
    .use(createConversation(deleteAdmins))
    .use(createConversation(deleteRecipients))

  // Commands
  bot.command('start', async (ctx) => {
    const userId = ctx.from?.id
    const username = ctx.from?.username
    console.log(`User ${userId} has launched the bot.`)
    await ctx.reply('Добро пожаловать!')
    await bot.api.sendMessage(env.BOT_ID, `@${username} id:`)
    await bot.api.sendMessage(env.BOT_ID, `${userId}`)
  })

  bot.use(checkAdmin)

  bot.command('addgroups', async (ctx) => {
    await ctx.conversation.enter('addGroups')
  })
  bot.command('addkeywords', async (ctx) => {
    await ctx.conversation.enter('addKeywords')
  })
  bot.command('addadmins', async (ctx) => {
    await ctx.conversation.enter('addAdmins')
  })
  bot.command('addrecipients', async (ctx) => {
    await ctx.conversation.enter('addRecipients')
  })

  bot.command('togglegroups', async (ctx) => {
    await ctx.conversation.enter('toggleGroups')
  })
  bot.command('togglekeywords', async (ctx) => {
    await ctx.conversation.enter('toggleKeywords')
  })

  bot.command('deletegroups', async (ctx) => {
    await ctx.conversation.enter('deleteGroups')
  })
  bot.command('deletekeywords', async (ctx) => {
    await ctx.conversation.enter('deleteKeywords')
  })
  bot.command('deleteadmins', async (ctx) => {
    await ctx.conversation.enter('deleteAdmins')
  })
  bot.command('deleterecipients', async (ctx) => {
    await ctx.conversation.enter('deleteRecipients')
  })

  bot.command('last', lastMessages)
  bot.command('watchgroups', watchGroups)
  bot.command('watchkeywords', watchKeywords)
  bot.command('reboot', Reboot)

  // Errors
  bot.catch(console.error)

  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)

  await watchUserMessages()
}

void runApp()
