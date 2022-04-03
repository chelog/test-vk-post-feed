import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  get(id: Post['id']) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  create(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({ data });
  }

  update(id: Post['id'], data: Prisma.PostUpdateInput) {
    return this.prisma.post.update({ where: { id }, data });
  }

  delete(id: Post['id']) {
    return this.prisma.post.delete({ where: { id } });
  }
}
