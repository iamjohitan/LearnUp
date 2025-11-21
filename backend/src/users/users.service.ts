import { Injectable, BadRequestException } from '@nestjs/common';
import supabase from 'src/infra/supabase.client';

@Injectable()
export class UsersService {
    async getProfile(userId: string){
        const {data, error} = await supabase
        .from('profiles')
        .select(`
            id,
            name,
            email,
            faculty_id,
            role_id
            `)
            .eq('id',userId)
            .single();

        if (error){
            throw new BadRequestException("No se pudo obtener el perfil")
        }
        return data;
    }


    async updateFaculty(userId: string, facultyId: string | null){


        if(!facultyId) throw new BadRequestException("El ID de la facultad es requerido");
        
        const { data: currentUser, error: selectError } = await supabase
            .from('profiles')
            .select('faculty_id')
            .eq('id', userId)
            .single();

        if (selectError)
            throw new BadRequestException("No se pudo obtener el usuario");

        if (currentUser.faculty_id !== null) {
            throw new BadRequestException("Este usuario ya tiene una facultad asignada y no se puede cambiar.");
        }
        const {data, error} = await supabase
            .from('profiles')
            .update({faculty_id:facultyId})
            .eq('id', userId)
            .select(
                `
                id,
                name,
                email,
                faculty_id,
                role_id
                `
            )
            .maybeSingle();

        if (error) throw new BadRequestException(error.message);

        return{
            message: 'Facultad actualizada correctamente',
            profile: data,
        };

    }

}
