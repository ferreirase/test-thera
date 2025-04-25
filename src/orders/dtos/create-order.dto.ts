import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @ApiProperty({ description: 'The ID of the product' })
  @IsNotEmpty()
  produtoId: number;

  @ApiProperty({ description: 'The quantity of the product' })
  @IsNotEmpty()
  quantidade: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'The items in the order',
    type: [OrderItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
