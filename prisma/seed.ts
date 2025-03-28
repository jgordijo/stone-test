import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.products.createMany({
    data: [
      {
        name: 'Picolé',
      },
      {
        name: 'Ração Canina Filhotes 2kg',
      },
      {
        name: 'Ração Canina Adulto 7.5kg',
      },
      {
        name: 'Tapete Higiênico - 30 unidades',
      },
      {
        name: 'Sorvete Cone',
      },
      {
        name: 'Sorvete de Pote - 2L',
      },
      {
        name: 'Shampoo Anti-Caspa',
      },
      {
        name: 'Biscoito recheado',
      },
      {
        name: 'Biscoito canino',
      },
      {
        name: 'Barra de chocolate',
      },
      {
        name: 'Ovo de Páscoa 1kg',
      },
      {
        name: 'Ovo de Páscoa 500grs',
      },
    ],
  });

  console.log('Seeding complete!');
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
