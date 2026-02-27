import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Questions - Câu hỏi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Post()
    @Roles('admin')
    @ApiOperation({ summary: 'Tạo câu hỏi mới (Chỉ Admin)' })
    @ApiResponse({ status: 201, description: 'Tạo câu hỏi thành công.' })
    create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionsService.create(createQuestionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách câu hỏi (có thể lọc theo bài thi)' })
    @ApiQuery({ name: 'examId', required: false, description: 'ID bài thi (Nếu có)' })
    @ApiResponse({ status: 200, description: 'Thành công. User thường sẽ không thấy đáp án đúng.' })
    findAll(@Req() req: any, @Query('examId') examId?: string) {
        const isAdmin = req.user?.role === 'admin';
        return this.questionsService.findAll(examId, isAdmin);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin chi tiết câu hỏi' })
    @ApiResponse({ status: 200, description: 'Thành công. User thường sẽ không thấy đáp án đúng.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi.' })
    findOne(@Req() req: any, @Param('id') id: string) {
        const isAdmin = req.user?.role === 'admin';
        return this.questionsService.findOne(id, isAdmin);
    }

    @Patch(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Cập nhật câu hỏi (Chỉ Admin)' })
    @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi.' })
    update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionsService.update(id, updateQuestionDto);
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Xóa câu hỏi (Chỉ Admin)' })
    @ApiResponse({ status: 200, description: 'Xóa thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi.' })
    remove(@Param('id') id: string) {
        return this.questionsService.remove(id);
    }
}
