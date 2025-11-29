import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import supabase from '../infra/supabase.client';

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
        const token = client.handshake.auth?.token;
        if (token) {
            supabase.auth.getUser(token).then(({ data }) => {
                // Guardar info de usuario en el socket (fallback a payload cliente si falta)
                client.data.user = data?.user;
            }).catch(() => {});
        }
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
        @MessageBody() data: { groupId: string; message: string; userId?: string, userName?: string },
        @ConnectedSocket() client: Socket,
    ){
        // Preferir userId resuelto en el socket por el token
        const userId = client.data.user?.id || data.userId;
        const userNameFromToken = client.data.user?.user_metadata?.name;
        const userName = data.userName || userNameFromToken;
        const payload = {
            groupId: data.groupId,
            message: data.message,
            userId,
            userName,
        };

         console.log('ChatGateway: incoming message payload', payload);
        // Guardar y obtener el documento guardado (incluye userName)
        const saved = await this.chatService.saveMessage(payload);

        // Emitir el documento guardado a la sala (incluye userName)
        this.server.to(data.groupId).emit('message', saved);
    }

}


