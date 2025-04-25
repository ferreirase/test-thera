import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ description: 'The category of the product' })
  @IsNotEmpty()
  @IsString()
  categoria: string;

  @ApiProperty({ description: 'The description of the product' })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({ description: 'The price of the product' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  preco: number;

  @ApiProperty({ description: 'The quantity in stock' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantidade_estoque: number;
}
