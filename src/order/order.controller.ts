import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
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

  @EventPattern('order_paid')
  async handleOrderPaid(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Received message:', data);
    // create a payment transaction

    this.rmqService.ack(context);
  }
}
