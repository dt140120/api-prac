import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsMongoId } from 'class-validator';

export class CreateExamDto {
    @ApiPropertyOptional({ example: '64e8e19c8d1f2a33f4a0b5a1', description: 'ID Khóa học (Nếu bài thi thuộc khóa học)' })
    @IsMongoId()
    @IsOptional()
    courseId?: string;

    @ApiProperty({ example: 'IELTS Mock Test 1', description: 'Tên bài thi' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ example: 'Bài thi thử IELTS tháng 10', description: 'Mô tả bài thi' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 40, description: 'Thời gian làm bài (Phút)' })
    @IsNumber()
    @IsNotEmpty()
    durationMinutes: number;

    @ApiPropertyOptional({ example: 50, description: 'Điểm sàn để qua môn (%)' })
    @IsNumber()
    @IsOptional()
    passScore?: number;

    @ApiPropertyOptional({ example: true, description: 'Trạng thái hoạt động' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
