import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamAttempt, ExamAttemptDocument } from './schemas/exam-attempt.schema';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { ExamsService } from '../exams/exams.service';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class ExamAttemptsService {
    constructor(
        @InjectModel(ExamAttempt.name) private examAttemptModel: Model<ExamAttemptDocument>,
        private examsService: ExamsService,
        private questionsService: QuestionsService,
    ) { }

    async submitExam(userId: string, submitExamDto: SubmitExamDto): Promise<ExamAttempt> {
        const { examId, answers } = submitExamDto;

        // Validate exam
        const exam = await this.examsService.findOne(examId);
        if (!exam) {
            throw new NotFoundException('Exam not found');
        }

        // Get all questions for the exam
        const questions = await this.questionsService.findAll(examId);
        if (!questions || questions.length === 0) {
            throw new BadRequestException('Exam has no questions');
        }

        let totalScore = 0;
        let maxPossibleScore = 0;
        const evaluatedAnswers: any[] = [];

        // Map questions by id for fast lookup
        const questionMap = new Map(questions.map((q: any) => [q._id.toString(), q]));

        // Evaluate each submitted answer
        for (const submitted of answers) {
            const question = questionMap.get(submitted.questionId);
            if (!question) continue;

            const isCorrect = question.correctAnswer === submitted.selectedAnswer;
            const pointsAwarded = isCorrect ? question.points : 0;

            totalScore += pointsAwarded;

            evaluatedAnswers.push({
                questionId: new Types.ObjectId(submitted.questionId),
                selectedAnswer: submitted.selectedAnswer,
                isCorrect,
                pointsAwarded,
            });
        }

        // Calculate max possible score
        questions.forEach((q) => {
            maxPossibleScore += q.points;
        });

        // Pass condition
        const scorePercentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
        const isPassed = scorePercentage >= (exam.passScore || 50);

        const attempt = new this.examAttemptModel({
            userId: new Types.ObjectId(userId),
            examId: new Types.ObjectId(examId),
            answers: evaluatedAnswers,
            totalScore,
            isPassed,
        });

        return attempt.save();
    }

    async getMyAttempts(userId: string): Promise<ExamAttempt[]> {
        return this.examAttemptModel
            .find({ userId: new Types.ObjectId(userId) })
            .populate('examId', 'title durationMinutes passScore')
            .sort({ createdAt: -1 })
            .exec();
    }

    async getAllAttempts(query?: any): Promise<ExamAttempt[]> {
        const filter: any = {};
        if (query?.userId) filter.userId = new Types.ObjectId(query.userId);
        if (query?.examId) filter.examId = new Types.ObjectId(query.examId);

        return this.examAttemptModel
            .find(filter)
            .populate('examId', 'title durationMinutes passScore')
            .populate('userId', 'name email username')
            .sort({ createdAt: -1 })
            .exec();
    }
}
