import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCourseDto {
    @ApiProperty({ example: 'IELTS Intensive', description: 'Tên khóa học' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ example: 'Khóa học luyện thi IELTS 7.0+', description: 'Mô tả khóa học' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: 'B2', description: 'Trình độ (A1, A2, B1, B2, C1, C2)' })
    @IsString()
    @IsOptional()
    level?: string;

    @ApiPropertyOptional({ example: true, description: 'Trạng thái hoạt động' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
