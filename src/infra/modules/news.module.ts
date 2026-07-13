import { Module } from '@nestjs/common';
import { NewsController } from '../../interface/http/news/news.controller';
import { AdminNewsController } from '../../interface/http/admin-news/admin-news.controller';
import { CreateNewsUseCase } from '../../application/news/use-cases/create-news.use-case';
import { UpdateNewsUseCase } from '../../application/news/use-cases/update-news.use-case';
import {
  DeleteNewsUseCase,
  GetNewsBySlugUseCase,
  ListAllNewsUseCase,
  ListPublishedNewsUseCase,
  PublishNewsUseCase,
  UnpublishNewsUseCase,
} from '../../application/news/use-cases/manage-news.use-cases';
import { NewsRepository } from '../../domain/news/repositories/news.repository';
import { PrismaNewsRepository } from '../database/prisma/repositories/prisma-news.repository';
import { PrismaModule } from '../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NewsController, AdminNewsController],
  providers: [
    { provide: NewsRepository, useClass: PrismaNewsRepository },
    CreateNewsUseCase,
    UpdateNewsUseCase,
    DeleteNewsUseCase,
    ListAllNewsUseCase,
    ListPublishedNewsUseCase,
    PublishNewsUseCase,
    UnpublishNewsUseCase,
    GetNewsBySlugUseCase,
  ],
})
export class NewsModule {}
