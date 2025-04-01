import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { PlanPurchase } from 'src/plan_purchase/entities/plan-pucharse.entity';
import { UserService } from 'src/user/user.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { User } from 'src/user/entity/user.entity';
import { MercadopagoService } from 'src/mercadopago/mercadopago.service';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    @InjectRepository(PlanPurchase)
    private readonly planPurchaseRepository: Repository<PlanPurchase>,
    private readonly userService: UserService,
    private readonly mercadopagoService: MercadopagoService,
  ) {}

  async createPlan(
    { title, description, price }: CreatePlanDto,
    file_url: string,
  ) {
    try {
      const newPlan = this.planRepository.create({
        title,
        description,
        price: Number(price),
        file_url,
      });

      return this.planRepository.save(newPlan);
    } catch (error) {
      throw new BadGatewayException('Error creating plan');
    }
  }

  async downloadPlan(planId: string, res: Response) {
    try {
      // 1. Obtener el plan de la base de datos
      const plan = await this.planRepository.findOne({ where: { planId } });

      if (!plan || !plan.file_url) {
        throw new NotFoundException('Archivo no encontrado');
      }

      // 2. Construir ruta del archivo (usando el nombre original)
      const filePath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        'plans',
        plan.file_url,
      );

      // 3. Configurar cabeceras para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${plan.file_url}"`,
      );

      // 4. Enviar el archivo
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al descargar el archivo');
    }
  }

  async hasUserPurchasedPlan(userId: string, planId: string): Promise<boolean> {
    try {
      const purchase = await this.planPurchaseRepository.findOne({
        where: { user: { userId }, plan: { planId } },
      });

      return !!purchase;
    } catch (error) {
      throw new BadGatewayException('Error checking plan purchase');
    }
  }

  async processPlanPayment(activeUser: User, planId: string) {
    try {
      const plan = await this.planRepository.findOne({ where: { planId } });

      if (!plan) {
        throw new NotFoundException('Plan not found');
      }

      return await this.mercadopagoService.createPreference(null, plan);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error processing payment');
    }
  }
}
