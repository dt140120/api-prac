import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Courses - Quản lý khóa học')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    @ApiOperation({ summary: 'Tạo khóa học mới' })
    @ApiResponse({ status: 201, description: 'Khóa học được tạo thành công.' })
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.coursesService.create(createCourseDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách tất cả khóa học' })
    @ApiResponse({ status: 200, description: 'Thành công.' })
    findAll() {
        return this.coursesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin chi tiết khóa học' })
    @ApiResponse({ status: 200, description: 'Lấy thông tin thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học.' })
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Cập nhật khóa học' })
    @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học.' })
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa khóa học' })
    @ApiResponse({ status: 200, description: 'Xóa thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học.' })
    remove(@Param('id') id: string) {
        return this.coursesService.remove(id);
    }
}
