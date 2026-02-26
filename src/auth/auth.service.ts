import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email)
    if (existingUser) {
      throw new UnauthorizedException('Tài khoản đã tồn tại, vui lòng đăng nhập!')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
      role: 'member',
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user) throw new UnauthorizedException('Sai email hoặc mật khẩu')

    const isMatch = await bcrypt.compare(dto.password, user.password)
    if (!isMatch) throw new UnauthorizedException('Sai email hoặc mật khẩu')

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = this.jwtService.sign(payload)

    console.log('ok ham login duoc goi')

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }
}