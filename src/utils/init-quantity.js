const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper function untuk mengupdate quantityPrint
async function updateQuantityPrint(planningId) {
  const printedCoas = await prisma.print_coa.findMany({
    where: { planningId: parseInt(planningId) },
    select: { quantity: true },
  });
  const totalQuantityPrint = printedCoas.reduce(
    (sum, printCoa) => sum + (printCoa.quantity || 0),
    0
  );

  await prisma.planning_header.update({
    where: { id: parseInt(planningId) },
    data: { quantityPrint: totalQuantityPrint },
  });
}

// Helper function untuk mengupdate quantityCheck
async function updateQuantityCheck(planningId) {
  const planningDetails = await prisma.planning_detail.findMany({
    where: { idPlanning: parseInt(planningId) },
    select: { qty: true },
  });
  const totalQuantityCheck = planningDetails.reduce(
    (sum, detail) => sum + (detail.qty || 0),
    0
  );

  await prisma.planning_header.update({
    where: { id: parseInt(planningId) },
    data: { quantityCheck: totalQuantityCheck },
  });
}

async function initializeQuantities() {
  try {
    console.log("Memulai inisialisasi quantityPrint dan quantityCheck...");

    // Ambil semua planning headers
    const planningHeaders = await prisma.planning_header.findMany({
      select: { id: true },
    });

    console.log(`Ditemukan ${planningHeaders.length} planning headers`);

    // Update quantityPrint dan quantityCheck untuk setiap planning
    for (const planning of planningHeaders) {
      await updateQuantityPrint(planning.id);
      await updateQuantityCheck(planning.id);
      console.log(`Berhasil update planning ID: ${planning.id}`);
    }

    console.log("Inisialisasi selesai!");
  } catch (error) {
    console.error("Error during initialization:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan script jika file ini dijalankan langsung
if (require.main === module) {
  initializeQuantities();
}

module.exports = {
  updateQuantityPrint,
  updateQuantityCheck,
  initializeQuantities,
};
