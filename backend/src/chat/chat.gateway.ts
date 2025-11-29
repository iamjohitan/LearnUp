import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ 
    cors:{
        origin: '*',
    }  
})
export class ChatGateway{
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService){}

    handleConnection(client: Socket){
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket){
        console.log(`Client disconnected: ${client.id}`);
    }
    @SubscribeMessage('joinGroup')
    joinGroup(
        @MessageBody() data: { groupId: string },
        @ConnectedSocket() client: Socket
    ){
        client.join(data.groupId);
        console.log(`usuario ${client.id} se unio al grupo ${data.groupId}`);
    }

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() data: { groupId: string; message: string; userId: string },

    ){
        await this.chatService.saveMessage(data);

        this.server.to(data.groupId).emit('message', data);
    }

}


