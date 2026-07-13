import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../infra/auth/guards/jwt-auth.guard';
import { CreateNewsUseCase } from '../../../application/news/use-cases/create-news.use-case';
import { UpdateNewsUseCase } from '../../../application/news/use-cases/update-news.use-case';
import {
  DeleteNewsUseCase,
  ListAllNewsUseCase,
  PublishNewsUseCase,
  UnpublishNewsUseCase,
} from '../../../application/news/use-cases/manage-news.use-cases';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsPresenter } from '../common/news.presenter';

/**
 * Rotas PROTEGIDAS (exigem login) — usadas pela área /admin do site
 * para publicar, editar e remover notícias do blog.
 */
@UseGuards(JwtAuthGuard)
@Controller('admin/news')
export class AdminNewsController {
  constructor(
    private readonly createNews: CreateNewsUseCase,
    private readonly updateNews: UpdateNewsUseCase,
    private readonly deleteNews: DeleteNewsUseCase,
    private readonly listAllNews: ListAllNewsUseCase,
    private readonly publishNews: PublishNewsUseCase,
    private readonly unpublishNews: UnpublishNewsUseCase,
  ) {}

  @Get()
  async list() {
    const news = await this.listAllNews.execute();
    return NewsPresenter.toHttpList(news);
  }

  @Post()
  async create(@Body() dto: CreateNewsDto) {
    const news = await this.createNews.execute(dto);
    return NewsPresenter.toHttp(news);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    const news = await this.updateNews.execute({ id, ...dto });
    return NewsPresenter.toHttp(news);
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    const news = await this.publishNews.execute(id);
    return NewsPresenter.toHttp(news);
  }

  @Post(':id/unpublish')
  async unpublish(@Param('id') id: string) {
    const news = await this.unpublishNews.execute(id);
    return NewsPresenter.toHttp(news);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteNews.execute(id);
    return { success: true };
  }
}
