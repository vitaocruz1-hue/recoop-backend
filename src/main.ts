import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const corsOrigins = (config.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

 const port = Number(process.env.PORT) || config.get<number>('PORT') || 3333;
  // 0.0.0.0 é necessário em hospedagens como Render para o serviço
  // ser alcançável de fora do contêiner.
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`Recoop API rodando na porta ${port} (prefixo /api)`);
}
bootstrap();
