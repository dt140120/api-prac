import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'nguyenvana@gmail.com', description: 'Email của bạn' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Password123!', description: 'Mật khẩu' })
  @IsString()
  password: string
}