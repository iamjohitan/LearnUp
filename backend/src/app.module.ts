import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FacultyModule } from './faculty/faculty.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, FacultyModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
