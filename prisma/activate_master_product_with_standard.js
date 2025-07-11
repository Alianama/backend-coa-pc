const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Ambil semua product_id yang punya standard
  const ids = await prisma.product_standards.findMany({
    select: { product_id: true },
    distinct: ["product_id"],
  });
  const idList = ids.map((i) => i.product_id);
  if (idList.length) {
    const result = await prisma.master_product.updateMany({
      where: { id: { in: idList } },
      data: { status: "active" },
    });
    console.log("Updated", result.count, "master_product to active");
  } else {
    console.log("No product to update");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
