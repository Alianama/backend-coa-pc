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

// Helper function untuk memetakan field dari planning_detail ke print_coa
function mapPlanningDetailToPrintCoa(planningDetail, mandatoryFields) {
  const mappedData = {};

  // Mapping field berdasarkan mandatory fields customer
  mandatoryFields.forEach((mandatoryField) => {
    const fieldName = mandatoryField;

    // Mapping field yang mungkin berbeda nama
    const fieldMapping = {
      pelletLength: planningDetail.pelletLength,
      pelletDiameter: planningDetail.pelletDiameter,
      visualCheck: planningDetail.visualCheck,
      colorCheck: planningDetail.colorCheck,
      caCO3: planningDetail.caCO3,
      odor: planningDetail.odor,
      nucleatingAgent: planningDetail.nucleatingAgent,
      hals: planningDetail.hals,
      hiding: planningDetail.hiding,
      dispersibility: planningDetail.dispersibility,
      mfr: planningDetail.mfr,
      density: planningDetail.density,
      moisture: planningDetail.moisture,
      carbonContent: planningDetail.carbonContent,
      foreignMatter: planningDetail.foreignMatter,
      weightOfChips: planningDetail.weightOfChips,
      intrinsicViscosity: planningDetail.intrinsicViscosity,
      ashContent: planningDetail.ashContent,
      heatStability: planningDetail.heatStability,
      lightFastness: planningDetail.lightFastness,
      granule: planningDetail.granule,
      macaroni: planningDetail.macaroni,
      tintDeltaE: planningDetail.tintDeltaE,
      colorDeltaE: planningDetail.colorDeltaE,
      deltaP: planningDetail.deltaP,
    };

    if (
      fieldMapping[fieldName] !== undefined &&
      fieldMapping[fieldName] !== null
    ) {
      mappedData[fieldName] = fieldMapping[fieldName];
    }
  });

  return mappedData;
}

