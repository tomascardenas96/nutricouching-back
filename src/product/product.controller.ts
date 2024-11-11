import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { DeleteResult } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Crear un nuevo producto
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/products';
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
  createNewProduct(
    @Body() product: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.createNewProduct(product, file);
  }

  // Listar todos los productos
  @Get()
  getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  // Eliminar un producto
  @Delete('delete/:productId')
  deleteProduct(@Param('productId') productId: string): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }

  // Modificar un producto
  @Patch('update/:productId')
  modifyProduct(
    @Param('productId') productId: string,
    @Body() updatedProduct: UpdateProductDto,
  ) {
    return this.productService.modifyProduct(productId, updatedProduct);
  }
}
