import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, QuestionDocument } from './schemas/question.schema';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    ) { }

    async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
        const createdQuestion = new this.questionModel(createQuestionDto);
        return createdQuestion.save();
    }

    async findAll(examId?: string): Promise<Question[]> {
        const query: any = examId ? { examId } : {};
        return this.questionModel.find(query).populate('examId', 'title description').exec();
    }

    async findOne(id: string): Promise<Question> {
        const question = await this.questionModel.findById(id).populate('examId', 'title').exec();
        if (!question) {
            throw new NotFoundException(`Question #${id} not found`);
        }
        return question;
    }

    async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
        const updatedQuestion = await this.questionModel
            .findByIdAndUpdate(id, updateQuestionDto, { new: true })
            .exec();
        if (!updatedQuestion) {
            throw new NotFoundException(`Question #${id} not found`);
        }
        return updatedQuestion;
    }

    async remove(id: string): Promise<Question> {
        const deletedQuestion = await this.questionModel.findByIdAndDelete(id).exec();
        if (!deletedQuestion) {
            throw new NotFoundException(`Question #${id} not found`);
        }
        return deletedQuestion;
    }
}
