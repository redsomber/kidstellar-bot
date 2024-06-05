import bot from '@/helpers/bot'

export default async function getChatIdByUsername(username: string) {
  try {
    const chat = await bot.api.getChat(username)

    return {
      id: chat.id,
      title: chat.title || null,
      username: chat.username || null,
    }
  } catch (error) {
    console.error(`Error getting chat ID for ${username}:`, error)
    return null
  }
}
