import { ModuleMetadata } from '@nestjs/common';

export interface RepositoryModuleOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<any> | any;
  inject?: any[];
  datastore: any;
  imports?: any[];
}
