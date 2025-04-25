import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @ApiProperty({ description: 'The unique identifier of the order item' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The order this item belongs to' })
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedidoId' })
  order: Order;

  @Column()
  pedidoId: number;

  @ApiProperty({ description: 'The product in this order item' })
  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'produtoId' })
  product: Product;

  @Column()
  produtoId: number;

  @ApiProperty({ description: 'The quantity of the product' })
  @Column('int')
  quantidade: number;

  @ApiProperty({
    description: 'The unit price of the product at the time of order',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  precoUnitario: number;
}
