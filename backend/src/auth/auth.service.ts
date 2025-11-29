import { BadRequestException, Injectable } from '@nestjs/common';
import  supabase  from '../infra/supabase.client';
import { RegisterUserDto } from './dto/register-user-dto';


@Injectable()
export class AuthService {
    async register(dto: RegisterUserDto) {
        const{email, password, name} = dto;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });

        
        if (error) throw new BadRequestException(error.message);

        const user = data.user;
        if (!user) throw new BadRequestException('Error al crear el usuario');
        
        const { data: roleData, error: roleError } = await supabase
        .from('role')
        .select('id')
        .eq('name', 'student')
        .maybeSingle();

        
        if (roleError) throw new BadRequestException(roleError.message);

        if (!roleData){
            throw new BadRequestException('Error de configuracion: El rol "student" no existe')
        }

        {/* Creacion del perfil en la tabla perfiles */}

        const {error: profileError} = await supabase
        .from('profiles').insert([
            {
                id: user.id,
                name,
                email: user.email,
                role_id: roleData.id,
                faculty_id: null,
            }
        ]);

            if(profileError) throw new BadRequestException (profileError.message);
    
        return { 
            message: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta',
            user: data.user,
        };
    }

    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new BadRequestException(error.message);
        console.log('AuthService.login - data.session:', data.session);
        console.log('AuthService.login - data.user:', data.user);
        
        return {
            token: data.session?.access_token ?? null,
            user: {
                id: data.user?.id ?? '',
                email: data.user?.email ?? '',
                name: data.user?.user_metadata?.name ?? '',
            },
        };
    }  
}


