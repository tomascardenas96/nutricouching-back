import {
  BadGatewayException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import { MercadopagoService } from 'src/mercadopago/mercadopago.service';
import { PlanPurchase } from 'src/plan_purchase/entities/plan-pucharse.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from './entities/plan.entity';
import { User } from 'src/user/entity/user.entity';

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
    file_name: string,
  ) {
    try {
      const newPlan = this.planRepository.create({
        title,
        description,
        price: Number(price),
        file_url: file_name,
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

  async processPlanPayment(plan: Plan) {
    try {
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

  /**
   * Obtener un plan por su id.
   *
   * @param planId
   * @returns
   */
  async getPlanById(planId: string) {
    try {
      return await this.planRepository.findOne({ where: { planId } });
    } catch (error) {
      throw new InternalServerErrorException('Error getting plan');
    }
  }

  /**
   * Obtener todos los planes.
   *
   * @param user - Objeto del usuario activo
   * @returns - Un array de planes dividido en 3 opciones (Gratis, Comprados, No comprados)
   */
  async getAllPlans(user: User) {
    try {
      // Obtener los planes gratuitos
      const freePlans = await this.planRepository.find({ where: { price: 0 } });

      // Obtener los planes comprados por el usuario con la relación 'plan'
      const purchasedPlans = await this.planPurchaseRepository.find({
        where: { user: { userId: user.userId }, payment_status: 'approved' },
        relations: ['plan'], // Asegurar que traemos la relación con 'plan'
      });

      // Extraer los planes completos de la relación
      const purchasedPlansList = purchasedPlans.map((p) => p.plan);

      // Extraer solo los IDs de los planes comprados para la consulta
      const purchasedPlanIds = purchasedPlansList.map((plan) => plan.planId);

      // Extraer solo los IDs de los planes gratis para la consulta
      const freePlansIds = freePlans.map((fp) => fp.planId);

      // Obtener los planes no comprados (excluyendo los comprados y los gratuitos)
      const notPurchasedPlans = await this.planRepository
        .createQueryBuilder('plan') // Alias de la tabla
        .where('plan.planId NOT IN (:...excludedPlans)', {
          excludedPlans: purchasedPlanIds.length > 0 ? purchasedPlanIds : [0], // Evita error si está vacío
        })
        .andWhere('plan.planId NOT IN (:...excludedFree)', {
          excludedFree: freePlansIds.length > 0 ? freePlansIds : [0], // Evita error si está vacío
        })
        .getMany(); // Ejecutar la consulta

      return {
        freePlans, // Planes gratuitos
        purchasedPlans: purchasedPlansList, // Planes comprados completos
        notPurchasedPlans, // Planes no comprados completos
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error getting all plans');
    }
  }
}
