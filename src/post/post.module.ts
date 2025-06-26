import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), ProfileModule, UserModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
