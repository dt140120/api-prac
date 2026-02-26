import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson, LessonDocument } from './schemas/lesson.schema';

@Injectable()
export class LessonsService {
    constructor(
        @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    ) { }

    async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
        const createdLesson = new this.lessonModel(createLessonDto);
        return createdLesson.save();
    }

    async findAll(courseId?: string): Promise<Lesson[]> {
        const query: any = courseId ? { courseId } : {};
        return this.lessonModel.find(query).populate('courseId', 'title level').exec();
    }

    async findOne(id: string): Promise<Lesson> {
        const lesson = await this.lessonModel.findById(id).populate('courseId', 'title level').exec();
        if (!lesson) {
            throw new NotFoundException(`Lesson #${id} not found`);
        }
        return lesson;
    }

    async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
        const updatedLesson = await this.lessonModel
            .findByIdAndUpdate(id, updateLessonDto, { new: true })
            .exec();
        if (!updatedLesson) {
            throw new NotFoundException(`Lesson #${id} not found`);
        }
        return updatedLesson;
    }

    async remove(id: string): Promise<Lesson> {
        const deletedLesson = await this.lessonModel.findByIdAndDelete(id).exec();
        if (!deletedLesson) {
            throw new NotFoundException(`Lesson #${id} not found`);
        }
        return deletedLesson;
    }
}
