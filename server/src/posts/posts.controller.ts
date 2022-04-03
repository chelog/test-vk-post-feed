import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/users/auth.guard';
import { UserId } from 'src/users/user.decorator';
import { CreatePostDto } from './dto/create.dto';
import { UpdatePostDto } from './dto/update.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get(':id')
  get(@Param('id') id: number) {
    return this.posts.get(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreatePostDto, @UserId() userId: User['id']) {
    return this.posts.create({
      author: { connect: { id: userId } },
      ...dto,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async edit(
    @UserId() userId: User['id'],
    @Param('id') id: number,
    @Body() dto: UpdatePostDto,
  ) {
    const post = await this.posts.get(id);
    if (post.authorId !== userId) throw new UnauthorizedException();

    return this.posts.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@UserId() userId: User['id'], @Param('id') id: number) {
    const post = await this.posts.get(id);
    if (post.authorId !== userId) throw new UnauthorizedException();

    return this.posts.delete(id);
  }
}
