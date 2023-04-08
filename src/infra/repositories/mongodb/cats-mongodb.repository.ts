import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from '../../../domain/entity';
import { CatRepository } from '../../../domain/interfaces';
import { CatDocument } from '../../schemas/cat.schema';

@Injectable()
export class CatsMongoDBRepository extends CatRepository {
  constructor(@InjectModel('Cat') private model: Model<CatDocument>) {
    super();
  }

  async save<Cat>(cat: Cat): Promise<Cat> {
    const obj = await this.model.create(cat);
    return this.toEntity(obj?.toJSON(), Cat);
  }

  async get<Cat>(id: string): Promise<Cat> {
    const obj = await this.model.findOne({ _id: id }).exec();
    return this.toEntity(obj?.toJSON(), Cat);
  }

  async delete(id: string) {
    const deletedCat = await this.model.findByIdAndRemove({ _id: id }).exec();
    return deletedCat ? true : false;
  }

  async findAll<Cat>(): Promise<Cat[]> {
    const cats = await this.model.find({}).exec();
    return cats.map((cat) => this.toEntity(cat.toJSON(), Cat));
  }
}
