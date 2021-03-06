import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const user = await this.users.findOne(id);
    return this.users.toPublic(user);
  }
}
