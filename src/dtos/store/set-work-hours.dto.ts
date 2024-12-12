import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsString,
  Min,
  Max,
  Matches,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class WorkHoursDto {
  @ApiProperty({ example: 1, description: 'Day of week (1-7, 1 - Monday)' })
  @IsNumber()
  @Min(1)
  @Max(7)
  dayOfWeek: number;

  @ApiProperty({ example: true, description: 'Whether this is a working day' })
  @IsBoolean()
  isWorkingDay: boolean;

  @ApiProperty({
    example: '09:00',
    description: 'Opening time (required for working days)',
    required: false,
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:MM format',
  })
  @IsOptional()
  openTime?: string;

  @ApiProperty({
    example: '18:00',
    description: 'Closing time (required for working days)',
    required: false,
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:MM format',
  })
  @IsOptional()
  closeTime?: string;
}

export class SetWorkHoursDto {
  @ApiProperty({
    type: [WorkHoursDto],
    description: 'Array of work hours for each day of week',
    example: [
      { dayOfWeek: 1, isWorkingDay: true, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 2, isWorkingDay: true, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 7, isWorkingDay: false },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkHoursDto)
  workHours: WorkHoursDto[];
}
