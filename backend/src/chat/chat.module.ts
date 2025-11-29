import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupChatMessage, GroupChatMessageSchema } from 'src/monitorias/schemas/group_chat_message.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: GroupChatMessage.name, schema: GroupChatMessageSchema },
        ]),
    ],
    providers: [ChatGateway, ChatService],
})
export class ChatModule {}