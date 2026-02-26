import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exam } from '../../exams/schemas/exam.schema';
import { User } from '../../users/schemas/user.schema';

export type ExamSessionDocument = ExamSession & Document;

@Schema({ timestamps: true })
export class ExamSession {
    @Prop({ type: Types.ObjectId, ref: 'Exam', required: true })
    examId: Exam;

    @Prop({ required: true })
    name: string; // Tên ca thi (Vd: Ca thi Tiếng Anh ngày 20/10)

    @Prop({ required: true })
    startTime: Date;

    @Prop({ required: true })
    endTime: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    allowedUsers: User[]; // Danh sách thí sinh được thi (nếu để rỗng = ai cũng được thi)

    @Prop()
    roomName: string; // Phòng thi
}

export const ExamSessionSchema = SchemaFactory.createForClass(ExamSession);
