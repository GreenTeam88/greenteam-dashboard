import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      steps: {
        include: {
          questions: true,
        },
      },
    },
  });

  console.log('Total products in database:', products.length);
  console.log('');

  for (const p of products) {
    const questionCount = p.steps.reduce((acc, s) => acc + s.questions.length, 0);
    console.log(`- ${p.name} (${p.slug})`);
    console.log(`  Status: ${p.status}`);
    console.log(`  Steps: ${p.steps.length}, Questions: ${questionCount}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
