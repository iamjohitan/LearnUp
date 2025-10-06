// backend/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <<-- IMPORTAR ConfigModule

@Module({
  imports: [
    UserModule,
    // Configuración del módulo JWT usando el servicio de configuración
    JwtModule.registerAsync({
      imports: [ConfigModule], // Lo importamos para acceder al ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),

        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  // Exportamos JwtModule para que otros módulos lo usen (ej: JWT Strategy)
  exports: [JwtModule],
})
export class AuthModule {}
