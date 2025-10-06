import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://JohanDev:NNGLObkLKcCCQ1ZQ@learnupcluster.g8y6bwf.mongodb.net/?retryWrites=true&w=majority&appName=LearnUpCluster',
    ),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
