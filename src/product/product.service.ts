import {
  BadGatewayException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ILike } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Crear un nuevo producto
  async createNewProduct(
    product: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<Product> {
    try {
      // Validar que no exista ya el producto
      const existentProduct: Product = await this.filterEntireProduct(product);

      if (existentProduct) {
        throw new BadRequestException('Product already exists');
      }

      if (isNaN(product.stock) || isNaN(product.price)) {
        throw new BadRequestException('Stock and price must be number');
      }

      const newProduct: Product = this.productRepository.create({
        ...product,
        stock: Number(product.stock),
        price: Number(product.price),
        image: file ? file.filename : null,
      });

      return this.productRepository.save(newProduct);
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error creating new product');
    }
  }

  // Listar todos los productos
  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      throw new BadGatewayException('Error getting all products');
    }
  }

  private async filterEntireProduct(product: CreateProductDto) {
    try {
      const { name, price, stock, description, image } = product;
      return this.productRepository.findOne({
        where: { name, price, stock, description, image },
      });
    } catch (error) {
      throw new BadGatewayException('Error getting product by name');
    }
  }

  // Eliminar un producto
  deleteProduct(productId: string): Promise<DeleteResult> {
    try {
      return this.productRepository.delete(productId);
    } catch (error) {
      throw new BadGatewayException('Error deleting product by id');
    }
  }

  // Modificar un producto
  modifyProduct(productId: string, updatedProduct: UpdateProductDto) {
    try {
      return this.productRepository.update(productId, updatedProduct);
    } catch (error) {
      throw new BadGatewayException('Error modifying product by id');
    }
  }
}
