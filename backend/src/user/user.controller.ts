// src/user/user.controller.ts

import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user') // Esto establece el prefijo de ruta: /user
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-test') // La ruta completa será: /user/create-test
  async createTest() {
    return this.userService.createTestUser();
  }
}
