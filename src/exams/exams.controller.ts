import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@ApiTags('Exams - Bài thi')
@ApiBearerAuth()
@Controller('exams')
export class ExamsController {
    constructor(private readonly examsService: ExamsService) { }

    @Post()
    @ApiOperation({ summary: 'Tạo bài thi mới' })
    @ApiResponse({ status: 201, description: 'Tạo bài thi thành công.' })
    create(@Body() createExamDto: CreateExamDto) {
        return this.examsService.create(createExamDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách bài thi (có thể lọc theo khóa học)' })
    @ApiQuery({ name: 'courseId', required: false, description: 'ID khóa học (Nếu có)' })
    @ApiResponse({ status: 200, description: 'Thành công.' })
    findAll(@Query('courseId') courseId?: string) {
        return this.examsService.findAll(courseId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin chi tiết bài thi' })
    @ApiResponse({ status: 200, description: 'Thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài thi.' })
    findOne(@Param('id') id: string) {
        return this.examsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Cập nhật thông tin bài thi' })
    @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài thi.' })
    update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
        return this.examsService.update(id, updateExamDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa bài thi' })
    @ApiResponse({ status: 200, description: 'Xóa thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài thi.' })
    remove(@Param('id') id: string) {
        return this.examsService.remove(id);
    }
}