const printCoaController = {
  // Print COA dari Planning
  async print(req, res) {
    try {
      const { planningId } = req.params;
      const { quantity } = req.body;

      // 1. Validasi Input
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

      // 2. Ambil Data Planning Header dengan Customer dan Product
      const planningHeader = await prisma.planning_header.findUnique({
        where: { id: parseInt(planningId) },
        include: {
          customer: {
            include: {
              mandatoryFields: true,
            },
          },
          product: true,
        },
      });

      if (!planningHeader) {
        return res.status(404).json({
          status: "error",
          message: "Planning Header tidak ditemukan",
        });
      }

      // 3. Ambil Planning Detail pertama dengan qcJudgment "Passed"
      const planningDetail = await prisma.planning_detail.findFirst({
        where: {
          idPlanning: parseInt(planningId),
          qcJudgment: "Passed",
        },
        orderBy: { id: "asc" }, // Ambil yang pertama berdasarkan ID
      });

      if (!planningDetail) {
        return res.status(404).json({
          status: "error",
          message:
            "Tidak ada Planning Detail dengan QC Judgment 'Passed' ditemukan",
        });
      }

      // 4. Validasi QC Judgment (double check)
      if (planningDetail.qcJudgment !== "Passed") {
        return res.status(400).json({
          status: "error",
          message: "Planning Detail harus memiliki QC Judgment 'Passed'",
        });
      }

      // 5. Validasi Total Kuantitas Print vs Total Quantity Check
      const totalPrintedQuantity = planningHeader.quantityPrint || 0;
      const totalQuantityAfterPrint = totalPrintedQuantity + parsedQuantity;

      if (totalQuantityAfterPrint > planningHeader.quantityCheck) {
        return res.status(400).json({
          status: "error",
          message: `Total kuantitas print setelah operasi ini (${totalQuantityAfterPrint}) tidak boleh melebihi total quantity check (${planningHeader.quantityCheck}). Kuantitas yang sudah di-print: ${totalPrintedQuantity}, kuantitas baru: ${parsedQuantity}`,
        });
      }

      // 6. Validasi Total Kuantitas Print vs Kuantitas Planning
      if (totalQuantityAfterPrint > planningHeader.qtyPlanning) {
        return res.status(400).json({
          status: "error",
          message: `Total kuantitas print (${totalQuantityAfterPrint}) akan melebihi kuantitas planning (${planningHeader.qtyPlanning}).`,
        });
      }

      // 7. Validasi Status Planning
      if (planningHeader.status !== "progress") {
        return res.status(400).json({
          status: "error",
          message: "Planning harus berstatus 'progress' untuk dapat di-print.",
        });
      }

      // 8. Ambil data user yang melakukan print
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { username: true },
      });

      // 9. Map data dari planning detail sesuai mandatory fields
      const detailDataForPrint = mapPlanningDetailToPrintCoa(
        planningDetail,
        planningHeader.customer.mandatoryFields
      );

      // 10. Siapkan data untuk print COA
      const printData = {
        planningId: parseInt(planningId),
        costumerName: planningHeader.customer.name,
        productId: planningHeader.idProduct,
        productName: planningHeader.product.productName,
        lotNumber: planningHeader.lotNumber,
        letDownRatio: planningHeader.ratio,
        resin: planningHeader.resin,
        mfgDate: planningHeader.mfgDate,
        expiryDate: planningHeader.expiryDate,
        quantity: parsedQuantity,
        analysisDate: planningDetail.analysisDate,
        printedBy: req.user.id,
        issueBy: currentUser.username,
        status: "REQUESTED", // Default status
        ...detailDataForPrint,
      };

      // 11. Buat print COA
      const newPrintedCoa = await prisma.print_coa.create({
        data: printData,
      });

      // 12. Update quantityPrint di planning_header
      await updateQuantityPrint(planningId);

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
      const { page = 1, limit = 100, search = "", status } = req.query;
      const skip = (page - 1) * limit;

      // Build where clause
      const where = {
        isDeleted: false,
        AND: [
          {
            OR: [
              { costumerName: { contains: search } },
              { productName: { contains: search } },
              { lotNumber: { contains: search } },
              { issueBy: { contains: search } },
            ],
          },
        ],
      };

      // Add status filter if provided
      if (status && ["REQUESTED", "APPROVED", "REJECTED"].includes(status)) {
        where.AND.push({ status: status });
      }

      const [printedCoas, total] = await Promise.all([
        prisma.print_coa.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { printedDate: "desc" },
          include: {
            creator: {
              select: { fullName: true },
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
        where: { id: parseInt(id), isDeleted: false },
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

  // Delete printed COA by ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      // Ambil data print COA sebelum dihapus untuk mendapatkan planningId
      const printedCoa = await prisma.print_coa.findUnique({
        where: { id: parseInt(id) },
        select: { planningId: true, status: true, isDeleted: true },
      });
      if (!printedCoa || printedCoa.isDeleted) {
        return res.status(404).json({
          status: "error",
          message: "Data COA yang di-print tidak ditemukan",
        });
      }
      // Validasi status - hanya bisa hapus jika status REQUESTED
      if (printedCoa.status !== "REQUESTED") {
        return res.status(400).json({
          status: "error",
          message: "Hanya COA dengan status REQUESTED yang dapat dihapus",
        });
      }
      // Soft delete print COA
      await prisma.print_coa.update({
        where: { id: parseInt(id) },
        data: { isDeleted: true },
      });
      // Update quantityPrint di planning_header
      await updateQuantityPrint(printedCoa.planningId);
      res.json({
        status: "success",
        message: "Data COA yang di-print berhasil dihapus (soft delete)",
      });
    } catch (error) {
      console.error("Error deleting printed COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menghapus data COA yang di-print",
        error: error.message,
      });
    }
  },

  // Handler untuk approve print COA
  async approvePrintCoa(req, res) {
    try {
      const { id } = req.params;

      // Cek apakah print COA ada
      const printedCoa = await prisma.print_coa.findUnique({
        where: { id: parseInt(id), isDeleted: false },
      });

      if (!printedCoa) {
        return res.status(404).json({
          status: "error",
          message: "Data COA yang di-print tidak ditemukan",
        });
      }

      // Validasi status - hanya bisa approve jika status REQUESTED
      if (printedCoa.status !== "REQUESTED") {
        return res.status(400).json({
          status: "error",
          message: "Hanya COA dengan status REQUESTED yang dapat di-approve",
        });
      }

      const updated = await prisma.print_coa.update({
        where: { id: parseInt(id) },
        data: {
          status: "APPROVED",
          approvedBy: req.user.id,
          approvedDate: new Date(),
        },
      });

      res.json({
        status: "success",
        message: "Print COA berhasil di-approve",
        data: updated,
      });
    } catch (error) {
      console.error("Error approving print COA:", error);
      res.status(500).json({
        status: "error",
        message: "Gagal approve print COA",
        error: error.message,
      });
    }
  },

  // Handler untuk reject print COA
  async rejectPrintCoa(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      // Cek apakah print COA ada
      const printedCoa = await prisma.print_coa.findUnique({
        where: { id: parseInt(id), isDeleted: false },
      });

      if (!printedCoa) {
        return res.status(404).json({
          status: "error",
          message: "Data COA yang di-print tidak ditemukan",
        });
      }

      // Validasi status - hanya bisa reject jika status REQUESTED
      if (printedCoa.status !== "REQUESTED") {
        return res.status(400).json({
          status: "error",
          message: "Hanya COA dengan status REQUESTED yang dapat di-reject",
        });
      }

      const updated = await prisma.print_coa.update({
        where: { id: parseInt(id) },
        data: {
          status: "REJECTED",
          approvedBy: req.user.id,
          approvedDate: new Date(),
        },
      });

      res.json({
        status: "success",
        message: "Print COA berhasil di-reject",
        data: updated,
      });
    } catch (error) {
      console.error("Error rejecting print COA:", error);
      res.status(500).json({
        status: "error",
        message: "Gagal reject print COA",
        error: error.message,
      });
    }
  },

  // Get print COA by planning ID
  async getByPlanningId(req, res) {
    try {
      const { planningId } = req.params;
      const { page = 1, limit = 100 } = req.query;
      const skip = (page - 1) * limit;

      const [printedCoas, total] = await Promise.all([
        prisma.print_coa.findMany({
          where: { planningId: parseInt(planningId), isDeleted: false },
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { printedDate: "desc" },
          include: {
            creator: {
              select: { username: true },
            },
          },
        }),
        prisma.print_coa.count({
          where: { planningId: parseInt(planningId), isDeleted: false },
        }),
      ]);

      res.json({
        status: "success",
        message: "Data COA yang di-print berdasarkan planning berhasil diambil",
        data: printedCoas,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching printed COAs by planning:", error);
      res.status(500).json({
        status: "error",
        message:
          "Terjadi kesalahan saat mengambil data COA yang di-print berdasarkan planning",
        error: error.message,
      });
    }
  },
};

module.exports = printCoaController;
