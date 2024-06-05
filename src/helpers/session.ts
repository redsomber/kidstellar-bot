import { FileAdapter } from '@grammyjs/storage-file'
import { SessionData } from '@/interfaces/sessionData'
import { session } from 'grammy'

const storage = new FileAdapter<SessionData>({
  dirName: 'sessions',
})

export default session({
  initial(): SessionData {
    return {
      selectedGroups: [],
      selectedKeywords: [],
      selectedUsers: [],
      addedKeywords: [],
      addedGroups: [],
      addedUsers: [],
    }
  },
  storage: storage,
})
