import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('Users - Người dùng')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin user hiện tại.' })
  getProfile(@Req() req: Request) {
    const userId = (req.user as any)._id || (req.user as any).id;
    return this.usersService.findOne(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
  updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const userId = (req.user as any)._id || (req.user as any).id;
    return this.usersService.update(userId, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem thông tin của một người dùng khác' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
