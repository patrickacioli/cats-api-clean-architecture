import { Cat, CatRepository, Usecase } from '../../domain';
import { NotFoundException } from '../../domain/errors';

export class FindOneCat implements Usecase {
  constructor(private readonly catRepository: CatRepository) {}

  async execute(catId: string) {
    const cat = await this.catRepository.get<Cat>(catId);
    if (!cat) {
      throw new NotFoundException(Cat);
    }
    return cat;
  }
}
