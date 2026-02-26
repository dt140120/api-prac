import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePostDto {
    @ApiProperty({ example: 'Update on final exam schedule', description: 'Tên bài đăng' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'The final exam will be...', description: 'Nội dung bài đăng' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: true, description: 'Trạng thái công khai', required: false })
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}
