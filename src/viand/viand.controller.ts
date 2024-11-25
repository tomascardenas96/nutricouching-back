import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateViandDto } from './dto/create-viand.dto';
import { ViandService } from './viand.service';
import { UpdateViandDto } from './dto/update-viand.dto';

@Controller('viand')
export class ViandController {
  constructor(private readonly viandService: ViandService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/viands';

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
  createNewViand(
    @Body() createViandDto: CreateViandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.viandService.createNewViand(createViandDto, file);
  }

  @Get()
  getAllViands() {
    return this.viandService.getAllViands();
  }

  @Delete('delete/:viandId')
  deleteViand(@Param('viandId') viandId: string) {
    return this.viandService.deleteViand(viandId);
  }

  @Patch('update/:viandId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/viands';

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
  modifyViand(
    @Param('viandId') viandId: string,
    @Body() updatedViand: UpdateViandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.viandService.modifyViand(viandId, updatedViand, file);
  }
}
