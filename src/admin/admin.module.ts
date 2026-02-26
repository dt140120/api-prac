import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { ExamsModule } from '../exams/exams.module';
import { ExamSessionsModule } from '../exam-sessions/exam-sessions.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, ExamsModule, ExamSessionsModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
