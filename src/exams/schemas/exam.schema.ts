import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Course } from '../../courses/schemas/course.schema';

export type ExamDocument = Exam & Document;

@Schema({ timestamps: true })
export class Exam {
    @Prop({ type: Types.ObjectId, ref: 'Course' })
    courseId: Course;

    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true, default: 60 })
    durationMinutes: number;

    @Prop({ default: 50 })
    passScore: number;

    @Prop({ default: true })
    isActive: boolean;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
