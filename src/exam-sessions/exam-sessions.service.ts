import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamSession, ExamSessionDocument } from './schemas/exam-session.schema';
import { CreateExamSessionDto } from './dto/create-exam-session.dto';
import { UpdateExamSessionDto } from './dto/update-exam-session.dto';

@Injectable()
export class ExamSessionsService {
    constructor(
        @InjectModel(ExamSession.name) private examSessionModel: Model<ExamSessionDocument>,
    ) { }

    async create(createExamSessionDto: CreateExamSessionDto): Promise<ExamSession> {
        const { examId, allowedUsers, ...rest } = createExamSessionDto;

        // Convert to ObjectIds where needed
        const newSession = new this.examSessionModel({
            ...rest,
            examId: new Types.ObjectId(examId),
            allowedUsers: allowedUsers?.map((id) => new Types.ObjectId(id)) || [],
        });
        return newSession.save();
    }

    async findAll(): Promise<ExamSession[]> {
        return this.examSessionModel
            .find()
            .populate('examId', 'title durationMinutes passScore')
            .populate('allowedUsers', 'name email')
            .sort({ startTime: 1 })
            .exec();
    }

    async findOne(id: string): Promise<ExamSession> {
        const session = await this.examSessionModel
            .findById(id)
            .populate('examId', 'title description durationMinutes passScore')
            .populate('allowedUsers', 'name email')
            .exec();
        if (!session) {
            throw new NotFoundException(`Exam session #${id} not found`);
        }
        return session;
    }

    async update(id: string, updateExamSessionDto: UpdateExamSessionDto): Promise<ExamSession> {
        const { examId, allowedUsers, ...rest } = updateExamSessionDto;

        const updateData: any = { ...rest };
        if (examId) updateData.examId = new Types.ObjectId(examId);
        if (allowedUsers) updateData.allowedUsers = allowedUsers.map((u_id) => new Types.ObjectId(u_id));

        const updatedSession = await this.examSessionModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!updatedSession) {
            throw new NotFoundException(`Exam session #${id} not found`);
        }
        return updatedSession;
    }

    async remove(id: string): Promise<ExamSession> {
        const deletedSession = await this.examSessionModel.findByIdAndDelete(id).exec();
        if (!deletedSession) {
            throw new NotFoundException(`Exam session #${id} not found`);
        }
        return deletedSession;
    }

    // Method cho user public xêm các ca thi hiện tại
    async getUpcomingSessions(userId: string): Promise<ExamSession[]> {
        const now = new Date();
        // Ca thi đang diễn ra hoặc sắp diễn ra mà user được phép thi (hoặc ko giới hạn hs)
        const filter: any = {
            endTime: { $gte: now },
            $or: [
                { allowedUsers: { $size: 0 } },
                { allowedUsers: new Types.ObjectId(userId) }
            ]
        };

        return this.examSessionModel
            .find(filter)
            .populate('examId', 'title durationMinutes')
            .sort({ startTime: 1 })
            .exec();
    }
}
