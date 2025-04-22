import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true
})
export class User extends Document {
    @Prop({ index: true, unique: true })
    username: string

    @Prop()
    password: string

    @Prop()
    githubAccessKey: string

    @Prop()
    accessToken: string

    @Prop()
    refreshToken: string
}

export const UserSchema = SchemaFactory.createForClass(User)