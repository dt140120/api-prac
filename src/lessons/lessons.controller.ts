import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiTags('Lessons - Bài học')
@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) { }

    @Post()
    @ApiOperation({ summary: 'Tạo bài học mới' })
    @ApiResponse({ status: 201, description: 'Bài học được tạo thành công.' })
    create(@Body() createLessonDto: CreateLessonDto) {
        return this.lessonsService.create(createLessonDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách bài học (có thể lọc theo khoa học)' })
    @ApiQuery({ name: 'courseId', required: false, description: 'ID khóa học' })
    @ApiResponse({ status: 200, description: 'Thành công.' })
    findAll(@Query('courseId') courseId?: string) {
        return this.lessonsService.findAll(courseId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin một bài học' })
    @ApiResponse({ status: 200, description: 'Lấy thông tin thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài học.' })
    findOne(@Param('id') id: string) {
        return this.lessonsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Cập nhật bài học' })
    @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài học.' })
    update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonsService.update(id, updateLessonDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa bài học' })
    @ApiResponse({ status: 200, description: 'Xóa thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài học.' })
    remove(@Param('id') id: string) {
        return this.lessonsService.remove(id);
    }
}
