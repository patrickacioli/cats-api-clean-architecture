import { DynamicModule, Module } from '@nestjs/common';
import { RepositoryProvider } from './repository.provider';

@Module({
  imports: [],
})
export class RepositoriesModule {
  static forRoot(options: { datastore: string }): DynamicModule {
    const moduleRef = RepositoryProvider.getModule(options.datastore);
    return {
      module: RepositoriesModule,
      global: true,
      imports: [...moduleRef.imports],
      providers: [...moduleRef.providers],
      exports: [...moduleRef.exports],
    };
  }
}
