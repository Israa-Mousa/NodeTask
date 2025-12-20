import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/loggin.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import {
  HttpExceptionFilter,
  PrismaExceptionFilter,
  UncaughtExceptionFilter,
  ZodExceptionFilter,
} from './exceptions/exception';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  app.useGlobalFilters(
    new UncaughtExceptionFilter(),
    new HttpExceptionFilter(),
    new ZodExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Simple Shop API')
    .setDescription('Complete e-commerce backend with admin role management, transactions, and advanced filtering')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access_token',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Products', 'Product catalog')
    .addTag('Orders', 'Order management')
    .addTag('Transactions', 'User transactions and payments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
    },
  });

  console.log(process.env.NODE_ENV, 'NODE_ENV');
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
