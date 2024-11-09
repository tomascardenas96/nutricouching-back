import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { DeleteResult } from 'typeorm';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createNewProduct(@Body() product: CreateProductDto) {
    return this.productService.createNewProduct(product);
  }

  @Get()
  getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Delete('delete/:productId')
  deleteProduct(@Param('productId') productId: string): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }
}
