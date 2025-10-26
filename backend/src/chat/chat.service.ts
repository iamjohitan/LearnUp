import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './chat.schema';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async obtenerMensajes(grupo_id: string) {
    const chat = await this.chatModel.findOne({ grupo_id });
    if (!chat) return { mensajes: [] };
    return chat.mensajes;
  }

  async enviarMensaje(grupo_id: string, nombre_grupo: string, mensaje: any) {
    let chat = await this.chatModel.findOne({ grupo_id });

    if (!chat) {
      chat = new this.chatModel({ grupo_id, nombre_grupo, mensajes: [] });
    }

    chat.mensajes.push({
      mensaje_id: uuid(),
      ...mensaje,
      fecha_envio: new Date(),
    });

    await chat.save();
    return chat.mensajes;
  }
}
