import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@recoop.com.br').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'troque-esta-senha-123';
  const adminName = process.env.ADMIN_NAME ?? 'Recoop Admin';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: adminName, email: adminEmail, passwordHash },
  });
  console.log(`Usuário admin pronto: ${adminEmail}`);

  const seedNews = [
    {
      title: 'Sicoob espera liberar até R$ 49 bi de crédito rural na safra 2023/24',
      tag: 'Crédito rural',
      excerpt: 'Expectativa de forte crescimento na oferta de crédito rural em diversas linhas.',
      content:
        'O Sicoob espera liberar na safra 2023/24 cerca de R$ 49 bilhões em crédito rural por meio de diversas linhas, valor que representa aumento expressivo em relação à safra anterior, quando concedeu financiamentos para pequenos e médios produtores em todo o país.',
    },
    {
      title: 'Cooperativas de crédito operam em mais da metade dos municípios',
      tag: 'Cooperativismo',
      excerpt: 'O cooperativismo de crédito cresceu acima do restante do Sistema Financeiro Nacional.',
      content:
        'De forma sustentável e com bases sólidas, as cooperativas de crédito cresceram mais do que o restante do Sistema Financeiro Nacional (SFN) em ativos, carteiras de crédito e capilaridade, estando presentes hoje em mais da metade dos municípios brasileiros.',
    },
    {
      title: 'A due diligence ESG',
      tag: 'ESG',
      excerpt: 'Integridade empresarial e agenda ESG ganharam protagonismo nos negócios.',
      content:
        'Nos últimos anos, a integridade empresarial e a agenda ESG se tornaram palavras de ordem no mundo dos negócios. A due diligence ESG passou a ser parte central da avaliação de risco em operações de crédito e recuperação de valores.',
    },
  ];

  for (const item of seedNews) {
    const slug = slugify(item.title);
    await prisma.news.upsert({
      where: { slug },
      update: {},
      create: {
        title: item.title,
        slug,
        tag: item.tag,
        excerpt: item.excerpt,
        content: item.content,
        published: true,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`${seedNews.length} notícias de exemplo garantidas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
