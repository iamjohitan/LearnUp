import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { supabase } from '../supabase/supabase.client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // REGISTRO
  async register(nombre: string, correo: string, password: string) {
    // Validar dominio
    if (!correo.endsWith('00@usc.edu.co')) {
      throw new BadRequestException(
        'Solo se permiten correos pertenecientes a la USC',
      );
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Insertar usuario en Supabase
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, correo, contraseña: hash }])
      .select();

    if (error) throw new BadRequestException(error.message);

    return { message: 'Usuario registrado correctamente', data };
  }

  // LOGIN
  async login(correo: string, contraseña: string) {
    // Buscar usuario
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo', correo)
      .single();

    if (error || !data) throw new BadRequestException('Usuario no encontrado');

    // Verificar contraseña
    const match = await bcrypt.compare(contraseña, data.contraseña);
    if (!match) throw new BadRequestException('Contraseña incorrecta');

    // Generar token
    const token = this.jwtService.sign({ id: data.id, correo: data.correo });

    return { message: 'Login exitoso', token };
  }
}
