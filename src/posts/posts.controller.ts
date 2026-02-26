import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Request } from 'express';

@ApiTags('Posts - Quản lý bài đăng tin tức')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    @ApiOperation({ summary: 'Xem tất cả bài đăng (Đã publish)' })
    @ApiResponse({ status: 200, description: 'Lấy bài đăng thành công.' })
    findAll() {
        return this.postsService.findAll(true); // only published
    }

    @Get(':id')
    @ApiOperation({ summary: 'Xem chi tiết bài đăng' })
    findAllById(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    // Admin and teachers can manage posts
    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Tạo bài đăng (Chỉ Admin/Teacher)' })
    create(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
        const authorId = (req.user as any)._id;
        return this.postsService.create(authorId, createPostDto);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Cập nhật bài đăng (Chỉ Admin/Teacher)' })
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(id, updatePostDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'teacher')
    @ApiOperation({ summary: 'Xóa bài đăng (Chỉ Admin/Teacher)' })
    remove(@Param('id') id: string) {
        return this.postsService.remove(id);
    }
}
