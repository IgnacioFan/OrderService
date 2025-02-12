import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitmqService } from './rabbitmq.service';

interface RmqModuleOptions {
  name: string;
}

@Module({
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RabbitmqModule,
      imports: [
        ClientsModule.register([
          {
            name,
            transport: Transport.RMQ,
            options: {
              urls: ["amqp://rabbitmq:5672"],
              queue: `${name}_queue`,
              queueOptions: {
                durable: false
              }
            },
          },
        ]),
      ],
      providers: [RabbitmqService],
      exports: [RabbitmqService],
    };
  }
}
