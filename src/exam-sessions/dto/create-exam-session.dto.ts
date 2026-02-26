import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class CreateExamSessionDto {
    @ApiProperty({ example: '64e8e19c8d1f2a33f4a0b5a1', description: 'ID Bài thi' })
    @IsMongoId()
    @IsNotEmpty()
    examId: string;

    @ApiProperty({ example: 'Ca thi T.A nâng cao sáng 20/10', description: 'Tên ca thi' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '2023-10-20T08:00:00.000Z', description: 'Thời gian bắt đầu' })
    @IsDateString()
    @IsNotEmpty()
    startTime: string;

    @ApiProperty({ example: '2023-10-20T10:00:00.000Z', description: 'Thời gian kết thúc' })
    @IsDateString()
    @IsNotEmpty()
    endTime: string;

    @ApiPropertyOptional({ example: ['id_user_1', 'id_user_2'], description: 'Danh sách ID thí sinh thi (Để rỗng ai cũng có thể thi)' })
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    allowedUsers?: string[];

    @ApiPropertyOptional({ example: 'Phòng 204', description: 'Phòng thi' })
    @IsString()
    @IsOptional()
    roomName?: string;
}
