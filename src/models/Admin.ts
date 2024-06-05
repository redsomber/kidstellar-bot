import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Admin {
  @prop({ required: true, index: true, unique: true })
  user_id!: number

  @prop({ required: false, default: 'en' })
  language?: string

  @prop({ required: false, type: String, default: null })
  username?: string | null
}

export const AdminModel = getModelForClass(Admin)
