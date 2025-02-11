import { Module } from '@nestjs/common';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { PrismaService } from '../prisma.service';
import { RabbitmqModule } from '../rabbitmq.module';

@Module({
  imports: [RabbitmqModule.register({name: 'order'})],
  providers: [OrderService, PrismaService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
