const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const csvPath = path.join(
    __dirname,
    "../src/migration-data/master prodcut.csv"
  );
  const csv = fs.readFileSync(csvPath, "utf-8");
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(";").map((h) => h.trim());

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(";").map((cell) => cell.trim());
    if (row.length < 4) continue;
    const [product_name, resin, let_down_ratio, expired_age] = row;
    if (!product_name) continue;
    // Cek apakah sudah ada
    const exist = await prisma.master_product.findFirst({
      where: { productName: product_name },
    });
    if (exist) continue;
    await prisma.master_product.create({
      data: {
        productName: product_name,
        resin: resin || null,
        letDownRatio: let_down_ratio || null,
        expiredAge: expired_age
          ? parseFloat(expired_age.replace(/[^\d.]/g, ""))
          : null,
        status: "draft",
        createdBy: 1, // default admin, sesuaikan jika perlu
      },
    });
    console.log("Inserted:", product_name);
  }
  console.log("Selesai migrasi master_product dari CSV.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
