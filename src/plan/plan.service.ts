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
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from './entities/plan.entity';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    @InjectRepository(PlanPurchase)
    private readonly planPurchaseRepository: Repository<PlanPurchase>,
    private readonly userService: UserService,
    private readonly mercadopagoService: MercadopagoService,
  ) {}

  /**
   * Obtener todos los planes cuando el usuario no está logueado, (separados por comprados y no comprados).
   *
   * @returns - Un objeto con dos arreglos: free / purchase
   */
  async getAllPlans() {
    try {
      const allPlans = await this.planRepository.find();

      const free = allPlans.filter((plan) => plan.price === 0);

      const premium = allPlans.filter((plan) => plan.price > 0);

      return {
        freePlans: free,
        notPurchasedPlans: premium,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error getting all plans');
    }
  }

  /**
   * Obtener todos los planes.
   *
   * @param user - Objeto del usuario activo
   * @returns - Un array de planes dividido en 3 opciones (Gratis, Comprados, No comprados)
   */
  async getAllPlansWhenUserIsLoggedIn(user: User) {
    try {
      const allPlans = await this.planRepository.find();

      // Obtener los planes gratuitos
      const freePlans = allPlans.filter((plan) => plan.price === 0);

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

      const notPurchasedPlans = allPlans.filter((plan) => {
        return (
          !purchasedPlanIds.includes(plan.planId) &&
          !freePlansIds.includes(plan.planId)
        );
      });

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

  async createPlan(
    { title, description, price, shortDescription }: CreatePlanDto,
    file_name: string,
  ) {
    try {
      const newPlan = this.planRepository.create({
        title,
        description,
        shortDescription,
        price: Number(price),
        file_url: file_name,
      });

      return this.planRepository.save(newPlan);
    } catch (error) {
      throw new BadGatewayException('Error creating plan');
    }
  }

  async downloadPlan(planId: string, res: Response) {
    let fileStream: fs.ReadStream | null = null;
    try {
      const plan = await this.planRepository.findOne({ where: { planId } });
      if (!plan?.file_url)
        throw new NotFoundException('Plan o archivo no encontrado');

      const filePath = join(
        process.env.UPLOADS_DIR || join(__dirname, '..', '..', 'uploads'),
        'plans',
        plan.file_url,
      );

      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Archivo no encontrado en el servidor');
      }

      const safeFilename = plan.file_url.replace(/[^a-z0-9_.-]/gi, '_');

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${safeFilename}"`,
      );

      fileStream = fs.createReadStream(filePath);

      fileStream.on('error', (err) => {
        console.error('Stream error:', err);
        if (!res.headersSent) res.status(500).end();
      });

      fileStream.pipe(res);
    } catch (error) {
      if (fileStream) fileStream.destroy();
      if (error instanceof NotFoundException) throw error;
      console.error('Download error:', error);
      throw new InternalServerErrorException('Error al descargar el archivo');
    }
  }

  async hasUserPurchasedPlan(userId: string, planId: string): Promise<boolean> {
    try {
      if (!planId) {
        return false;
      }

      const plan = await this.getPlanById(planId);

      if (plan.price === 0) {
        return true;
      }

      const purchase = await this.planPurchaseRepository.findOne({
        where: { user: { userId }, plan: { planId } },
      });

      return !!purchase;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadGatewayException('Error checking plan purchase');
    }
  }

  async purchasePlan(planId: string, user: User) {
    try {
      const plan = await this.getPlanById(planId);

      if (!plan) {
        throw new NotFoundException('Plan not found');
      }

      return await this.mercadopagoService.createPreference(user, null, plan);
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
   * Eliminar un plan
   *
   * @param planId
   * @returns ID del plan eliminado y un mensaje de exito.
   */
  async deletePlan(planId: string) {
    try {
      const deletePlan = await this.planRepository.delete(planId);

      if (deletePlan.affected === 0) {
        throw new NotFoundException('Plan not found');
      }

      return {
        message: 'Plan deleted succesfully',
        id: planId,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error deleting plan');
    }
  }

  /**
   * Modificar un plan
   *
   * @param planId
   * @param updatePlanDto
   * @returns Objeto modificado
   */
  async updatePlan(planId: string, updatePlan: UpdatePlanDto) {
    try {
      const { price, ...rest } = updatePlan;

      const updatedPlan = await this.planRepository.update(planId, {
        ...rest,
        ...(price !== undefined && price !== null && price !== ''
          ? { price: Number(price) }
          : {}),
      });

      if (updatedPlan.affected === 0)
        throw new NotFoundException('Plan Not Found');

      return updatedPlan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating plan');
    }
  }
}
