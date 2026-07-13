import { randomUUID } from 'crypto';
import { Slug } from '../value-objects/slug.vo';

export interface NewsProps {
  id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  content: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNewsInput {
  title: string;
  tag: string;
  excerpt: string;
  content: string;
}

/**
 * Entidade de domínio News (notícia do blog).
 * Concentra as regras de negócio: geração de slug, validação de
 * campos obrigatórios e transições de estado publicado/rascunho.
 * Não conhece Prisma, HTTP ou qualquer detalhe de infraestrutura.
 */
export class News {
  private props: NewsProps;

  private constructor(props: NewsProps) {
    this.props = props;
  }

  static create(input: CreateNewsInput): News {
    News.validateRequiredFields(input);

    const slug = Slug.createFromTitle(input.title).toString();
    const now = new Date();

    return new News({
      id: randomUUID(),
      title: input.title.trim(),
      slug,
      tag: input.tag.trim(),
      excerpt: input.excerpt.trim(),
      content: input.content.trim(),
      published: false,
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Reconstrói a entidade a partir de dados persistidos (usado pelo repositório). */
  static restore(props: NewsProps): News {
    return new News(props);
  }

  private static validateRequiredFields(input: CreateNewsInput): void {
    if (!input.title?.trim()) throw new Error('O título da notícia é obrigatório.');
    if (!input.tag?.trim()) throw new Error('A categoria (tag) da notícia é obrigatória.');
    if (!input.excerpt?.trim()) throw new Error('O resumo da notícia é obrigatório.');
    if (!input.content?.trim()) throw new Error('O conteúdo da notícia é obrigatório.');
    if (input.title.trim().length < 5) throw new Error('O título deve ter ao menos 5 caracteres.');
    if (input.excerpt.trim().length > 280) throw new Error('O resumo deve ter no máximo 280 caracteres.');
  }

  update(input: Partial<CreateNewsInput>): void {
    if (input.title !== undefined) {
      if (!input.title.trim()) throw new Error('O título da notícia é obrigatório.');
      this.props.title = input.title.trim();
      this.props.slug = Slug.createFromTitle(input.title).toString();
    }
    if (input.tag !== undefined) {
      if (!input.tag.trim()) throw new Error('A categoria (tag) da notícia é obrigatória.');
      this.props.tag = input.tag.trim();
    }
    if (input.excerpt !== undefined) {
      if (input.excerpt.trim().length > 280) throw new Error('O resumo deve ter no máximo 280 caracteres.');
      this.props.excerpt = input.excerpt.trim();
    }
    if (input.content !== undefined) {
      if (!input.content.trim()) throw new Error('O conteúdo da notícia é obrigatório.');
      this.props.content = input.content.trim();
    }
    this.props.updatedAt = new Date();
  }

  publish(): void {
    if (this.props.published) {
      throw new Error('Esta notícia já está publicada.');
    }
    this.props.published = true;
    this.props.publishedAt = new Date();
    this.props.updatedAt = new Date();
  }

  unpublish(): void {
    if (!this.props.published) {
      throw new Error('Esta notícia já está como rascunho.');
    }
    this.props.published = false;
    this.props.publishedAt = null;
    this.props.updatedAt = new Date();
  }

  get id(): string { return this.props.id; }
  get title(): string { return this.props.title; }
  get slug(): string { return this.props.slug; }
  get tag(): string { return this.props.tag; }
  get excerpt(): string { return this.props.excerpt; }
  get content(): string { return this.props.content; }
  get published(): boolean { return this.props.published; }
  get publishedAt(): Date | null { return this.props.publishedAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  toProps(): NewsProps {
    return { ...this.props };
  }
}
