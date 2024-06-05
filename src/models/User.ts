import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: true, index: true, unique: true })
  user_id!: number

  @prop({ required: true, default: 'en' })
  language!: string

  @prop({ required: false, type: String, default: null })
  username?: string

  @prop({ required: false, type: String, default: null })
  firstName?: string

  @prop({ required: false, type: String, default: null })
  lastName?: string

  @prop({ required: true, default: 0 })
  catchCount!: number
}

export const UserModel = getModelForClass(User)
