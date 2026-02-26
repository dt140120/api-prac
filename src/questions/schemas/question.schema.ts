import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exam } from '../../exams/schemas/exam.schema';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
    @Prop({ type: Types.ObjectId, ref: 'Exam', required: true })
    examId: Exam;

    @Prop({ required: true, enum: ['multiple_choice', 'fill_in_blank', 'true_false'], default: 'multiple_choice' })
    type: string;

    @Prop({ required: true })
    content: string;

    @Prop([String])
    options: string[];

    @Prop({ required: true })
    correctAnswer: string;

    @Prop({ default: 10 })
    points: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
