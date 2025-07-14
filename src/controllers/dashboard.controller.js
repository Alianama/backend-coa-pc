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

  // Endpoint: /dashboard/log-history
  async getLogHistory(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        action,
        table,
        userId,
        startDate,
        endDate,
        search,
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build where clause
      const where = {};

      // Filter by action
      if (action && ["CREATE", "UPDATE", "DELETE"].includes(action)) {
        where.action = action;
      }

      // Filter by table
      if (table) {
        where.description = {
          contains: `pada tabel ${table}`,
        };
      }

      // Filter by user ID
      if (userId) {
        where.userId = parseInt(userId);
      }

      // Filter by date range
      if (startDate && endDate) {
        const startDateTime = new Date(startDate);
        startDateTime.setHours(0, 0, 0, 0);
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);

        where.createdAt = {
          gte: startDateTime,
          lte: endDateTime,
        };
      }

      // Search in description
      if (search) {
        where.description = {
          contains: search,
        };
      }

      // Get logs with user information
      const [logs, total] = await Promise.all([
        prisma.log.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
              },
            },
          },
        }),
        prisma.log.count({ where }),
      ]);

      // Format the response
      const formattedLogs = logs.map((log) => ({
        id: log.id,
        action: log.action,
        description: log.description,
        table: extractTableFromDescription(log.description),
        recordId: extractRecordIdFromDescription(log.description),
        user: {
          id: log.user.id,
          username: log.user.username,
          fullName: log.user.fullName,
        },
        createdAt: log.createdAt,
        // Extract additional info from description
        additionalInfo: extractAdditionalInfo(log.description),
      }));

      res.json({
        status: "success",
        message: "Log history berhasil diambil",
        data: formattedLogs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("Error getting log history:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil log history",
        error: error.message,
      });
    }
  },

  // Endpoint: /dashboard/summary
  async getDashboardSummary(req, res) {
    try {
      // Hitung range 1 bulan terakhir
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      oneMonthAgo.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      // Total planning 1 bulan terakhir
      const totalPlanning = await prisma.planning_header.count({
        where: {
          isDeleted: false,
          createdAt: {
            gte: oneMonthAgo,
            lte: today,
          },
        },
      });

      // Total print COA 1 bulan terakhir
      const totalCoaPrinted = await prisma.print_coa.count({
        where: {
          isDeleted: false,
          createdAt: {
            gte: oneMonthAgo,
            lte: today,
          },
        },
      });

      // Total planning closed 1 bulan terakhir
      const totalPlanningClosed = await prisma.planning_header.count({
        where: {
          isDeleted: false,
          status: "close",
          createdAt: {
            gte: oneMonthAgo,
            lte: today,
          },
        },
      });

      res.json({
        status: "success",
        message: "Dashboard summary berhasil diambil",
        data: {
          totalPlanning,
          totalCoaPrinted,
          totalPlanningClosed,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil dashboard summary",
        error: error.message,
      });
    }
  },
};

// Helper functions
function extractTableFromDescription(description) {
  const match = description.match(/pada tabel (\w+)/);
  return match ? match[1] : null;
}

function extractRecordIdFromDescription(description) {
  const match = description.match(/dengan ID (\d+)/);
  return match ? parseInt(match[1]) : null;
}

function extractAdditionalInfo(description) {
  // Extract data information if available
  const dataMatch = description.match(/\| Data: (.+)$/);
  const oldDataMatch = description.match(/\| Data lama: (.+?) \| Data baru:/);
  const newDataMatch = description.match(/\| Data baru: (.+)$/);

  if (dataMatch) {
    try {
      return { data: JSON.parse(dataMatch[1]) };
    } catch (e) {
      console.error(e);
      return { data: dataMatch[1] };
    }
  }

  if (oldDataMatch && newDataMatch) {
    try {
      return {
        oldData: JSON.parse(oldDataMatch[1]),
        newData: JSON.parse(newDataMatch[1]),
      };
    } catch (e) {
      console.error(e);
      return {
        oldData: oldDataMatch[1],
        newData: newDataMatch[1],
      };
    }
  }

  return null;
}

module.exports = dashboardController;
