const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const printCoaController = {
  // Print COA dari Planning
  async print(req, res) {
    try {
      const { planningId } = req.params;
      const { quantity } = req.body;

      // 1. Validasi Input Kuantitas
      if (quantity === undefined || quantity === null) {
        return res.status(400).json({
          status: "error",
          message: "Field 'quantity' harus ada di body request.",
        });
      }
      const parsedQuantity = parseFloat(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({
          status: "error",
          message: "Field 'quantity' harus berupa angka positif.",
        });
      }

      // 2. Ambil Data Planning dan Detail QC "Passed" pertama
      const planningHeader = await prisma.planning_header.findUnique({
        where: { id: parseInt(planningId) },
        include: {
          customer: { include: { mandatoryFields: true } },
          product: true,
          planningDetails: {
            where: { qcJudgment: "Passed" },
            orderBy: { createdAt: "asc" },
            take: 1,
          },
        },
      });

      if (!planningHeader) {
        return res.status(404).json({
          status: "error",
          message: "Planning Header tidak ditemukan",
        });
      }
      if (
        !planningHeader.planningDetails ||
        planningHeader.planningDetails.length === 0
      ) {
        return res.status(404).json({
          status: "error",
          message: "Tidak ditemukan detail planning dengan QC status 'Passed'.",
        });
      }
      const firstPassedDetail = planningHeader.planningDetails[0];

      // 3. Validasi Kuantitas Cetak vs Kuantitas Check
      if (parsedQuantity > firstPassedDetail.qty) {
        return res.status(400).json({
          status: "error",
          message: `Kuantitas print (${parsedQuantity}) tidak boleh melebihi kuantitas check (${firstPassedDetail.qty}).`,
        });
      }

      // 4. Validasi Kuantitas Cetak vs Kuantitas Planning
      const previousPrints = await prisma.print_coa.findMany({
        where: { planningId: parseInt(planningId) },
      });
      const totalPrintedQuantity = previousPrints.reduce(
        (total, p) => total + (p.quantity || 0),
        0
      );

      if (totalPrintedQuantity + parsedQuantity > planningHeader.qtyPlanning) {
        return res.status(400).json({
          status: "error",
          message: `Total kuantitas print (${
            totalPrintedQuantity + parsedQuantity
          }) akan melebihi kuantitas planning (${planningHeader.qtyPlanning}).`,
        });
      }

      if (planningHeader.status !== "progress") {
        return res.status(400).json({
          status: "error",
          message: "Planning harus berstatus 'progress' untuk dapat di-print.",
        });
      }

      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { username: true },
      });

      // Siapkan data dasar untuk di-print
      const printData = {
        planningId: parseInt(planningId),
        costumerName: planningHeader.customer.name,
        productId: planningHeader.idProduct,
        pelletVisual: firstPassedDetail.visualCheck,
        productName: planningHeader.product.productName,
        lotNumber: planningHeader.lotNumber,
        letDownRatio: planningHeader.ratio,
        resin: planningHeader.resin,
        mfgDate: planningHeader.mfgDate,
        expiryDate: planningHeader.expiryDate,
        quantity: parsedQuantity, // Menggunakan quantity dari body
        analysisDate: firstPassedDetail.analysisDate,
        printedBy: req.user.id,
        issueBy: currentUser.username,
      };

      // Ambil field wajib dari customer dan isi datanya dari detail planning
      const mandatoryFields = planningHeader.customer.mandatoryFields.map(
        (f) => f.fieldName
      );

      for (const field of mandatoryFields) {
        if (
          firstPassedDetail.hasOwnProperty(field) &&
          firstPassedDetail[field] !== null
        ) {
          printData[field] = firstPassedDetail[field];
        }
      }

      const newPrintedCoa = await prisma.print_coa.create({
        data: printData,
      });

      res.status(201).json({
        status: "success",
        message: "COA dari planning berhasil di-print",
        data: newPrintedCoa,
      });
    } catch (error) {
      console.error("Error printing COA from planning:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat print COA dari planning",
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
              { pelletDiameter: { not: null } },
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
