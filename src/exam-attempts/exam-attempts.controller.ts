import { Controller, Post, Body, Req, UseGuards, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExamAttemptsService } from './exam-attempts.service';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Request } from 'express';

@ApiTags('Exam Attempts - Lịch sử thi & Tính điểm')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exam-attempts')
export class ExamAttemptsController {
    constructor(private readonly examAttemptsService: ExamAttemptsService) { }

    @Post('submit')
    @ApiOperation({ summary: 'Nộp bài thi và tính điểm' })
    @ApiResponse({ status: 201, description: 'Đã chấm điểm thành công.' })
    submit(@Req() req: Request, @Body() submitExamDto: SubmitExamDto) {
        const userId = (req.user as any)._id; // assuming `_id` is passed from jwt strategy/guard
        return this.examAttemptsService.submitExam(userId, submitExamDto);
    }

    @Get('me')
    @ApiOperation({ summary: 'Xem lịch sử thi của học sinh' })
    @ApiResponse({ status: 200, description: 'Lấy lịch sử thành công.' })
    getMyAttempts(@Req() req: Request) {
        const userId = (req.user as any)._id;
        return this.examAttemptsService.getMyAttempts(userId);
    }

    @Get('all')
    @UseGuards(RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Admin/Giáo viên xem tất cả lịch sử thi' })
    @ApiQuery({ name: 'userId', required: false, description: 'Lọc theo ID học viên' })
    @ApiQuery({ name: 'examId', required: false, description: 'Lọc theo ID bài thi' })
    @ApiResponse({ status: 200, description: 'Lấy danh sách thành công.' })
    getAllAttempts(@Query() query: any) {
        return this.examAttemptsService.getAllAttempts(query);
    }
}
