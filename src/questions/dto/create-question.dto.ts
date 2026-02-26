import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsMongoId, IsIn, IsArray } from 'class-validator';

export class CreateQuestionDto {
    @ApiProperty({ example: '64e8e19c8d1f2a33f4a0b5a1', description: 'ID Bài thi' })
    @IsMongoId()
    @IsNotEmpty()
    examId: string;

    @ApiProperty({ example: 'multiple_choice', description: 'Loại câu hỏi (multiple_choice, fill_in_blank, true_false)' })
    @IsIn(['multiple_choice', 'fill_in_blank', 'true_false'])
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: 'What is the capital of Vietnam?', description: 'Nội dung câu hỏi' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({ example: ['Hanoi', 'HCMC', 'Danang'], description: 'Các đáp án lựa chọn (nếu là trắc nghiệm)' })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    options?: string[];

    @ApiProperty({ example: 'Hanoi', description: 'Đáp án chính xác' })
    @IsString()
    @IsNotEmpty()
    correctAnswer: string;

    @ApiPropertyOptional({ example: 10, description: 'Điểm số của câu hỏi' })
    @IsNumber()
    @IsOptional()
    points?: number;
}
