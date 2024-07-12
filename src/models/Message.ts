import { SchemaTypes } from 'mongoose'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class UserMessage {
  @prop({ required: true, index: true })
  user_id!: number

  @prop({ required: true, index: true })
  group_id!: number

  @prop({ required: true })
  text!: string

  @prop({ required: false, type: String, default: null })
  keyword?: string

  @prop({ type: SchemaTypes.Date })
  createdAt?: Date
}

export const UserMessageModel = getModelForClass(UserMessage)
