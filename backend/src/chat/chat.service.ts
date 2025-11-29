import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GroupChatMessage } from "src/monitorias/schemas/group_chat_message.schema";

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(GroupChatMessage.name)
        private readonly messageModel: Model<GroupChatMessage>,
    ) {}

    async saveMessage(data: any){
        const newMessage = new this.messageModel({
            groupId: data.groupId,
            userId: data.userId,
            message: data.message,
            createdAt: new Date(),
        });

        return newMessage.save();
    }
}