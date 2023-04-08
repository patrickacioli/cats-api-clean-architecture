import { Repository } from './Repository';

export abstract class CatRepository extends Repository {
  abstract get<Cat>(id: string): Promise<Cat>;
  abstract save<Cat>(cat: Cat): Promise<Cat>;
  abstract delete(id: string): Promise<boolean>;
  abstract findAll<Cat>(): Promise<Cat[]>;
}
