import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

type CatDocument = HydratedDocument<Cat>;
const CatSchema = SchemaFactory.createForClass(Cat);

const CatSchemaFeature: ModelDefinition = {
  name: Cat.name,
  schema: CatSchema,
};

export { CatSchemaFeature, CatDocument, CatSchema };
