import { Injectable, NotFoundException } from '@nestjs/common';
import { NewsRepository } from '../../../domain/news/repositories/news.repository';
import { News } from '../../../domain/news/entities/news.entity';

@Injectable()
export class PublishNewsUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(id: string): Promise<News> {
    const news = await this.newsRepository.findById(id);
    if (!news) throw new NotFoundException('Notícia não encontrada.');
    news.publish();
    await this.newsRepository.save(news);
    return news;
  }
}

@Injectable()
export class UnpublishNewsUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(id: string): Promise<News> {
    const news = await this.newsRepository.findById(id);
    if (!news) throw new NotFoundException('Notícia não encontrada.');
    news.unpublish();
    await this.newsRepository.save(news);
    return news;
  }
}

@Injectable()
export class DeleteNewsUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(id: string): Promise<void> {
    const news = await this.newsRepository.findById(id);
    if (!news) throw new NotFoundException('Notícia não encontrada.');
    await this.newsRepository.delete(id);
  }
}

@Injectable()
export class ListAllNewsUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(): Promise<News[]> {
    return this.newsRepository.findAll();
  }
}

@Injectable()
export class ListPublishedNewsUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(): Promise<News[]> {
    return this.newsRepository.findAllPublished();
  }
}

@Injectable()
export class GetNewsBySlugUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(slug: string): Promise<News> {
    const news = await this.newsRepository.findBySlug(slug);
    if (!news || !news.published) {
      throw new NotFoundException('Notícia não encontrada.');
    }
    return news;
  }
}
