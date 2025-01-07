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
  UseInterceptors,
} from '@nestjs/common';
import { AssignSpecialtyDto } from './dto/assign-specialty.dto';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { ProfessionalService } from './professional.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Controller('professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post('create')
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

  @Get('specialty')
  findProfessionalsBySpecialty(@Query('id') specialtyId: string) {
    return this.professionalService.findProfessionalsBySpecialty(specialtyId);
  }

  @Patch('update/:professionalId')
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
  deleteProfessional(@Param('professionalId') professionalId: string) {
    return this.professionalService.deleteProfessional(professionalId);
  }

  @Get('service/:serviceId')
  findProfessionalsByService(@Param('serviceId') serviceId: string) {
    return this.professionalService.findProfessionalsByService(serviceId);
  }
}
