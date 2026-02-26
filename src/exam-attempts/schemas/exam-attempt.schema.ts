import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Exam } from '../../exams/schemas/exam.schema';
import { Question } from '../../questions/schemas/question.schema';

export type ExamAttemptDocument = ExamAttempt & Document;

@Schema({ _id: false })
export class AnswerDetail {
    @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
    questionId: Types.ObjectId;

    @Prop()
    selectedAnswer: string;

    @Prop({ default: false })
    isCorrect: boolean;

    @Prop({ default: 0 })
    pointsAwarded: number;
}
const AnswerDetailSchema = SchemaFactory.createForClass(AnswerDetail);

@Schema({ timestamps: true })
export class ExamAttempt {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: User;

    @Prop({ type: Types.ObjectId, ref: 'Exam', required: true })
    examId: Exam;

    @Prop({ type: [AnswerDetailSchema], default: [] })
    answers: AnswerDetail[];

    @Prop({ default: 0 })
    totalScore: number;

    @Prop({ default: false })
    isPassed: boolean;
}

export const ExamAttemptSchema = SchemaFactory.createForClass(ExamAttempt);
