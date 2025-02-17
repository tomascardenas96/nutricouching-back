import { Type } from 'class-transformer';
import { IsInstance, IsNotEmpty, ValidateNested } from 'class-validator';
import { ClientOrder } from 'src/client-order/entities/client-order.entity';

export class CreatePaymentDto {
  @IsNotEmpty()
  paymentId: string;

  @ValidateNested() // Verifica que clientOrder sea un objeto válido
  @IsInstance(ClientOrder) // Asegura que clientOrder sea una instancia de ClientOrder
  @Type(() => ClientOrder) // Utiliza class-transformer para transformar y validar la clase
  clientOrder: ClientOrder;
}
