import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitmqService } from './rabbitmq.service';

interface RmqModuleOptions {
  name: string;
}

@Module({
  imports: [ConfigModule],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RabbitmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBITMQ_URL') || ''],
                queue: `${name}_queue`,
                queueOptions: {
                  durable: false,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      providers: [RabbitmqService],
      exports: [RabbitmqService],
    };
  }
}
