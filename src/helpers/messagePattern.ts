const messagePattern = (
  title: string | null | undefined,
  group_username: string | null | undefined,
  text: string,
  username: string | null | undefined,
  keyword: string | null | undefined
) => {
  return `!!Поймано сообщение!!
Чат: ${title}
Линк: @${group_username}

От: @${username}
Сообщение: 
${text}

Ключ: ${keyword}
`
}

export default messagePattern
