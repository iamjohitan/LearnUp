import { Module } from '@nestjs/common';
import { MonitoriasController } from './monitorias.controller';
import { MonitoriasService } from './monitorias.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupActivityLog, GroupActivityLogSchema } from './schemas/group_activity_logs.schema';
import { GroupChatMessage, GroupChatMessageSchema } from './schemas/group_chat_message.schema';

@Module({
    imports:[
        MongooseModule.forFeature([
            {name: GroupActivityLog.name, schema: GroupActivityLogSchema},
            {name: GroupChatMessage.name, schema: GroupChatMessageSchema},
        ])
    ],
      controllers: [MonitoriasController],
      providers: [MonitoriasService],
})

export class MonitoriasModule {}
