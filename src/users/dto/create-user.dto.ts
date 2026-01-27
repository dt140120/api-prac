import { IsString, IsEmail, IsOptional, IsNumber, IsStrongPassword } from 'class-validator'

export class CreateUserDto {
    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsOptional()
    @IsNumber()
    age?: number

    @IsStrongPassword()
    password: string

    @IsString()
    role: string
}
