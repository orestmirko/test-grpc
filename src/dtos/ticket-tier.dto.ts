import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CreateTicketTierDto {
  @IsDateString()
  @ApiProperty()
  public sale_start: Date;

  @IsDateString()
  @ApiProperty()
  public sale_end: Date;
}
