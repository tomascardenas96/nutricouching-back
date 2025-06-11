import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalService } from './professional.service';

@Controller('professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post('create')
  @UseGuards(TokenGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/professionals';

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
  create(
    @Body() createProfessionalDto: CreateProfessionalDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.professionalService.create(createProfessionalDto, file);
  }

  @Get()
  findAll() {
    return this.professionalService.findAll();
  }

  @Get('filter')
  filterProfessionals(
    @Query('name') name: string,
    @Query('specialty') specialty: string,
    @Query('category') category: string,
  ) {
    return this.professionalService.filterProfessionals(
      name,
      specialty,
      category,
    );
  }

  @Get('specialty')
  @UseGuards(TokenGuard)
  findProfessionalsBySpecialty(@Query('id') specialtyId: string) {
    return this.professionalService.findProfessionalsBySpecialty(specialtyId);
  }

  @Patch('update/:professionalId')
  @UseGuards(TokenGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/professionals';

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
  modifyProfessional(
    @Param('professionalId') professionalId: string,
    @Body() updatedProfessional: UpdateProfessionalDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.professionalService.modifyProfessional(
      professionalId,
      updatedProfessional,
      file,
    );
  }

  @Delete('delete/:professionalId')
  @UseGuards(TokenGuard)
  deleteProfessional(@Param('professionalId') professionalId: string) {
    return this.professionalService.deleteProfessional(professionalId);
  }

  @Get(':slug')
  findProfessionalBySlug(@Param('slug') slug: string) {
    return this.professionalService.findProfessionalByProfileName(slug);
  }
}
