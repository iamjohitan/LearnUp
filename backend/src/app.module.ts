import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FacultyModule } from './faculty/faculty.module';
import { UsersModule } from './users/users.module';
import { CourseModule } from './course/course.module';
import { GroupsModule } from './groups/groups.module';
import { MonitoriasModule } from './monitorias/monitorias.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI!, {dbName:process.env.MONGO_DB_NAME,}),
    AuthModule, FacultyModule, UsersModule, CourseModule, GroupsModule, MonitoriasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
