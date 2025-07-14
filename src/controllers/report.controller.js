const { PrismaClient } = require("@prisma/client");
const ExcelJS = require("exceljs");
const prisma = new PrismaClient();

const reportController = {
  // Endpoint: /report/excel
  async exportReportExcel(req, res) {
    try {
      const { month, year, startDate, endDate } = req.query;
      let start, end;
      if (startDate && endDate) {
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
      } else {
        const now = new Date();
        const selectedYear = parseInt(year) || now.getFullYear();
        const selectedMonth =
          typeof month !== "undefined" ? parseInt(month) : now.getMonth() + 1;
        start = new Date(selectedYear, selectedMonth - 1, 1, 0, 0, 0, 0);
        end = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);
      }

      // Ambil data planning_header dan relasi
      const plannings = await prisma.planning_header.findMany({
        where: {
          isDeleted: false,
          mfgDate: {
            gte: start,
            lte: end,
          },
        },
        include: {
          customer: true,
          product: true,
        },
        orderBy: { createdAt: "asc" },
      });

      // Ambil data print_coa untuk setiap planning
      const planningIds = plannings.map((p) => p.id);
      const printCoas = await prisma.print_coa.findMany({
        where: {
          isDeleted: false,
          planningId: {
            in: planningIds,
          },
        },
        select: {
          planningId: true,
          quantity: true,
          shippedToCustomerId: true,
        },
      });

      // Group print_coa by planningId
      const printCoaMap = new Map();
      printCoas.forEach((pc) => {
        if (!printCoaMap.has(pc.planningId)) {
          printCoaMap.set(pc.planningId, []);
        }
        printCoaMap.get(pc.planningId).push(pc);
      });

      // Siapkan workbook Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");
      worksheet.columns = [
        { header: "No", key: "no", width: 5 },
        { header: "Posting Date", key: "postingDate", width: 15 },
        { header: "Product Name", key: "productName", width: 20 },
        { header: "Lot No", key: "lotNo", width: 15 },
        {
          header: "Customer Name / Shipped to",
          key: "customerName",
          width: 25,
        },
        { header: "Planning Qty (Kg)", key: "planningQty", width: 15 },
        { header: "Printed Qty (Kg)", key: "printedQty", width: 15 },
        { header: "Actual Yield Rate (%)", key: "yieldRate", width: 20 },
      ];

      // Isi data
      for (let idx = 0; idx < plannings.length; idx++) {
        const plan = plannings[idx];
        const planPrintCoas = printCoaMap.get(plan.id) || [];
        const printedQty = planPrintCoas.reduce(
          (sum, p) => sum + (p.quantity || 0),
          0
        );

        let shippedTo = plan.customer?.name || "";
        if (planPrintCoas.length > 0 && planPrintCoas[0].shippedToCustomerId) {
          shippedTo = planPrintCoas[0].shippedToCustomerId;
        }
        const yieldRate =
          plan.qtyPlanning > 0
            ? ((printedQty / plan.qtyPlanning) * 100).toFixed(2)
            : "0.00";

        // Format tanggal dengan timezone Indonesia (UTC+7)
        const mfgDate = new Date(plan.mfgDate);
        const indonesiaDate = new Date(mfgDate.getTime() + 7 * 60 * 60 * 1000); // UTC+7
        const formattedDate = indonesiaDate.toISOString().split("T")[0];

        worksheet.addRow({
          no: idx + 1,
          postingDate: formattedDate,
          productName: plan.product?.productName || "",
          lotNo: plan.lotNumber,
          customerName: shippedTo,
          planningQty: plan.qtyPlanning,
          printedQty: printedQty,
          yieldRate: yieldRate,
        });
      }

      // Simpan log ke DB (tanpa filePath)
      const fileName = `report_${req.user.id}_${Date.now()}.xlsx`;
      await prisma.report_log.create({
        data: {
          userId: req.user.id,
          username: req.user.username,
          fileName,
          filePath: "", // tidak digunakan
          startDate: start,
          endDate: end,
        },
      });

      // Kirim file ke user
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal generate report excel",
        error: error.message,
      });
    }
  },

  // Endpoint: /report/history
  async getReportHistory(req, res) {
    try {
      const logs = await prisma.report_log.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
      });
      res.json({ status: "success", data: logs });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // Endpoint: /report/download/:id
  async downloadReportById(req, res) {
    try {
      const { id } = req.params;
      const log = await prisma.report_log.findUnique({
        where: { id: parseInt(id) },
      });
      if (!log)
        return res.status(404).json({ status: "error", message: "Not found" });
      if (log.userId !== req.user.id)
        return res.status(403).json({ status: "error", message: "Forbidden" });

      // Generate ulang file Excel dari parameter log
      const start = log.startDate;
      const end = log.endDate;

      const plannings = await prisma.planning_header.findMany({
        where: {
          isDeleted: false,
          mfgDate: {
            gte: start,
            lte: end,
          },
        },
        include: {
          customer: true,
          product: true,
        },
        orderBy: { createdAt: "asc" },
      });

      // Ambil data print_coa untuk setiap planning
      const planningIds = plannings.map((p) => p.id);
      const printCoas = await prisma.print_coa.findMany({
        where: {
          isDeleted: false,
          planningId: {
            in: planningIds,
          },
        },
        select: {
          planningId: true,
          quantity: true,
          shippedToCustomerId: true,
        },
      });

      // Group print_coa by planningId
      const printCoaMap = new Map();
      printCoas.forEach((pc) => {
        if (!printCoaMap.has(pc.planningId)) {
          printCoaMap.set(pc.planningId, []);
        }
        printCoaMap.get(pc.planningId).push(pc);
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");
      worksheet.columns = [
        { header: "No", key: "no", width: 5 },
        { header: "Posting Date", key: "postingDate", width: 15 },
        { header: "Product Name", key: "productName", width: 20 },
        { header: "Lot No", key: "lotNo", width: 15 },
        {
          header: "Customer Name / Shipped to",
          key: "customerName",
          width: 25,
        },
        { header: "Planning Qty", key: "planningQty", width: 15 },
        { header: "Printed Qty", key: "printedQty", width: 15 },
        { header: "Actual Yield Rate (%)", key: "yieldRate", width: 20 },
      ];

      for (let idx = 0; idx < plannings.length; idx++) {
        const plan = plannings[idx];
        const planPrintCoas = printCoaMap.get(plan.id) || [];

        const printedQty = planPrintCoas.reduce(
          (sum, p) => sum + (p.quantity || 0),
          0
        );

        let shippedTo = plan.customer?.name || "";
        if (planPrintCoas.length > 0 && planPrintCoas[0].shippedToCustomerId) {
          shippedTo = planPrintCoas[0].shippedToCustomerId;
        }

        const yieldRate =
          plan.qtyPlanning > 0
            ? ((printedQty / plan.qtyPlanning) * 100).toFixed(2)
            : "0.00";

        // Format tanggal dengan timezone Indonesia (UTC+7)
        const mfgDate = new Date(plan.mfgDate);
        const indonesiaDate = new Date(mfgDate.getTime() + 7 * 60 * 60 * 1000); // UTC+7
        const formattedDate = indonesiaDate.toISOString().split("T")[0];

        worksheet.addRow({
          no: idx + 1,
          postingDate: formattedDate,
          productName: plan.product?.productName || "",
          lotNo: plan.lotNumber,
          customerName: shippedTo,
          planningQty: plan.qtyPlanning,
          printedQty: printedQty,
          yieldRate: yieldRate,
        });
      }

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${log.fileName}`
      );
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};

module.exports = reportController;
