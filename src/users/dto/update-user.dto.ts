import { IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyen Van A', description: 'Tên người dùng' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ example: 'nguyenvana@gmail.com', description: 'Email đăng ký' })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ example: 'Password123!', description: 'Mật khẩu độ mạnh cao' })
  @IsStrongPassword()
  @IsOptional()
  password?: string

  @ApiPropertyOptional({ example: 'member', description: 'Role' })
  @IsString()
  @IsOptional()
  role?: string

  @ApiPropertyOptional({ example: 20, description: 'Tuổi của user' })
  @IsNumber()
  @IsOptional()
  age?: number
}
