const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const printCoaController = {
  // Print COA
  async print(req, res) {
    try {
      const { coaId } = req.params;
      const { quantity } = req.body;

      // Cari COA yang akan di-print
      const coa = await prisma.master_coa.findUnique({
        where: { id: parseInt(coaId) },
        include: {
          customer: {
            include: {
              mandatoryFields: true,
            },
          },
          product: true,
        },
      });

      if (!coa) {
        return res.status(404).json({
          status: "error",
          message: "COA tidak ditemukan",
        });
      }

      // Cek apakah COA sudah diapprove
      if (coa.status !== "approved" && coa.status !== "printed") {
        return res.status(400).json({
          status: "error",
          message: "COA harus diapprove terlebih dahulu sebelum di-print",
        });
      }

      // Ambil data user yang sedang login
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { username: true },
      });
      const updatedQuantity = coa.quantity + quantity;
      // Buat data untuk print_coa
      const printData = {
        costumerName: coa.costumerName,
        productId: coa.productId,
        quantity: quantity,
        productName: coa.productName,
        lotNumber: coa.lotNumber,
        printedBy: req.user.id,
        printedDate: new Date(),
        issueBy: currentUser.username,
        approvedBy: coa.approvedBy,
        approvedDate: coa.approvedDate,
      };

      // Tambahkan field-field wajib dari customer
      if (coa.customer && coa.customer.mandatoryFields) {
        for (const field of coa.customer.mandatoryFields) {
          const fieldName = field.fieldName;
          if (coa[fieldName] !== undefined) {
            printData[fieldName] = coa[fieldName];
          }
        }
      }

      // Buat record print_coa baru
      const printedCoa = await prisma.print_coa.create({
        data: printData,
        include: {
          creator: {
            select: { username: true },
          },
        },
      });

      // Update status COA menjadi printed

      await prisma.master_coa.update({
        where: { id: parseInt(coaId) },
        data: {
          status: "printed",
          quantity: updatedQuantity,
          printedDate: new Date(),
        },
      });

      res.status(201).json({
        status: "success",
        message: "COA berhasil di-print",
        data: printedCoa,
      });
    } catch (error) {
      console.error("Error printing COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat print COA",
        error: error.message,
      });
    }
  },

  // Get all printed COAs
  async getAll(req, res) {
    try {
      const { page = 1, limit = 100, search = "" } = req.query;
      const skip = (page - 1) * limit;

      // Filter hanya data yang memiliki nilai
      const where = {
        AND: [
          {
            OR: [
              { costumerName: { contains: search } },
              { productName: { contains: search } },
              { lotNumber: { contains: search } },
              { issueBy: { contains: search } },
            ],
          },
          {
            OR: [
              { quantity: { not: null } },
              { pelletLength: { not: null } },
              { pelletHeight: { not: null } },
              { pelletVisual: { not: null } },
              { color: { not: null } },
              { dispersibility: { not: null } },
              { mfr: { not: null } },
              { density: { not: null } },
              { moisture: { not: null } },
              { carbonContent: { not: null } },
              { mfgDate: { not: null } },
              { expiryDate: { not: null } },
              { analysisDate: { not: null } },
              { foreignMatter: { not: null } },
              { weightOfChips: { not: null } },
              { intrinsicViscosity: { not: null } },
              { ashContent: { not: null } },
              { heatStability: { not: null } },
              { lightFastness: { not: null } },
              { granule: { not: null } },
              { deltaE: { not: null } },
              { macaroni: { not: null } },
              { letDownRatio: { not: null } },
            ],
          },
        ],
      };

      const [printedCoas, total] = await Promise.all([
        prisma.print_coa.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { printedDate: "desc" },
          include: {
            creator: {
              select: { username: true },
            },
          },
        }),
        prisma.print_coa.count({ where }),
      ]);

      res.json({
        status: "success",
        message: "Data COA yang di-print berhasil diambil",
        data: printedCoas,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching printed COAs:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data COA yang di-print",
        error: error.message,
      });
    }
  },

  // Get printed COA by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const printedCoa = await prisma.print_coa.findUnique({
        where: { id: parseInt(id) },
        include: {
          creator: {
            select: { username: true },
          },
        },
      });

      if (!printedCoa) {
        return res.status(404).json({
          status: "error",
          message: "Data COA yang di-print tidak ditemukan",
        });
      }

      res.json({
        status: "success",
        message: "Data COA yang di-print berhasil diambil",
        data: printedCoa,
      });
    } catch (error) {
      console.error("Error fetching printed COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data COA yang di-print",
        error: error.message,
      });
    }
  },
};

module.exports = printCoaController;
