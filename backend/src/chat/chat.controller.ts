import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Obtener todos los mensajes de un grupo
  @Get(':grupo_id')
  async obtenerMensajes(@Param('grupo_id') grupo_id: string) {
    return this.chatService.obtenerMensajes(grupo_id);
  }

  // Enviar mensaje
  @Post(':grupo_id')
  async enviarMensaje(
    @Param('grupo_id') grupo_id: string,
    @Body()
    body: {
      nombre_grupo: string;
      usuario_id: string;
      nombre_usuario: string;
      contenido: string;
    },
  ) {
    return this.chatService.enviarMensaje(grupo_id, body.nombre_grupo, body);
  }
}
