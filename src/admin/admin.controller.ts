import { Controller, Get, Param, Patch, Body, Delete, UseGuards, Post, Res, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { ExamsService } from '../exams/exams.service';
import { ExamSessionsService } from '../exam-sessions/exam-sessions.service';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import type { Response } from 'express';

@ApiTags('Admin - Quản lý hệ thống')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly usersService: UsersService,
        private readonly examsService: ExamsService,
        private readonly examSessionsService: ExamSessionsService,
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Đăng nhập dành riêng cho Admin/Teacher' })
    @ApiResponse({ status: 200, description: 'Đăng nhập Admin thành công' })
    async adminLogin(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, user } = await this.authService.login(dto);
        if (user.role !== 'admin' && user.role !== 'teacher') {
            throw new UnauthorizedException('Bạn không có quyền truy cập trang quản trị!');
        }
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        return user;
    }

    @Get('users')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Lấy tất cả người dùng' })
    getAllUsers() {
        return this.usersService.findAll();
    }

    @Delete('users/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Xóa người dùng' })
    deleteUser(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    // Quản lý nhanh Exams
    @Get('exams')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Lấy danh sách tất cả bài thi' })
    getAllExams() {
        return this.examsService.findAll();
    }

    @Delete('exams/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Xóa bài thi' })
    deleteExam(@Param('id') id: string) {
        return this.examsService.remove(id);
    }

    // Quản lý ca thi
    @Get('exam-sessions')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Lấy danh sách các ca thi' })
    getAllExamSessions() {
        return this.examSessionsService.findAll();
    }

    @Delete('exam-sessions/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Xóa ca thi' })
    deleteExamSession(@Param('id') id: string) {
        return this.examSessionsService.remove(id);
    }
}
