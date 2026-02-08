import "dotenv/config";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  await prisma.food.deleteMany();

  await prisma.food.createMany({
    data: [
      {
        name: "Bruschetta",
        description: "Pão italiano tostado com tomate, manjericão e azeite",
        price: 18.9,
        category: "entrada",
      },
      {
        name: "Filé Mignon ao Molho Madeira",
        description: "Filé mignon grelhado com molho madeira e arroz",
        price: 59.9,
        category: "prato principal",
      },
      {
        name: "Salmão Grelhado",
        description: "Salmão grelhado com legumes e purê de batata",
        price: 65.0,
        category: "prato principal",
      },
      {
        name: "Petit Gâteau",
        description:
          "Bolo de chocolate com recheio cremoso e sorvete de baunilha",
        price: 28.5,
        category: "sobremesa",
      },
      {
        name: "Suco de Laranja Natural",
        description: "Suco de laranja espremido na hora, 500ml",
        price: 12.0,
        category: "bebida",
      },
    ],
  });

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
