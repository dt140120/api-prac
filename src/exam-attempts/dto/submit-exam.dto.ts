import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString, ValidateNested, IsArray } from 'class-validator';

export class SubmitAnswerDto {
    @ApiProperty({ example: '64e8e19c8d1f2a33f4a0b5a1', description: 'ID Câu hỏi' })
    @IsMongoId()
    @IsNotEmpty()
    questionId: string;

    @ApiProperty({ example: 'A', description: 'Câu trả lời của user' })
    @IsString()
    @IsNotEmpty()
    selectedAnswer: string;
}

export class SubmitExamDto {
    @ApiProperty({ example: '64e8e19c8d1f2a33f4a0b5a1', description: 'ID Bài thi' })
    @IsMongoId()
    @IsNotEmpty()
    examId: string;

    @ApiProperty({ type: [SubmitAnswerDto], description: 'Danh sách câu trả lời' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubmitAnswerDto)
    answers: SubmitAnswerDto[];
}
