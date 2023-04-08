import { ApplicationLogger, Cat, CatRepository, Usecase } from '../../domain';

export interface CreateCatInput {
  name: string;
  age: number;
  breed: string;
}

export class CreateCat implements Usecase {
  constructor(
    private readonly catRepository: CatRepository,
    private readonly logger: ApplicationLogger,
  ) {}

  async execute(input: CreateCatInput) {
    const cat = new Cat({
      name: input.name,
      age: input.age,
      breed: input.breed,
    });
    this.logger.log(`Hello from logger! ${CreateCat.name}`);
    return this.catRepository.save(cat);
  }
}
