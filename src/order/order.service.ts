import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createOrder(orderData: { rentId: number; userId: number; amount: number; currency: string }) {
    const { rentId, userId, amount, currency } = orderData;
    const order = await this.prisma.order.create({
      data: {
        rentId,
        userId,
        amount,
        currency,
        status: 'pending',
      },
    });
    return order;
  }
}
