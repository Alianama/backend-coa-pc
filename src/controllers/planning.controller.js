const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const planningHeaderController = {
  // Create new planningHeader
  async create(req, res) {
    try {
      const data = req.body;
      // Validasi lotNumber unik
      const existingLot = await prisma.planning_header.findFirst({
        where: { lotNumber: data.lotNumber },
      });
      if (existingLot) {
        return res.status(400).json({
          status: "error",
          message: "Lot number sudah terdaftar, gunakan lot number lain!",
        });
      }
      const planning = await prisma.planning_header.create({
        data: {
          ...data,
          createdBy: req.user.id,
        },
        include: {
          creator: { select: { fullName: true } },
        },
      });
      res.status(201).json({
        status: "success",
        message: "Planning berhasil dibuat",
        data: planning,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal membuat planning",
        error: error.message,
      });
    }
  },

  // Get all planningHeader
  async getAll(req, res) {
    try {
      const { page = 1, limit = 100, search = "" } = req.query;
      const skip = (page - 1) * limit;
      const where = search
        ? {
            OR: [
              { resin: { contains: search } },
              { lotNumber: { contains: search } },
              { moulding: { contains: search } },
              { customer: { name: { contains: search } } },
              { product: { productName: { contains: search } } },
            ],
          }
        : {};
      const [plannings, total] = await Promise.all([
        prisma.planning_header.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: "desc" },
          include: {
            creator: { select: { fullName: true } },
            customer: { select: { name: true } },
            product: { select: { productName: true } },
            planningDetails: true,
          },
        }),
        prisma.planning_header.count({ where }),
      ]);
      res.json({
        status: "success",
        message: "Data planning berhasil diambil",
        data: plannings,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil data planning",
        error: error.message,
      });
    }
  },

  // Get planningHeader by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const planning = await prisma.planning_header.findUnique({
        where: { id: parseInt(id) },
        include: {
          creator: { select: { fullName: true } },
          customer: { select: { name: true } },
          product: { select: { productName: true } },
          planningDetails: true,
        },
      });
      if (!planning) {
        return res
          .status(404)
          .json({ status: "error", message: "Planning tidak ditemukan" });
      }
      res.json({
        status: "success",
        message: "Planning berhasil diambil",
        data: planning,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil planning",
        error: error.message,
      });
    }
  },

  // Update planningHeader by ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const planning = await prisma.planning_header.update({
        where: { id: parseInt(id) },
        data,
        include: { creator: { select: { fullName: true } } },
      });
      res.json({
        status: "success",
        message: "Planning berhasil diperbarui",
        data: planning,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal memperbarui planning",
        error: error.message,
      });
    }
  },

  // Delete planningHeader by ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.planning_header.delete({
        where: { id: parseInt(id) },
      });
      res.json({ status: "success", message: "Planning berhasil dihapus" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menghapus planning",
        error: error.message,
      });
    }
  },

  // CRUD PlanningDetail
  async createDetail(req, res) {
    try {
      const { idPlanning, deltaL, deltaA, deltaB, qty } = req.body;
      // Validasi planningHeader ada
      const planning = await prisma.planning_header.findUnique({
        where: { id: idPlanning },
      });
      if (!planning) {
        return res.status(404).json({
          status: "error",
          message: "Planning header tidak ditemukan",
        });
      }
      if (planning.status === "close") {
        return res.status(400).json({
          status: "error",
          message:
            "Tidak dapat menambah detail pada planning yang sudah di-close.",
        });
      }
      const details = await prisma.planning_detail.findMany({
        where: { idPlanning },
      });
      const totalQtyExisting = details.reduce(
        (sum, d) => sum + (d.qty || 0),
        0
      );
      if (totalQtyExisting + (qty || 0) > planning.qtyPlanning) {
        return res.status(400).json({
          status: "error",
          message: `Total quantity check melebihi quantity planning (${planning.qtyPlanning})!`,
        });
      }
      function hitungMagnitude(x, y, z) {
        return Math.sqrt(x * x + y * y + z * z);
      }
      let deltaE = null;
      if (
        typeof deltaL === "number" &&
        typeof deltaA === "number" &&
        typeof deltaB === "number"
      ) {
        deltaE = hitungMagnitude(deltaL, deltaA, deltaB);
      }
      // QC Judgement logic
      let qcJudgment = "Passed";
      const standards = await prisma.product_standards.findMany({
        where: { product_id: planning.idProduct },
      });
      for (const std of standards) {
        const actual = req.body[std.property_name];
        if (actual === undefined || actual === null) continue;
        if (std.operator === "PLUS_MINUS") {
          if (
            actual < std.target_value - (std.tolerance || 0) ||
            actual > std.target_value + (std.tolerance || 0)
          ) {
            qcJudgment = "NG";
            break;
          }
        } else if (std.operator === "LESS_THAN") {
          if (!(actual < std.target_value)) {
            qcJudgment = "NG";
            break;
          }
        } else if (std.operator === "LESS_EQUAL") {
          if (!(actual <= std.target_value)) {
            qcJudgment = "NG";
            break;
          }
        } else if (std.operator === "GREATER_THAN") {
          if (!(actual > std.target_value)) {
            qcJudgment = "NG";
            break;
          }
        } else if (std.operator === "GREATER_EQUAL") {
          if (!(actual >= std.target_value)) {
            qcJudgment = "NG";
            break;
          }
        }
      }
      const detail = await prisma.planning_detail.create({
        data: {
          ...req.body,
          deltaE,
          qcJudgment,
          createdBy: req.user.id,
        },
        include: {
          creator: { select: { fullName: true } },
        },
      });
      await prisma.planning_header.update({
        where: { id: idPlanning },
        data: { status: "progress" },
      });
      res.status(201).json({
        status: "success",
        message: "Detail berhasil dibuat",
        data: detail,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal membuat detail",
        error: error.message,
      });
    }
  },
  async getDetailsByPlanningId(req, res) {
    try {
      const { idPlanning } = req.params;
      const details = await prisma.planning_detail.findMany({
        where: { idPlanning: parseInt(idPlanning) },
        include: { creator: { select: { fullName: true } } },
      });
      // Ambil standar produk
      const planning = await prisma.planning_header.findUnique({
        where: { id: parseInt(idPlanning) },
      });
      const standards = await prisma.product_standards.findMany({
        where: { product_id: planning.idProduct },
      });
      // Tambahkan qcDetail di setiap detail
      const detailsWithQC = details.map((detail) => {
        const qcDetail = standards.map((std) => {
          const actual = detail[std.property_name];
          let result = null;
          if (actual === undefined || actual === null) {
            result = null;
          } else if (std.operator === "PLUS_MINUS") {
            result =
              actual >= std.target_value - (std.tolerance || 0) &&
              actual <= std.target_value + (std.tolerance || 0)
                ? "Passed"
                : "NG";
          } else if (std.operator === "LESS_THAN") {
            result = actual < std.target_value ? "Passed" : "NG";
          } else if (std.operator === "LESS_EQUAL") {
            result = actual <= std.target_value ? "Passed" : "NG";
          }
          return {
            property_name: std.property_name,
            actual,
            target_value: std.target_value,
            tolerance: std.tolerance,
            operator: std.operator,
            unit: std.unit,
            result,
          };
        });
        return { ...detail, qcDetail };
      });
      // Hitung total qty
      const totalQtyCheck = detailsWithQC.reduce(
        (sum, d) => sum + (d.qty || 0),
        0
      );
      res.json({ status: "success", totalQtyCheck, data: detailsWithQC });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil detail",
        error: error.message,
      });
    }
  },
  async getDetailsByLotNumber(req, res) {
    try {
      const { lotNumber } = req.params;
      const planning = await prisma.planning_header.findFirst({
        where: { lotNumber },
        include: {
          customer: { select: { name: true } },
          product: { select: { productName: true } },
        },
      });
      if (!planning) {
        return res.status(404).json({
          status: "error",
          message: "Planning header tidak ditemukan",
        });
      }
      const details = await prisma.planning_detail.findMany({
        where: { idPlanning: planning.id },
        include: { creator: { select: { fullName: true } } },
      });
      const standards = await prisma.product_standards.findMany({
        where: { product_id: planning.idProduct },
      });
      const detailsWithQC = details.map((detail) => {
        const qcDetail = standards.map((std) => {
          const actual = detail[std.property_name];
          let result = null;
          if (actual === undefined || actual === null) {
            result = null;
          } else if (std.operator === "PLUS_MINUS") {
            result =
              actual >= std.target_value - (std.tolerance || 0) &&
              actual <= std.target_value + (std.tolerance || 0)
                ? "Passed"
                : "NG";
          } else if (std.operator === "LESS_THAN") {
            result = actual < std.target_value ? "Passed" : "NG";
          } else if (std.operator === "LESS_EQUAL") {
            result = actual <= std.target_value ? "Passed" : "NG";
          }
          return {
            property_name: std.property_name,
            actual,
            target_value: std.target_value,
            tolerance: std.tolerance,
            operator: std.operator,
            unit: std.unit,
            result,
          };
        });
        return { ...detail, qcDetail };
      });
      // Hitung total qty
      const totalQtyCheck = detailsWithQC.reduce(
        (sum, d) => sum + (d.qty || 0),
        0
      );
      // Susun header sesuai permintaan
      const header = {
        id: planning.id,
        idCustomer: planning.idCustomer,
        idProduct: planning.idProduct,
        resin: planning.resin,
        ratio: planning.ratio,
        moulding: planning.moulding,
        lotNumber: planning.lotNumber,
        qtyPlanning: planning.qtyPlanning,
        mfgDate: planning.mfgDate,
        expiryDate: planning.expiryDate,
        status: planning.status,
        createdBy: planning.createdBy,
        createdAt: planning.createdAt,
        customerName: planning.customer ? planning.customer.name : null,
        productName: planning.product ? planning.product.productName : null,
      };
      res.json({
        status: "success",
        totalQtyCheck,
        header,
        data: detailsWithQC,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil detail",
        error: error.message,
      });
    }
  },
  async updateDetail(req, res) {
    try {
      const { id } = req.params;
      const { ...updateData } = req.body;

      if (updateData.analysisDate) {
        updateData.analysisDate = new Date(
          updateData.analysisDate
        ).toISOString();
      }

      // Ambil detail dan planning terkait
      const detailOld = await prisma.planning_detail.findUnique({
        where: { id: parseInt(id) },
      });
      const planning = await prisma.planning_header.findUnique({
        where: { id: detailOld.idPlanning },
      });

      // Gabungkan data lama dengan data update untuk evaluasi QC
      const mergedData = { ...detailOld, ...updateData };

      // QC Judgement logic
      let qcJudgment = "Passed";
      const standards = await prisma.product_standards.findMany({
        where: { product_id: planning.idProduct },
      });
      for (const std of standards) {
        const actual = mergedData[std.property_name];
        if (actual === undefined || actual === null) continue;
        if (std.operator === "PLUS_MINUS") {
          if (
            actual < std.target_value - (std.tolerance || 0) ||
            actual > std.target_value + (std.tolerance || 0)
          ) {
            qcJudgment = "NG";
            break;
          }
        } else if (std.operator === "LESS_THAN") {
          if (!(actual < std.target_value)) {
            qcJudgment = "NG";
            break;
          }
        } else if (std.operator === "LESS_EQUAL") {
          if (!(actual <= std.target_value)) {
            qcJudgment = "NG";
            break;
          }
        } else if (std.operator === "GREATER_THAN") {
          if (!(actual > std.target_value)) {
            qcJudgment = "NG";
            break;
          }
        } else if (std.operator === "GREATER_EQUAL") {
          if (!(actual >= std.target_value)) {
            qcJudgment = "NG";
            break;
          }
        }
      }
      const detail = await prisma.planning_detail.update({
        where: { id: parseInt(id) },
        data: { ...mergedData, qcJudgment },
        include: { creator: { select: { fullName: true } } },
      });
      res.json({
        status: "success",
        message: "Detail berhasil diperbarui",
        data: detail,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal memperbarui detail",
        error: error.message,
      });
    }
  },
  async deleteDetail(req, res) {
    try {
      const { id } = req.params;
      const detailToDelete = await prisma.planning_detail.findUnique({
        where: { id: parseInt(id) },
        include: {
          planningHeader: true,
        },
      });
      if (!detailToDelete) {
        return res
          .status(404)
          .json({ status: "error", message: "Detail tidak ditemukan" });
      }
      if (detailToDelete.planningHeader.status === "close") {
        return res.status(400).json({
          status: "error",
          message:
            "Tidak dapat menghapus detail pada planning yang sudah di-close.",
        });
      }
      const { idPlanning } = detailToDelete;
      await prisma.planning_detail.delete({ where: { id: parseInt(id) } });
      const remainingDetails = await prisma.planning_detail.count({
        where: { idPlanning },
      });
      if (remainingDetails === 0) {
        await prisma.planning_header.update({
          where: { id: idPlanning },
          data: { status: "open" },
        });
      }
      res.json({ status: "success", message: "Detail berhasil dihapus" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menghapus detail",
        error: error.message,
      });
    }
  },
  async closePlanning(req, res) {
    try {
      const { id } = req.params;
      const planning = await prisma.planning_header.update({
        where: { id: parseInt(id) },
        data: { status: "close" },
      });
      res.json({
        status: "success",
        message: "Planning berhasil di-close",
        data: planning,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal close planning",
        error: error.message,
      });
    }
  },
  async reopenPlanning(req, res) {
    try {
      const { id } = req.params;
      const planningToReopen = await prisma.planning_header.findUnique({
        where: { id: parseInt(id) },
        include: {
          planningDetails: {
            take: 1, // Cukup ambil 1 untuk cek
          },
        },
      });
      if (!planningToReopen) {
        return res
          .status(404)
          .json({ status: "error", message: "Planning tidak ditemukan" });
      }
      const newStatus =
        planningToReopen.planningDetails.length > 0 ? "progress" : "open";
      const planning = await prisma.planning_header.update({
        where: { id: parseInt(id) },
        data: { status: newStatus },
      });
      res.json({
        status: "success",
        message: `Planning berhasil di-reopen dengan status ${newStatus}`,
        data: planning,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal reopen planning",
        error: error.message,
      });
    }
  },
};

module.exports = planningHeaderController;
