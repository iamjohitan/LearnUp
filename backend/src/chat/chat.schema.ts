import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ required: true })
  grupo_id: string; // ID del grupo (de Supabase)

  @Prop({ required: true })
  nombre_grupo: string;

  @Prop({
    type: [
      {
        mensaje_id: String,
        usuario_id: String,
        nombre_usuario: String,
        contenido: String,
        fecha_envio: Date,
        tipo: { type: String, default: 'texto' },
        visto: { type: Boolean, default: false },
      },
    ],
    default: [],
  })
  mensajes: Record<string, any>[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
