import { NestFactory } from '@nestjs/core';
import { RabbitmqService } from './rabbitmq.service';
import { OrderModule } from './order/order.module';


async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const rmqService = app.get<RabbitmqService>(RabbitmqService);
  app.connectMicroservice(rmqService.getOptions('order_queue'));
  await app.startAllMicroservices();
}
bootstrap();
