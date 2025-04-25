import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity()
export class Product {
  @ApiProperty({ description: 'The unique identifier of the product' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the product' })
  @Column()
  nome: string;

  @ApiProperty({ description: 'The category of the product' })
  @Column()
  categoria: string;

  @ApiProperty({ description: 'The description of the product' })
  @Column()
  descricao: string;

  @ApiProperty({ description: 'The price of the product' })
  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @ApiProperty({ description: 'The quantity in stock' })
  @Column('int')
  quantidade_estoque: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
