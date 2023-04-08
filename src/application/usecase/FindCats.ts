import { CatRepository } from '../../domain';
import { Cat, Usecase } from '../../domain/entity';

export class FindCats implements Usecase {
  constructor(private readonly catRepository: CatRepository) {}

  async execute() {
    return this.catRepository.findAll<Cat>();
  }
}
