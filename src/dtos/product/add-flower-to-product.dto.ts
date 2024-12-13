import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class FlowerQuantityDto {
  @ApiProperty({ example: 1, description: 'ID of the flower product to add' })
  @IsNumber()
  flowerId: number;

  @ApiProperty({ example: 5, description: 'Quantity of flowers to add' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class AddFlowerToProductDto {
  @ApiProperty({
    type: [FlowerQuantityDto],
    description: 'Array of flowers with quantities to add',
    example: [
      { flowerId: 1, quantity: 5 },
      { flowerId: 2, quantity: 3 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlowerQuantityDto)
  flowers: FlowerQuantityDto[];
}
