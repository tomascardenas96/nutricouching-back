import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Delete,
  Patch,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import ServiceDto from './dto/service.dto';
import { Service } from './entities/service.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/services';
          // Verificamos si no existe la carpeta uploads se crea automaticamente.
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
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  createService(
    @Body() serviceDto: ServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Service> {
    return this.serviceService.createService(serviceDto, file);
  }

  @Get()
  findAll(): Promise<Service[]> {
    return this.serviceService.findAll();
  }

  @Get('search')
  getServiceByName(@Query('title') title: string) {
    return this.serviceService.getServiceByName(title);
  }

  @Delete('delete/:serviceId')
  deleteService(@Param('serviceId') serviceId: string) {
    return this.serviceService.deleteService(serviceId);
  }

  @Patch('update/:serviceId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/services';
          // Verificamos si no existe la carpeta uploads se crea automaticamente.
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
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  modifyProduct(
    @Param('serviceId') serviceId: string,
    @Body() updatedService: UpdateServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.serviceService.modifyProduct(serviceId, updatedService, file);
  }
}
