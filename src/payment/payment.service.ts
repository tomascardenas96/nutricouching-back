import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  /**
   * Verifica si el pago ya fue procesado por el webhook para no repetir las operaciones (restar stock, notificaciones, etc...)
   *
   * @param paymentId - ID del pago proporcionado por el webhook de Mercado Pago
   * @returns - Valor booleano que indica si el pago ya fue procesado
   */
  async isPaymentProcessed(paymentId: string): Promise<Boolean> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { paymentId },
      });

      return !!payment;
    } catch (error) {
      throw new BadGatewayException('Error verifying if payment is processed');
    }
  }

  /**
   * Crea un registro de pago asociado a una orden
   *
   * @param payment - Dto para crear un nuevo objeto de tipo Payment
   */
  async markPaymentAsProcessed(payment: CreatePaymentDto): Promise<void> {
    try {
      const newPayment = this.paymentRepository.create(payment);

      await this.paymentRepository.save(newPayment);
    } catch (error) {
      throw new BadGatewayException('Error marking payment as processed');
    }
  }
}
