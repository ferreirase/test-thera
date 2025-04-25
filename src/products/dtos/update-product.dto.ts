import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ description: 'The name of the product', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'The category of the product', required: false })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({
    description: 'The description of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'The price of the product', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  preco?: number;

  @ApiProperty({ description: 'The quantity in stock', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidade_estoque?: number;
}
