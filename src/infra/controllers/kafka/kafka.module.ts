import { Module } from '@nestjs/common';
import { CatsKafkaController } from './cats.Kafka.controller';

@Module({
  controllers: [CatsKafkaController],
})
export class KafkaControllerModule {}
