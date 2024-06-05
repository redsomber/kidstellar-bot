import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Reboot {
  @prop({ required: true, default: false })
  value!: boolean
}

export const RebootModel = getModelForClass(Reboot)
