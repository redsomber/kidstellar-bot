import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Keyword {
  @prop({ required: true, index: true, unique: true })
  word!: string

  @prop({ required: true, default: 0 })
  catch_count!: number

  @prop({ required: true, default: true })
  turn_on!: boolean
}

export const KeywordModel = getModelForClass(Keyword)
