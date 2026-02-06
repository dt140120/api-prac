import { IsEmail, IsNumber, IsString, IsStrongPassword } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsStrongPassword()
  password: string

  @IsString()
  role: string = "member"

  @IsNumber()
  age: number
}
