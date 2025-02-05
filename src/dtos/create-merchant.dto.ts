import { IsString, IsNumber } from 'class-validator';

export class CreateMerchantDto {
  @IsString()
  name: string;

  @IsNumber()
  commissionPercent: number;
}
