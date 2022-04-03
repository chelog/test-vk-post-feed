import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from './auth.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async create(data: Prisma.UserCreateInput) {
    data.password = await this.auth.encodePassword(data.password);
    return this.prisma.user.create({ data });
  }

  findOne(id: User['id']) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByName(name: User['name']) {
    return this.prisma.user.findUnique({ where: { name } });
  }

  update(id: User['id'], data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  toPublic(user: User) {
    const { password, ...publicData } = user;
    return publicData;
  }
}
