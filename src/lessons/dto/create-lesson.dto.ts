import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsMongoId } from 'class-validator';

export class CreateLessonDto {
    @ApiProperty({ example: '64e8e19c8d1f2a33f4a0b5a1', description: 'ID Khóa học' })
    @IsMongoId()
    @IsNotEmpty()
    courseId: string;

    @ApiProperty({ example: 'Unit 1: Introduction to English', description: 'Tiêu đề bài học' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ example: 'Nội dung bài speaking...', description: 'Phần Speaking' })
    @IsString()
    @IsOptional()
    speaking?: string;

    @ApiPropertyOptional({ example: 'Nội dung bài reading...', description: 'Phần Reading' })
    @IsString()
    @IsOptional()
    reading?: string;

    @ApiPropertyOptional({ example: 'Nội dung bài writing...', description: 'Phần Writing' })
    @IsString()
    @IsOptional()
    writing?: string;

    @ApiPropertyOptional({ example: 'Nội dung bài listening...', description: 'Phần Listening' })
    @IsString()
    @IsOptional()
    listening?: string;

    @ApiPropertyOptional({ example: 'https://youtube.com/...', description: 'Video bài giảng' })
    @IsString()
    @IsOptional()
    videoUrl?: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự bài học trong khóa' })
    @IsNumber()
    @IsOptional()
    order?: number;

    @ApiPropertyOptional({ example: true, description: 'Trạng thái hoạt động' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
