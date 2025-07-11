import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ActiveUser } from 'src/common/decorators/Active-user.decorator';
import { ActiveUserInterface } from 'src/common/interface/Active-user.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { TokenGuard } from 'src/auth/guard/token.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @UseGuards(TokenGuard)
  @Patch('photo/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/professionals/profile';

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  updateProfilePicture(@UploadedFile() file: Express.Multer.File, @Param('id') profileId: string) {
    return this.profileService.updateProfilePicture(file, profileId)
  }

  @UseGuards(TokenGuard)
  @Patch('cover/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/professionals/cover';

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  updateProfileCover(@UploadedFile() file: Express.Multer.File, @Param('id') profileId: string) {
    return this.profileService.updateProfileCover(file, profileId)
  }

  @Get('name/:profilename')
  findOneByProfileName(@Param('profilename') profilename: string) {
    return this.profileService.findOneByProfileName(profilename)
  }

  @UseGuards(TokenGuard)
  @Patch('update')
  updateProfileInfo(@Body() updateProfileDto: UpdateProfileDto, @ActiveUser() activeUser: ActiveUserInterface) {
    return this.profileService.updateProfileInfo(updateProfileDto, activeUser)
  }
}
