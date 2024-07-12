import { Bot, Context, SessionFlavor } from 'grammy'
import { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { SessionData } from '@/interfaces/sessionData'
import env from '@/helpers/env'

export type MyContext = SessionFlavor<SessionData> &
  Context &
  ConversationFlavor

export type MyConversation = Conversation<MyContext>

const bot = new Bot<MyContext>(env.TOKEN)

export default bot
