import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamDocument } from './schemas/exam.schema';

@Injectable()
export class ExamsService {
    constructor(
        @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    ) { }

    async create(createExamDto: CreateExamDto): Promise<Exam> {
        const createdExam = new this.examModel(createExamDto);
        return createdExam.save();
    }

    async findAll(courseId?: string): Promise<Exam[]> {
        const query: any = courseId ? { courseId } : {};
        return this.examModel.find(query).populate('courseId', 'title').exec();
    }

    async findOne(id: string): Promise<Exam> {
        const exam = await this.examModel.findById(id).populate('courseId', 'title').exec();
        if (!exam) {
            throw new NotFoundException(`Exam #${id} not found`);
        }
        return exam;
    }

    async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
        const updatedExam = await this.examModel
            .findByIdAndUpdate(id, updateExamDto, { new: true })
            .exec();
        if (!updatedExam) {
            throw new NotFoundException(`Exam #${id} not found`);
        }
        return updatedExam;
    }

    async remove(id: string): Promise<Exam> {
        const deletedExam = await this.examModel.findByIdAndDelete(id).exec();
        if (!deletedExam) {
            throw new NotFoundException(`Exam #${id} not found`);
        }
        return deletedExam;
    }
}
