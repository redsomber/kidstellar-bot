import { Admin } from '@/models/Admin'
import { Group } from '@/models/Group'
import { Keyword } from '@/models/Keyword'

export interface SessionData {
  selectedGroups?: Group[] | undefined
  selectedKeywords?: Keyword[] | undefined
  addedKeywords?: string[] | undefined
  addedGroups?: Group[] | undefined
  addedUsers?: Admin[] | undefined
  selectedUsers?: Admin[] | undefined
}
