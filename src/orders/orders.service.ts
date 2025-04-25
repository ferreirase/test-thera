import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create a new order with status 'Pendente'
      const order = new Order();
      order.status = 'Pendente';
      order.total_pedido = 0;
      order.items = [];

      // Save the order to get an ID
      const savedOrder = await queryRunner.manager.save(order);

      let totalPedido = 0;

      // Process each item in the order
      for (const item of createOrderDto.items) {
        // Get the product
        const product = await this.productsService.findOne(item.produtoId);

        // Check if there's enough stock
        if (product.quantidade_estoque < item.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto ${product.nome}. Disponível: ${product.quantidade_estoque}, Solicitado: ${item.quantidade}`,
          );
        }

        // Create order item
        const orderItem = new OrderItem();
        orderItem.order = savedOrder;
        orderItem.product = product;
        orderItem.produtoId = product.id;
        orderItem.quantidade = item.quantidade;
        orderItem.precoUnitario = product.preco;

        // Save the order item
        await queryRunner.manager.save(orderItem);

        // Add to total
        totalPedido += item.quantidade * product.preco;
      }

      // Update order total
      savedOrder.total_pedido = totalPedido;
      await queryRunner.manager.save(savedOrder);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Return the complete order
      return this.findOne(savedOrder.id);
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items', 'items.product'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
}
