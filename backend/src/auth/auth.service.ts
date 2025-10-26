import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { supabase } from '../supabase/supabase.client';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // 🔹 REGISTRO DE USUARIO
  async register(nombre: string, correo: string, password: string) {
    // 1️⃣ Validar dominio institucional
    if (!correo.endsWith('@usc.edu.co')) {
      throw new BadRequestException(
        'Solo se permiten correos pertenecientes a la USC',
      );
    }

    // 2️⃣ Validar que la contraseña sea fuerte
    if (password.length < 8) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres',
      );
    }

    const weakPasswords = [
      '123456',
      'password',
      'qwerty',
      'abc123',
      'contraseña',
      '12345678',
      '111111',
    ];

    if (weakPasswords.includes(password.toLowerCase())) {
      throw new BadRequestException(
        'La contraseña es demasiado común o insegura',
      );
    }

    // Debe tener al menos una mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new BadRequestException(
        'La contraseña debe incluir al menos una mayúscula, una minúscula y un número',
      );
    }

    // 3️⃣ Verificar si la contraseña ha sido filtrada públicamente
    const sha1 = crypto
      .createHash('sha1')
      .update(password)
      .digest('hex')
      .toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const response = await axios.get(
      `https://api.pwnedpasswords.com/range/${prefix}`,
    );
    const lines = response.data.split('\n');
    const found = lines.some((line) => line.startsWith(suffix));

    if (found) {
      throw new BadRequestException(
        'Esta contraseña ha sido filtrada en bases de datos públicas. Por favor usa una más segura.',
      );
    }

    // 4️⃣ Encriptar la contraseña antes de guardar
    const hash = await bcrypt.hash(password, 10);

    // 5️⃣ Insertar usuario en Supabase
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, correo, contraseña: hash }])
      .select();

    if (error) {
      throw new BadRequestException(
        `Error al registrar usuario: ${error.message}`,
      );
    }

    return { message: 'Usuario registrado correctamente ✅', data };
  }

  // 🔹 LOGIN
  async login(correo: string, contraseña: string) {
    // Buscar usuario
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo', correo)
      .single();

    if (error || !data) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Verificar contraseña
    const match = await bcrypt.compare(contraseña, data.contraseña);
    if (!match) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    // Generar token JWT
    const token = this.jwtService.sign({
      id: data.id,
      correo: data.correo,
    });

    return { message: 'Login exitoso 🎉', token };
  }
}
