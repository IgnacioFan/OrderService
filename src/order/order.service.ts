import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createOrder(data: { rentId: number; userId: number; amount: number; currency: string }) {
    const { rentId, userId, amount, currency } = data;
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

  processPayment(error = '') {
    if(!error) return { success: true, error: '' }
    return { success: false, error: error }
  }

  async completeOrder(data: { rentId: number; userId: number}) {
    const { rentId, userId } = data;
    const order = await this.prisma.order.findFirst({
      where: { rentId, userId },
    });
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === 'completed') {
      throw new Error('Order has already completed');
    }
    return this.prisma.$transaction(async (prisma) => {
      const { success, error } = this.processPayment()
      await prisma.payment.create({
        data: {
          orderId: order.id,
          status: success ? 'paid' : 'failed',
        },
      });
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: success ? 'completed' : 'failed' },
      });
      if (!success) {
        throw new Error(error);
      }
      return updatedOrder;
    });
  }
}
