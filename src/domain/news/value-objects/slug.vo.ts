/**
 * Value Object: Slug
 * Garante que o identificador de URL da notícia é sempre válido
 * (minúsculo, sem acentos, sem espaços, apenas letras/números/hífen).
 */
export class Slug {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static createFromTitle(title: string): Slug {
    const normalized = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!normalized) {
      throw new Error('Não foi possível gerar um slug válido a partir do título informado.');
    }

    return new Slug(normalized);
  }

  static createFromValue(value: string): Slug {
    const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!pattern.test(value)) {
      throw new Error(`Slug inválido: "${value}". Use apenas letras minúsculas, números e hífen.`);
    }
    return new Slug(value);
  }

  toString(): string {
    return this.value;
  }
}
