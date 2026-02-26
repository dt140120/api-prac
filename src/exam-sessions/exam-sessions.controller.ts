import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExamSessionsService } from './exam-sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateExamSessionDto } from './dto/create-exam-session.dto';
import { UpdateExamSessionDto } from './dto/update-exam-session.dto';
import type { Request } from 'express';

@ApiTags('Exam Sessions - Quản lý ca thi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exam-sessions')
export class ExamSessionsController {
    constructor(private readonly examSessionsService: ExamSessionsService) { }

    @Get('my-sessions')
    @ApiOperation({ summary: 'Lấy các ca thi sắp diễn ra cho user' })
    getMySessions(@Req() req: Request) {
        const userId = (req.user as any)._id; // id from jwt
        return this.examSessionsService.getUpcomingSessions(userId);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Tạo ca thi mới (Admin/Teacher)' })
    create(@Body() createExamSessionDto: CreateExamSessionDto) {
        return this.examSessionsService.create(createExamSessionDto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Lấy tất cả các ca thi (Admin/Teacher)' })
    findAll() {
        return this.examSessionsService.findAll();
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Xem chi tiết ca thi (Admin/Teacher)' })
    findOne(@Param('id') id: string) {
        return this.examSessionsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Cập nhật ca thi (Admin/Teacher)' })
    update(@Param('id') id: string, @Body() updateExamSessionDto: UpdateExamSessionDto) {
        return this.examSessionsService.update(id, updateExamSessionDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Xóa ca thi (Admin/Teacher)' })
    remove(@Param('id') id: string) {
        return this.examSessionsService.remove(id);
    }
}
