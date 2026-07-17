import { Injectable } from '@nestjs/common';
import { News } from '../../../domain/news/entities/news.entity';
import { NewsRepository } from '../../../domain/news/repositories/news.repository';
import { Slug } from '../../../domain/news/value-objects/slug.vo';

export interface CreateNewsCommand {
  title: string;
  tag: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
}

@Injectable()
export class CreateNewsUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(command: CreateNewsCommand): Promise<News> {
    const candidateSlug = Slug.createFromTitle(command.title).toString();
    const existing = await this.newsRepository.findBySlug(candidateSlug);
    if (existing) {
      throw new Error('Já existe uma notícia com um título muito parecido (mesmo slug).');
    }

    const news = News.create(command);
    await this.newsRepository.save(news);
    return news;
  }
}
