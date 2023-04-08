import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT', 3000);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get<string>('KAFKA_CLIENT_ID'),
        brokers: configService.get<string>('KAFKA_BROKERS').split(','),
      },
      consumer: {
        groupId: configService.get<string>('KAFKA_CONSUMER'),
        retry: {
          retries: 5,
        },
      },
      run: {
        autoCommit: true,
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Uncomment this line to start all microservices
  // app.startAllMicroservices();
  app
    .listen(PORT, '0.0.0.0')
    .then(() => Logger.log(`API Listen on ${PORT}`))
    .catch((error: any) => Logger.error(error));
}
bootstrap();
