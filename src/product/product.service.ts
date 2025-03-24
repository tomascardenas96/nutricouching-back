import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

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

      const parsedProduct = {
        ...product,
        stock: Number(product.stock),
        price: Number(product.price),
      };

      if (isNaN(parsedProduct.stock) || isNaN(parsedProduct.price)) {
        throw new BadRequestException('Stock and price must be number');
      }

      const newProduct: Product = this.productRepository.create({
        ...parsedProduct,
        image: file ? file.filename : undefined,
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
        where: { name, description, image },
      });
    } catch (error) {
      throw new BadGatewayException('Error getting entire product');
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
  async modifyProduct(
    productId: string,
    updatedProduct: UpdateProductDto,
    file: Express.Multer.File,
  ) {
    try {
      const existentProduct = await this.productRepository.findOne({
        where: { productId },
      });

      await this.productRepository.update(productId, {
        ...updatedProduct,
        price: Number(updatedProduct.price),
        stock: Number(updatedProduct.stock),
        image: file ? file.filename : existentProduct.image,
      });

      return {
        ...existentProduct,
        ...updatedProduct,
        image: file ? file.filename : existentProduct.image,
      };
    } catch (error) {
      throw new BadGatewayException('Error modifying product by id');
    }
  }

  async getProductById(productId: string): Promise<Product> {
    try {
      const product: Product = await this.productRepository.findOne({
        where: { productId },
      });

      if (!product || !productId) {
        return null;
      }

      return product;
    } catch (error) {
      throw new BadGatewayException('Error getting product by id');
    }
  }

  /**
   * Restar stock despues de la compra
   *
   * @param products - Lista de productos y la cantidad comprada
   */
  async subtractStockAfterPurchase(
    products: { id: string; quantity: number }[],
  ) {
    try {
      const updatedProducts: Product[] = [];

      for (const product of products) {
        const foundProduct = await this.productRepository.findOne({
          where: { productId: product.id },
        });

        if (foundProduct) {
          foundProduct.stock -= product.quantity;

          updatedProducts.push(foundProduct);
        }
      }

      if (updatedProducts.length) {
        await this.productRepository.save(updatedProducts);
      }
    } catch (error) {
      throw new BadGatewayException('Error subtracting stock');
    }
  }
}
