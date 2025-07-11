const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dashboardController = {
  // Endpoint: /dashboard/lot-progres
  async lotProgress(req, res) {
    try {
      const { startDate, endDate } = req.query;

      let dateFilter = {};

      if (startDate && endDate) {
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
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data progress lot",
        data: error,
      });
    }
  },
  // Endpoint: /dashboard/total-planning
  async totalPlanning(req, res) {
    try {
      const { startDate, endDate } = req.query;
      let dateFilter = {};
      if (startDate && endDate) {
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
      const total = await prisma.planning_header.count({
        where: {
          isDeleted: false,
          ...dateFilter,
        },
      });
      res.json({
        status: "success",
        message: "Total planning berhasil diambil",
        data: total,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil total planning",
        data: error,
      });
    }
  },
  // Endpoint: /dashboard/total-planning-perbulan
  async totalPlanningPerBulan(req, res) {
    try {
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const result = [];
      for (let month = 0; month < 12; month++) {
        const start = new Date(year, month, 1, 0, 0, 0, 0);
        const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
        const total = await prisma.planning_header.count({
          where: {
            isDeleted: false,
            createdAt: {
              gte: start,
              lte: end,
            },
          },
        });
        result.push({ month: month + 1, total });
      }
      res.json({
        status: "success",
        message: "Total planning per bulan berhasil diambil",
        data: {
          year,
          result,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil total planning per bulan",
        data: error,
      });
    }
  },
};

module.exports = dashboardController;
