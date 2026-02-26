import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuestionsModule } from './questions/questions.module';
import { ExamsModule } from './exams/exams.module';
import { ExamAttemptsModule } from './exam-attempts/exam-attempts.module';
import { AdminModule } from './admin/admin.module';
import { PostsModule } from './posts/posts.module';
import { ExamSessionsModule } from './exam-sessions/exam-sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get('MONGO_HOST')
        const port = config.get('MONGO_PORT')
        const db = config.get('MONGO_DB')
        const uri = `mongodb://${host}:${port}/${db}`
        return { uri }
      },
    }),
    UsersModule,
    AuthModule,
    CoursesModule,
    LessonsModule,
    QuestionsModule,
    ExamsModule,
    ExamAttemptsModule,
    AdminModule,
    PostsModule,
    ExamSessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
