import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Course } from '../../courses/schemas/course.schema';

export type LessonDocument = Lesson & Document;

@Schema({ timestamps: true })
export class Lesson {
    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Course;

    @Prop({ required: true })
    title: string;

    @Prop()
    content: string;

    @Prop()
    videoUrl: string;

    @Prop({ default: 1 })
    order: number;

    @Prop({ default: true })
    isActive: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
