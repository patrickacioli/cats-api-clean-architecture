import { DynamicModule } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class MongooseMemoryServer {
  private server!: MongoMemoryServer;

  public async getRootModule(
    options: MongooseModuleOptions = {},
  ): Promise<DynamicModule> {
    return MongooseModule.forRootAsync({
      useFactory: async () => {
        this.server = await MongoMemoryServer.create();
        return {
          ...options,
          uri: this.server.getUri(),
          ignoreUndefined: true,
        };
      },
    });
  }

  public async stop() {
    await this.server?.stop();
  }
}
