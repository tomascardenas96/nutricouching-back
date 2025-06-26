import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { ActiveUser } from 'src/common/decorators/Active-user.decorator';
import { ActiveUserInterface } from 'src/common/interface/Active-user.interface';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(TokenGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() activeUser: ActiveUserInterface,
  ) {
    return this.postService.create(createPostDto, activeUser);
  }

  @Get(':profileId')
  findAllByProfile(@Param('profileId') profileId: string) {
    return this.postService.findAllByProfile(profileId);
  }
}
