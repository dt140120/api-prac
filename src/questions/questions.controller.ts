import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@ApiTags('Questions - Câu hỏi')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Post()
    @ApiOperation({ summary: 'Tạo câu hỏi mới' })
    @ApiResponse({ status: 201, description: 'Tạo câu hỏi thành công.' })
    create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionsService.create(createQuestionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách câu hỏi (có thể lọc theo bài thi)' })
    @ApiQuery({ name: 'examId', required: false, description: 'ID bài thi (Nếu có)' })
    @ApiResponse({ status: 200, description: 'Thành công.' })
    findAll(@Query('examId') examId?: string) {
        return this.questionsService.findAll(examId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin chi tiết câu hỏi' })
    @ApiResponse({ status: 200, description: 'Thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi.' })
    findOne(@Param('id') id: string) {
        return this.questionsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Cập nhật câu hỏi' })
    @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi.' })
    update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionsService.update(id, updateQuestionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa câu hỏi' })
    @ApiResponse({ status: 200, description: 'Xóa thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi.' })
    remove(@Param('id') id: string) {
        return this.questionsService.remove(id);
    }
}
