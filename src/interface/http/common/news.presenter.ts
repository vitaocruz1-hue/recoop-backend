import { News } from '../../../domain/news/entities/news.entity';

export class NewsPresenter {
  static toHttp(news: News) {
    return {
      id: news.id,
      title: news.title,
      slug: news.slug,
      tag: news.tag,
      excerpt: news.excerpt,
      content: news.content,
      coverImage: news.coverImage,
      published: news.published,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    };
  }

  static toHttpList(newsList: News[]) {
    return newsList.map(NewsPresenter.toHttp);
  }
}
