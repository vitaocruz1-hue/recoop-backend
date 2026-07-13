import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NewsRepository } from '../../../../domain/news/repositories/news.repository';
import { News, NewsProps } from '../../../../domain/news/entities/news.entity';

/**
 * Adaptador que implementa a porta NewsRepository usando Prisma/SQLite.
 * Traduz entre a entidade de domínio (News) e o modelo de persistência.
 */
@Injectable()
export class PrismaNewsRepository implements NewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(news: News): Promise<void> {
    const props = news.toProps();
    await this.prisma.news.upsert({
      where: { id: props.id },
      create: {
        id: props.id,
        title: props.title,
        slug: props.slug,
        tag: props.tag,
        excerpt: props.excerpt,
        content: props.content,
        published: props.published,
        publishedAt: props.publishedAt,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },
      update: {
        title: props.title,
        slug: props.slug,
        tag: props.tag,
        excerpt: props.excerpt,
        content: props.content,
        published: props.published,
        publishedAt: props.publishedAt,
        updatedAt: props.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<News | null> {
    const row = await this.prisma.news.findUnique({ where: { id } });
    return row ? News.restore(row as NewsProps) : null;
  }

  async findBySlug(slug: string): Promise<News | null> {
    const row = await this.prisma.news.findUnique({ where: { slug } });
    return row ? News.restore(row as NewsProps) : null;
  }

  async findAll(): Promise<News[]> {
    const rows = await this.prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map((row) => News.restore(row as NewsProps));
  }

  async findAllPublished(): Promise<News[]> {
    const rows = await this.prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    });
    return rows.map((row) => News.restore(row as NewsProps));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.news.delete({ where: { id } });
  }
}
