const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const operatorMap = {
  "±": "PLUS_MINUS",
  "<": "LESS_THAN",
  "≤": "LESS_EQUAL",
  ">": "GREATER_THAN",
  "≥": "GREATER_EQUAL",
};

async function main() {
  const csvPath = path.join(
    __dirname,
    "../src/migration-data/product-standard.csv"
  );
  const csv = fs.readFileSync(csvPath, "utf-8");
  const lines = csv.split(/\r?\n/).filter(Boolean);
  let currentProductName = null;
  let currentProductId = null;

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(";").map((cell) => cell.trim());
    if (row.length < 2) continue;
    let [product_name, property_name, target_value, tolerance, operator, unit] =
      row;
    if (product_name) {
      // lookup product_id
      const product = await prisma.master_product.findFirst({
        where: { productName: product_name },
      });
      if (!product) {
        console.warn("Product not found:", product_name);
        currentProductName = null;
        currentProductId = null;
        continue;
      }
      currentProductName = product_name;
      currentProductId = product.id;
    }
    if (!currentProductId || !property_name) continue;
    // Cek jika sudah ada
    const exist = await prisma.product_standards.findFirst({
      where: { product_id: currentProductId, property_name },
    });
    if (exist) continue;
    // Parsing value
    let targetVal = null;
    if (target_value && !isNaN(target_value.replace(/,/g, "."))) {
      targetVal = parseFloat(target_value.replace(/,/g, "."));
    }
    let tolVal = null;
    if (tolerance && !isNaN(tolerance.replace(/,/g, "."))) {
      tolVal = parseFloat(tolerance.replace(/,/g, "."));
    }
    let op = operatorMap[operator] || operator || "PLUS_MINUS";
    await prisma.product_standards.create({
      data: {
        product_id: currentProductId,
        property_name,
        target_value: targetVal !== null ? targetVal : 0,
        tolerance: tolVal,
        operator: op,
        unit: unit || "",
      },
    });
    console.log(`Inserted: ${currentProductName} - ${property_name}`);
  }
  console.log("Selesai migrasi product_standards dari CSV.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
