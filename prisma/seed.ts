const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function seed() {
  const customerCount = 50;

  // Generate random customer data
  const customers = [...Array(customerCount)].map(() => ({
    customer_code: uuidv4(),
    name: `Customer ${Math.floor(Math.random() * 10000) + 1}`,
  }));

  // Create customers
  for (const customer of customers) {
    await prisma.customer.create({
      data: {
        ...customer,
      },
    });
  }

  console.log(`${customerCount} customers seeded successfully!`);
}

seed()
  .catch((e) => {
    console.error("Seeding failed!", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
