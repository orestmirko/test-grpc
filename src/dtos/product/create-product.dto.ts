import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsDate,
  Min,
  Max,
  Length,
  IsUrl,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Currency, Season, ProductType, PackagingType } from '@enums';

export class CreateProductDto {
  @ApiProperty({ enum: ProductType, example: ProductType.FLOWER })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiProperty({ example: 'Червона троянда' })
  @IsString()
  @Length(2, 200)
  name: string;

  @ApiProperty({ example: 'Троянда', required: false })
  @IsString()
  @Length(2, 100)
  @IsOptional()
  variety?: string;

  @ApiProperty({ example: 'Чудова троянда з сильним ароматом', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 100.50 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enum: Currency, example: Currency.UAH })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  minimumOrderQuantity?: number;

  @ApiProperty({ example: '2024-03-20', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  arrivalDate?: Date;

  @ApiProperty({ example: true })
  @IsBoolean()
  isFresh: boolean;

  @ApiProperty({ example: ['red'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  colors?: string[];

  @ApiProperty({ example: 'Нідерланди', required: false })
  @IsString()
  @Length(2, 100)
  @IsOptional()
  originCountry?: string;

  @ApiProperty({ example: 'Додаткові примітки', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 50.5, required: false })
  @IsNumber()
  @Min(0)
  @Max(999.99)
  @IsOptional()
  heightCm?: number;

  @ApiProperty({ example: 3, required: false })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  fragranceIntensity?: number;

  @ApiProperty({ enum: Season, required: false })
  @IsEnum(Season)
  @IsOptional()
  seasonality?: Season;

  @ApiProperty({ example: false })
  @IsBoolean()
  isPackagingRequired: boolean;

  @ApiProperty({ enum: PackagingType, example: PackagingType.NONE })
  @IsEnum(PackagingType)
  packagingType: PackagingType;

  @ApiProperty({ example: 'blue', required: false })
  @IsString()
  @Length(2, 50)
  @IsOptional()
  packagingColor?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ example: 15, required: false })
  @IsNumber()
  @Min(1)
  @Max(100000)
  @IsOptional()
  flowersCount?: number;

  @ApiProperty({ example: ['sent_valentine_day', 'womens_day'], required: false })
  @IsArray()
  @IsString({ each: true })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    each: true,
    message: 'Tags should contain only letters, numbers, underscores and hyphens',
  })
  @IsOptional()
  tags?: string[];
}
