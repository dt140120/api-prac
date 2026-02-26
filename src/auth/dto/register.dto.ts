import { IsEmail, IsNumber, IsString, IsStrongPassword } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Tên người dùng' })
  @IsString()
  name: string

  @ApiProperty({ example: 'nguyenvana@gmail.com', description: 'Email đăng ký' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Password123!', description: 'Mật khẩu độ mạnh cao' })
  @IsStrongPassword()
  password: string

  @ApiProperty({ example: 'member', description: 'Role (mặc định là member)' })
  @IsString()
  role: string = "member"

  @ApiProperty({ example: 20, description: 'Tuổi của user' })
  @IsNumber()
  age: number
}