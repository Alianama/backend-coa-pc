const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const planningHeaderController = {
  // Create new planningHeader
  async create(req, res) {
    try {
      const data = req.body;
      // Validasi lotNumber unik
      const existingLot = await prisma.planningHeader.findFirst({
        where: { lotNumber: data.lotNumber },
      });
      if (existingLot) {
        return res.status(400).json({
          status: "error",
          message: "Lot number sudah terdaftar, gunakan lot number lain!",
        });
      }
      const planning = await prisma.planningHeader.create({
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
        prisma.planningHeader.findMany({
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
        prisma.planningHeader.count({ where }),
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
      const planning = await prisma.planningHeader.findUnique({
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
      const planning = await prisma.planningHeader.update({
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
      await prisma.planningHeader.delete({
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
      const planning = await prisma.planningHeader.findUnique({
        where: { id: idPlanning },
      });
      if (!planning) {
        return res.status(404).json({
          status: "error",
          message: "Planning header tidak ditemukan",
        });
      }
      // Validasi jika planning sudah di-close
      if (planning.status === "close") {
        return res.status(400).json({
          status: "error",
          message:
            "Tidak dapat menambah detail pada planning yang sudah di-close.",
        });
      }
      // Ambil semua detail untuk planning ini
      const details = await prisma.planningDetail.findMany({
        where: { idPlanning },
      });
      // Hitung total qty existing
      const totalQtyExisting = details.reduce(
        (sum, d) => sum + (d.qty || 0),
        0
      );
      // Validasi qty baru tidak melebihi qtyPlanning
      if (totalQtyExisting + (qty || 0) > planning.qtyPlanning) {
        return res.status(400).json({
          status: "error",
          message: `Total quantity check melebihi quantity planning (${planning.qtyPlanning})!`,
        });
      }
      // Fungsi hitungMagnitude
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
      const detail = await prisma.planningDetail.create({
        data: {
          ...req.body,
          deltaE,
          createdBy: req.user.id,
        },
        include: {
          creator: { select: { fullName: true } },
        },
      });
      // Update status planning header menjadi PROGRESS
      await prisma.planningHeader.update({
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
      const details = await prisma.planningDetail.findMany({
        where: { idPlanning: parseInt(idPlanning) },
        include: { creator: { select: { fullName: true } } },
      });
      // Hitung total qty
      const totalQtyCheck = details.reduce((sum, d) => sum + (d.qty || 0), 0);
      res.json({ status: "success", totalQtyCheck, data: details });
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
      const planning = await prisma.planningHeader.findFirst({
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
      const details = await prisma.planningDetail.findMany({
        where: { idPlanning: planning.id },
        include: { creator: { select: { fullName: true } } },
      });
      // Hitung total qty
      const totalQtyCheck = details.reduce((sum, d) => sum + (d.qty || 0), 0);
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
        data: details,
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
      // Jangan update createdBy dan createdAt
      const { ...updateData } = req.body;
      const detail = await prisma.planningDetail.update({
        where: { id: parseInt(id) },
        data: updateData,
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
      const detailToDelete = await prisma.planningDetail.findUnique({
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
      await prisma.planningDetail.delete({ where: { id: parseInt(id) } });
      const remainingDetails = await prisma.planningDetail.count({
        where: { idPlanning },
      });
      if (remainingDetails === 0) {
        await prisma.planningHeader.update({
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
      const planning = await prisma.planningHeader.update({
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
      const planningToReopen = await prisma.planningHeader.findUnique({
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
      const planning = await prisma.planningHeader.update({
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
