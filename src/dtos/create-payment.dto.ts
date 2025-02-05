import { IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  merchantId: number;

  @IsNumber()
  amount: number;
}
