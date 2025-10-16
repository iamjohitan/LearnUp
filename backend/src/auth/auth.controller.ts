import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { nombre: string; correo: string; password: string },
  ) {
    return this.authService.register(body.nombre, body.correo, body.password);
  }

  @Post('login')
  async login(@Body() body: { correo: string; password: string }) {
    return this.authService.login(body.correo, body.password);
  }
}
