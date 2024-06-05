import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Group {
  @prop({ required: true, index: true, unique: true })
  group_id!: number

  @prop({ required: false, type: String, default: null })
  group_username?: string | null

  @prop({ required: false, type: String, default: null })
  title?: string | null

  @prop({ required: false, default: 0 })
  catch_count?: number

  @prop({ required: false, default: true })
  turn_on?: boolean
}

export const GroupModel = getModelForClass(Group)
