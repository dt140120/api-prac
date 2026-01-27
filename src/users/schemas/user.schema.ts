import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ unique: true })
  email: string

  @Prop({required: true})
  password: string

  @Prop({required: true})
  role: string

  @Prop()
  age: number
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);