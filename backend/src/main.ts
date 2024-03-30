import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Users example')
    .setDescription('The user API description')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const appService = app.get(AppService);
  // await appService.initializeDb();

  await app.listen(process.env.ticdi_environment == 'DEVELOPMENT' ? 3001 : 3000);
}
bootstrap();
