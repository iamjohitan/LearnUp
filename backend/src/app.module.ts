import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FacultyModule } from './faculty/faculty.module';
import { UsersModule } from './users/users.module';
import { CourseModule } from './course/course.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [AuthModule, FacultyModule, UsersModule, CourseModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
