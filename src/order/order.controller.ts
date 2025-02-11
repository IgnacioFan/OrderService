import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitmqService } from '../rabbitmq.service';
import { OrderService } from './order.service';


@Controller()
export class OrderController {
  constructor(
    private readonly rmqService: RabbitmqService,
    private readonly orderService: OrderService,
  ) {}

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    await this.orderService.createOrder(data);
    this.rmqService.ack(context);
  }

  @MessagePattern('order_paid')
  async handleOrderPaid(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      const order = await this.orderService.completeOrder(data);
      return { status: 'success', order: order };
    } catch(error) {
      return { status: 'failed', error: error.message };
    } finally {
      this.rmqService.ack(context);
    }
  }
}
