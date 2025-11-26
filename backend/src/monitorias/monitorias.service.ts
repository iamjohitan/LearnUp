import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import supabase from '../infra/supabase.client'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupActivityLog } from './schemas/group_activity_logs.schema';
import { GroupChatMessage } from './schemas/group_chat_message.schema';
import { CreateMonitoriaDto } from './dto/create-monitoria.dto';
import { UpdateMonitoriaDto } from './dto/update-monitoria.dto';
import { timeStamp } from 'console';

@Injectable()
export class MonitoriasService {
    constructor(
        @InjectModel(GroupActivityLog.name)
        private logModel: Model<GroupActivityLog>,
        @InjectModel(GroupChatMessage.name)
        private chatModel: Model<GroupChatMessage>
    ){}

    async create(groupId: string, dto: CreateMonitoriaDto, userId: string){
        const {data, error} = await supabase
        .from('monitorias')
        .insert({
            group_id: groupId,
            monitor_id: dto.monitor_id,
            tipo: dto.tipo,
            link:dto.link || null,
            salon: dto.salon || null,
            fecha: dto.fecha,
        })
        .select()
        .single()

        if(error) throw new BadRequestException(error.message)

        await this.logModel.create({
            groupId,
            userId,
            event: 'MONITORIA_CREATED',
            data,
        });
        return data
    }

    async list(groupId: string){
        const{data,error} = await supabase
        .from('monitorias')
        .select('*')
        .eq('group_id', groupId);

        if(error) throw new BadRequestException(error.message)
        return data;
    }

    async sendMessage(groupId: string, userId: string, message: string){
        return this.chatModel.create({
            groupId,
            userId,
            message,
        })
    }

    async listMessages(groupId: string){
        return this.chatModel
        .find({groupId})
        .sort({timestamp: 1})
        .exec();
    }

    async update(groupId: string, monitoriaId: string, dto: UpdateMonitoriaDto, userId: string){
        const {data, error} = await supabase
        .from('monitorias')
        .update(dto)
        .eq('id', monitoriaId)
        .eq('group_id', groupId)
        .select()
        .single();

        if(error) throw new BadRequestException(error.message);

        await this.logModel.create({
            groupId,
            userId,
            event:'MONITORIA_UPDATED',
            data,
        })
        return data;
    }

    async delete(groupId: string, monitoriaId: string, userId: string){
        const {data, error} = await supabase
        .from('monitorias')
        .delete()
        .eq('id', monitoriaId)
        .eq('group_id', groupId)
        .select()
        .single();


        if(error) throw new BadRequestException(error.message)

        await this.logModel.create({
            groupId,
            userId,
            event:'MONITORIA_DELETED',
            data,
        });
        return {message: 'Monitoria eliminada', monitoria: data};
    }

    async getLogs(groupId: string){
        return this.logModel
        .find({groupId})
        .sort({timestamp: -1})
        .exec();
    }


}
