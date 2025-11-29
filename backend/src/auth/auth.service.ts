import { BadRequestException, Injectable } from '@nestjs/common';
import supabase from '../infra/supabase.client';
import { RegisterUserDto } from './dto/register-user-dto';

@Injectable()
export class AuthService {
  // Registro: crea usuario en Auth y fila en profiles
  async register(dto: RegisterUserDto) {
    const { email, password, name } = dto;

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

    // Obtener id del rol 'estudiante'
    const { data: roleData, error: roleError } = await supabase
      .from('role')
      .select('id')
      .eq('name', 'estudiante')
      .maybeSingle();

    if (roleError) throw new BadRequestException(roleError.message);
    if (!roleData) {
      throw new BadRequestException('Error de configuracion: El rol "estudiante" no existe');
    }

    // Crear perfil en la tabla profiles
    const insert = {
      id: user.id,
      name: name ?? user.user_metadata?.name ?? '',
      email: user.email ?? '',
      role_id: roleData.id,
      faculty_id: null,
    };

    const { data: createdProfile, error: insertError } = await supabase
      .from('profiles')
      .insert(insert)
      .select()
      .maybeSingle();

    if (insertError) {
      console.error('AuthService.register - insert profile error', insertError);
      throw new BadRequestException(insertError.message || 'Error al crear el perfil');
    }

    // Retornar usuario creado (no siempre hay session al registrarse)
    return {
      user: {
        id: user.id,
        email: user.email,
        name: insert.name,
      },
    };
  }

  // Login: devuelve token y user para que el frontend lo guarde
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new BadRequestException(error.message);

    // logs de ayuda en dev
    console.log('AuthService.login - data.session:', data.session);
    console.log('AuthService.login - data.user:', data.user);

    return {
      token: data.session?.access_token ?? null,
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name ?? '',
          }
        : null,
    };
  }
}