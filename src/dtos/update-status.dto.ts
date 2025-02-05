import { IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  paymentIds: number[];
}
