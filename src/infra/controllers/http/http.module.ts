import { Module } from '@nestjs/common';
import { CatsHttpController } from './cats.http.controller';

@Module({
  controllers: [CatsHttpController],
})
export class HttpControllerModule {}
