import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { DeleteResult } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Crear un nuevo producto
  @Post()
  createNewProduct(@Body() product: CreateProductDto) {
    return this.productService.createNewProduct(product);
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
