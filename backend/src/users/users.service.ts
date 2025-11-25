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

    async listRoles(){
        const{data, error} = await supabase
        .from('role')
        .select('*')
        
        if (error) throw new BadRequestException(error.message);

        return data;
    }


    async listProfessors(){
        const{data, error} = await supabase
        .from('profiles')
        .select('id,name,email,role!inner(name)')
        .eq('role.name', 'profesor')

        if(error) throw new BadRequestException(error.message)
        return data;
    }

    async listMonitors(){
        const{data, error} = await supabase
        .from('profiles')
        .select('id,name,email,role!inner(name)')
        .eq('role.name', 'monitor')

        if(error) throw new BadRequestException(error.message)
        return data;
    }

        async listStudents(){
        const{data, error} = await supabase
        .from('profiles')
        .select('id,name,email,role!inner(name)')
        .eq('role.name', 'estudiante')

        if(error) throw new BadRequestException(error.message)
        return data;
    }

    async changeRole(userId: string, newRoleName: string){
        const{data: role, error: roleError}  = await supabase
        .from('role')
        .select('id,name')
        .eq('name', newRoleName)
        .single();

        if(roleError) throw new BadRequestException('El rol especificado no existe')

        const{data, error} = await supabase
        .from('profiles')
        .update({role_id: role.id})
        .eq('id', userId)
        .select()
        .single();

        if(error) throw new BadRequestException(error.message);

        return{
            message:`Rol actualizado correctamente a ${role.name}`,
            user: data,
        };
    }

    async getUserGroups(userId: string){
        const{data, error} = await supabase
        .from('group_students')
        .select(`
            group_id,
            groups (
                id,
                code,
                course_id,
                courses(name, code)
            )
        `)
        .eq('student_id', userId);

        if(error) throw new BadRequestException(error.message);

        return data.map(row => row.groups)
    }

}
