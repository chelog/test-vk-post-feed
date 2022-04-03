import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Request as ERequest } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.dto';
import { LoginDto } from './dto/login.dto';
import { UserId } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    let user: User;
    try {
      user = await this.users.create(createUserDto);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('User with this name already exists');
      }
    }

    return this.users.toPublic(user);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Request() req: ERequest) {
    const user = await this.users.findByName(dto.name);
    if (!user || !this.auth.verifyPassword(dto.password, user.password))
      throw new UnauthorizedException();

    req.session.userId = user.id;
    return this.users.toPublic(user);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@UserId() userId: User['id']) {
    const user = await this.users.findOne(userId);
    return this.users.toPublic(user);
  }
}
