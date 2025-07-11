const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dashboardController = {
  // Endpoint: /dashboard/lot-progres
  async lotProgress(req, res) {
    try {
      // Ambil parameter dari query string
      const { startDate, endDate } = req.query;

      // Debug: Log parameter yang diterima
      console.log("Received parameters:", { startDate, endDate });

      // Jika tidak ada parameter tanggal, gunakan 1 bulan kebelakang
      let dateFilter = {};

      if (startDate && endDate) {
        // Jika ada parameter tanggal, gunakan range yang diberikan
        // Pastikan endDate mencakup seluruh hari (23:59:59)
        const startDateTime = new Date(startDate);
        startDateTime.setHours(0, 0, 0, 0);

        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);

        dateFilter = {
          createdAt: {
            gte: startDateTime,
            lte: endDateTime,
          },
        };
      } else {
        // Default: 1 bulan kebelakang dari hari ini
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        dateFilter = {
          createdAt: {
            gte: oneMonthAgo,
            lte: today,
          },
        };
      }

      // Debug: Log filter yang digunakan
      console.log("Date filter:", dateFilter);
      console.log("Start date:", startDate);
      console.log("End date:", endDate);

      // Ambil semua planning_header yang tidak dihapus dengan filter tanggal
      const lots = await prisma.planning_header.findMany({
        where: {
          isDeleted: false,
          ...dateFilter,
        },
        select: {
          lotNumber: true,
          qtyPlanning: true,
          quantityCheck: true,
          quantityPrint: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      // Debug: Log hasil query
      console.log("Total lots found:", lots.length);
      console.log("Sample lots:", lots.slice(0, 3));

      // Debug: Cek semua data planning tanpa filter tanggal
      const allLots = await prisma.planning_header.findMany({
        where: {
          isDeleted: false,
        },
        select: {
          lotNumber: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
      console.log("All lots (first 5):", allLots);

      // Debug: Cek data dengan filter tanggal yang diberikan
      const filteredLots = await prisma.planning_header.findMany({
        where: {
          isDeleted: false,
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        select: {
          lotNumber: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
      console.log("Filtered lots:", filteredLots);
      console.log("Filtered lots count:", filteredLots.length);

      // Format untuk dataset sesuai dengan yang diharapkan
      const productNames = ["product", ...lots.map((lot) => lot.lotNumber)];
      const qtyPlanning = [
        "Qty Planning",
        ...lots.map((lot) => lot.qtyPlanning),
      ];
      const qtyChecked = [
        "Qty Checked",
        ...lots.map((lot) => lot.quantityCheck),
      ];
      const qtyPrinted = [
        "Qty Printed",
        ...lots.map((lot) => lot.quantityPrint),
      ];

      const dataset = [productNames, qtyPlanning, qtyChecked, qtyPrinted];

      res.json({
        status: "success",
        message: "Data progress per lot berhasil diambil",
        data: dataset,
        filter: {
          startDate: dateFilter.createdAt?.gte || null,
          endDate: dateFilter.createdAt?.lte || null,
          totalLots: lots.length,
        },
        debug: {
          receivedStartDate: startDate,
          receivedEndDate: endDate,
          allLotsCount: allLots.length,
          filteredLotsCount: filteredLots.length,
          sampleAllLots: allLots.slice(0, 3),
          sampleFilteredLots: filteredLots.slice(0, 3),
        },
      });
    } catch (error) {
      console.error("Error fetching lot progress:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data progress lot",
        error: error.message,
      });
    }
  },
};

module.exports = dashboardController;
