import { Injectable, BadRequestException } from '@nestjs/common';
import supabase from 'src/infra/supabase.client';

@Injectable()
export class UsersService {
    async updateFaculty(userId: string, facultyId: string){
        if(!facultyId) throw new BadRequestException("El ID de la facultad es requerido");

        const {data, error} = await supabase
            .from('profiles')
            .update({faculty_id:facultyId})
            .eq('id', userId)
            .select('id, faculty_id')
            .single();

        if (error) throw new BadRequestException(error.message);

        return{
            message: 'Facultad actualizada correctamente',
            profile: data,
        };

    }

}
