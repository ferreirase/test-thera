import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @ApiProperty({ description: 'The unique identifier of the order' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The total value of the order' })
  @Column('decimal', { precision: 10, scale: 2 })
  total_pedido: number;

  @ApiProperty({
    description: 'The status of the order',
    enum: ['Pendente', 'Concluído', 'Cancelado'],
  })
  @Column({
    type: 'varchar',
    enum: ['Pendente', 'Concluído', 'Cancelado'],
    default: 'Pendente',
  })
  status: string;

  @ApiProperty({ description: 'The items in the order' })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];
}
