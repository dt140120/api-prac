import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSessionsService } from './exam-sessions.service';
import { ExamSessionsController } from './exam-sessions.controller';
import { ExamSessionSchema, ExamSession } from './schemas/exam-session.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ExamSession.name, schema: ExamSessionSchema }])],
  controllers: [ExamSessionsController],
  providers: [ExamSessionsService],
  exports: [ExamSessionsService],
})
export class ExamSessionsModule { }
