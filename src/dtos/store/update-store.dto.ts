import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  Length,
  Matches,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { StoreType } from '@enums';

export class UpdateStoreDto {
  @ApiProperty({ example: 'Квітковий рай' })
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: StoreType, example: StoreType.PHYSICAL })
  @IsEnum(StoreType)
  @IsOptional()
  storeType?: StoreType;

  @ApiProperty({ example: 'Квітковий магазин' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '380501234567' })
  @IsString()
  @Length(12, 12)
  @Matches(/^380\d{9}$/)
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'store@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'https://example.com' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'вул. Шевченка, 1' })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({ example: 'Київ' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Печерський' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ example: 50.4501 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 30.5234 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isCityDeliveryAvailable?: boolean;

  @ApiProperty({ example: 'https://instagram.com/store' })
  @IsUrl()
  @IsOptional()
  instagramUrl?: string;

  @ApiProperty({ example: 'https://tiktok.com/@store' })
  @IsUrl()
  @IsOptional()
  tiktokUrl?: string;
}
