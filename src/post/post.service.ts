import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { ProfileService } from 'src/profile/profile.service';
import { ActiveUserInterface } from 'src/common/interface/Active-user.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly profileService: ProfileService,
  ) {}

  async create({ body, profileId }: CreatePostDto, activeUser: any) {
    try {
      const profile = await this.profileService.findOne(profileId);

      if (activeUser.professional.profile.profileId !== profile.profileId)
        throw new UnauthorizedException(
          'Unauthorized request: must be owner of the profile',
        );

      const post = this.postRepository.create({ body, profile });

      return await this.postRepository.save(post);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating post');
    }
  }

  async findAllByProfile(profileId: string) {
    try {
      const profile = await this.profileService.findOne(profileId);

      const posts = await this.postRepository.find({
        where: { profile },
        order: { createdAt: 'DESC' },
      });

      return posts;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error getting all posts by profile id',
      );
    }
  }
}
