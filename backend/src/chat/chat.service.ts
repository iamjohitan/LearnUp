import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GroupChatMessage } from "src/monitorias/schemas/group_chat_message.schema";
import supabase from 'src/infra/supabase.client';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(GroupChatMessage.name)
        private readonly messageModel: Model<GroupChatMessage>,
    ) {}

    async saveMessage(data: any){
        let userName: string | undefined = undefined;

        if(!userName){
            console.log('ChatService: using provided userName', { userId: data.userId, userName });
        try{
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', data.userId)
                .maybeSingle();
            console.log('ChatService: profile lookup', { userId: data.userId, profile, error });
            if(!error && profile?.name) userName = profile.name;
        }catch (e) {
            console.warn('No se pudo resolver nombre de usuario para chat:', e);
        }
    }else{
            console.log('ChatService: using provided userName', { userId: data.userId, userName });
        }

        const newMessage = new this.messageModel({
            groupId: data.groupId,
            userId: data.userId,
            message: data.message,
            userName,
            timestamp: new Date(),
        });

        const saved = await newMessage.save();
        console.log('ChatService: message saved', saved);
        return saved;
    }
}