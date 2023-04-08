import { Usecase } from '../../domain/entity';
import { CatRepository } from '../../domain/interfaces';

export class DeleteCat implements Usecase {
  constructor(private readonly catRepository: CatRepository) {}

  async execute(catId: string) {
    const catDeleted = await this.catRepository.delete(catId);
    return catDeleted ? true : false;
  }
}
