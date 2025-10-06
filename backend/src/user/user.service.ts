// src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // MÉTODO PARA INSERTAR UN DOCUMENTO DE PRUEBA
  async createTestUser(): Promise<User> {
    const newUser = new this.userModel({
      name: 'Usuario de Prueba Guardado',
      email: `test-${Date.now()}@learnup.com`, // Usamos Date.now() para que el email sea único
    });
    return newUser.save();
  }
}
