import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatSchemaFeature } from './cat.schema';

@Module({
  imports: [MongooseModule.forFeature([CatSchemaFeature])],
})
export class SchemasModule {}
