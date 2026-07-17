import { Injectable, NotFoundException } from '@nestjs/common';
import { NewsRepository } from '../../../domain/news/repositories/news.repository';
import { News } from '../../../domain/news/entities/news.entity';

export interface UpdateNewsCommand {
  id: string;
  title?: string;
  tag?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string | null;
}

@Injectable()
export class UpdateNewsUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(command: UpdateNewsCommand): Promise<News> {
    const news = await this.newsRepository.findById(command.id);
    if (!news) throw new NotFoundException('Notícia não encontrada.');

    news.update(command);
    await this.newsRepository.save(news);
    return news;
  }
}
