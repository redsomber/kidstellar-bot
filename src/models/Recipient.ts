import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Recipient {
  @prop({ required: true, index: true, unique: true })
  user_id!: number

  @prop({ required: true, default: 'en' })
  language!: string

  @prop({ required: false, type: String, default: null })
  username?: string
}

export const RecipientModel = getModelForClass(Recipient)
