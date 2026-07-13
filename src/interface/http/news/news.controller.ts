import { Controller, Get, Param } from '@nestjs/common';
import { ListPublishedNewsUseCase } from '../../../application/news/use-cases/manage-news.use-cases';
import { GetNewsBySlugUseCase } from '../../../application/news/use-cases/manage-news.use-cases';
import { NewsPresenter } from '../common/news.presenter';

/**
 * Rotas PÚBLICAS, consumidas pelo site (blog da landing page).
 * Só retornam notícias já publicadas.
 */
@Controller('news')
export class NewsController {
  constructor(
    private readonly listPublishedNews: ListPublishedNewsUseCase,
    private readonly getNewsBySlug: GetNewsBySlugUseCase,
  ) {}

  @Get()
  async list() {
    const news = await this.listPublishedNews.execute();
    return NewsPresenter.toHttpList(news);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const news = await this.getNewsBySlug.execute(slug);
    return NewsPresenter.toHttp(news);
  }
}
