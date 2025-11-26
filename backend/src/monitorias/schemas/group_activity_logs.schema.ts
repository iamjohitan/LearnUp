import {Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupActivityLogDocument = GroupActivityLog & Document;

@Schema({ collection: 'group_activity_logs'})
export class GroupActivityLog{

    @Prop({ required: true })
    groupId: string;

    @Prop({ required: true })
    event: string;

    @Prop({ required: true })
    userId?: string;

    @Prop({ type: Object })
    data: string;

    @Prop({ default: () => new Date()  })
    timestamp: Date;
}

export const GroupActivityLogSchema = SchemaFactory.createForClass(GroupActivityLog)