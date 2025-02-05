import { IsNumber, Min, Max } from 'class-validator';

export class SetCommissionsDto {
  @IsNumber()
  @Min(0)
  fixedFee: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentFee: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  holdPercent: number;
}
