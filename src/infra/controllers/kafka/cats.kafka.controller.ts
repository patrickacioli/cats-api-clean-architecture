import { CreateCat } from '@application';
import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateCatDTO } from '../../dto/cats/create-cat.dto';
import { UsecasesModule } from '../../usecases/usecases.module';

@Controller()
export class CatsKafkaController {
  constructor(
    @Inject(UsecasesModule.CREATE_CAT) private readonly createCat: CreateCat,
  ) {}

  @EventPattern('cats.create')
  async create(@Payload() cat: CreateCatDTO) {
    await this.createCat.execute(cat);
  }
}
