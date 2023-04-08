import { DynamicModule, Module } from '@nestjs/common';
import { HttpControllerModule } from './http/http.module';
import { KafkaControllerModule } from './kafka/kafka.module';

@Module({})
export class ControllersModule {
  static forRoot(): DynamicModule {
    return {
      module: ControllersModule,
      imports: [HttpControllerModule, KafkaControllerModule],
    };
  }
}
