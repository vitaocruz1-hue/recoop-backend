import { News } from '../entities/news.entity';

/**
 * Porta (interface) do repositório de notícias.
 * O domínio depende apenas desta abstração — quem implementa de
 * fato (Prisma, outro ORM, memória para testes) fica na infra.
 */
export abstract class NewsRepository {
  abstract save(news: News): Promise<void>;
  abstract findById(id: string): Promise<News | null>;
  abstract findBySlug(slug: string): Promise<News | null>;
  abstract findAll(): Promise<News[]>;
  abstract findAllPublished(): Promise<News[]>;
  abstract delete(id: string): Promise<void>;
}
