import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let productsService: ProductsService;

  const mockOrderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockOrderItemRepository = {
    save: jest.fn(),
  };

  const mockProductsService = {
    findOne: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException when product stock is insufficient', async () => {
      // Arrange
      const createOrderDto = {
        items: [
          {
            produtoId: 1,
            quantidade: 10,
          },
        ],
      };

      mockProductsService.findOne.mockResolvedValue({
        id: 1,
        nome: 'Test Product',
        preco: 100,
        quantidade_estoque: 5, // Less than requested quantity
      });

      // Act & Assert
      await expect(service.create(createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockProductsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should calculate order total correctly', async () => {
      // Arrange
      const createOrderDto = {
        items: [
          {
            produtoId: 1,
            quantidade: 2,
          },
          {
            produtoId: 2,
            quantidade: 3,
          },
        ],
      };

      const product1 = {
        id: 1,
        nome: 'Product 1',
        preco: 100,
        quantidade_estoque: 10,
      };

      const product2 = {
        id: 2,
        nome: 'Product 2',
        preco: 50,
        quantidade_estoque: 10,
      };

      const savedOrder = {
        id: 1,
        status: 'Pendente',
        total_pedido: 0,
        items: [],
      };

      // Mock the product service to return the test products
      mockProductsService.findOne
        .mockResolvedValueOnce(product1)
        .mockResolvedValueOnce(product2);

      // Mock the query runner manager save to return the saved order
      mockDataSource
        .createQueryRunner()
        .manager.save.mockResolvedValueOnce(savedOrder) // First save for the order
        .mockResolvedValueOnce({}) // Second save for first order item
        .mockResolvedValueOnce({}) // Third save for second order item
        .mockResolvedValueOnce({
          // Fourth save for updating the order total
          ...savedOrder,
          total_pedido: 350, // Expected total: (2 * 100) + (3 * 50) = 350
        });

      // Mock the findOne to return the complete order with items
      mockOrderRepository.findOne.mockResolvedValue({
        id: 1,
        status: 'Pendente',
        total_pedido: 350,
        items: [
          {
            id: 1,
            produtoId: 1,
            quantidade: 2,
            precoUnitario: 100,
            product: product1,
          },
          {
            id: 2,
            produtoId: 2,
            quantidade: 3,
            precoUnitario: 50,
            product: product2,
          },
        ],
      });

      // Act
      const result = await service.create(createOrderDto);

      // Assert
      expect(result.total_pedido).toBe(350);
      expect(mockProductsService.findOne).toHaveBeenCalledTimes(2);
      expect(
        mockDataSource.createQueryRunner().startTransaction,
      ).toHaveBeenCalled();
      expect(
        mockDataSource.createQueryRunner().commitTransaction,
      ).toHaveBeenCalled();
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['items', 'items.product'],
      });
    });
  });
});
