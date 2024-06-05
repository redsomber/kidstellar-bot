import bot from '@/helpers/bot'

export default async function getUserIdByUsername(username: string) {
  try {
    const user = await bot.api.getChat(username)
    return {
      id: user.id,
      username: user.username || null,
      firstName: user.first_name || null,
      lastName: user.last_name || null,
    }
  } catch (error) {
    console.error(`Error getting user ID for ${username}:`, error)
    return null
  }
}
