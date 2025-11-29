import {Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupChatMessageDocument = GroupChatMessage & Document;

@Schema({ collection: 'group_chat_message'})
export class GroupChatMessage{

    @Prop({ required: true})
    groupId: string;

    @Prop({ required: true})
    userId: string;

    @Prop({ required: true})
    message: string;

    @Prop()
    userName?: string;

    @Prop({ default: () => new Date()})
    timestamp: Date;

}

export const GroupChatMessageSchema = SchemaFactory.createForClass(GroupChatMessage);