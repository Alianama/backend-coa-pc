const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

const planningHeaderController = {
  // Create new planningHeader
  async create(req, res) {
    try {
      const data = req.body;
      // Ambil expiredAge dari product
      const product = await prisma.master_product.findUnique({
        where: { id: data.idProduct },
        select: { expiredAge: true },
      });
      if (!product) {
        return res.status(400).json({
          status: "error",
          message: "Produk tidak ditemukan!",
        });
      }

      // Hitung expiryDate
      const mfgDate = new Date(data.mfgDate);
      const expiredAge = product.expiredAge || 0;
      const expiryDate = new Date(
        mfgDate.setMonth(mfgDate.getMonth() + expiredAge)
      );

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
          idCustomer: data.idCustomer,
          idProduct: data.idProduct,
          resin: data.resin,
          ratio: data.ratio,
          moulding: data.moulding,
          lotNumber: data.lotNumber,
          qtyPlanning: data.qtyPlanning,
          mfgDate: data.mfgDate,
          expiryDate: expiryDate,
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
      const where = {
        isDeleted: false,
        ...(search
          ? {
              OR: [
                { resin: { contains: search } },
                { lotNumber: { contains: search } },
                { moulding: { contains: search } },
                { customer: { name: { contains: search } } },
                { product: { productName: { contains: search } } },
              ],
            }
          : {}),
      };
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

      // Gunakan quantityPrint dan quantityCheck yang sudah disimpan di database
      const planningsWithQuantities = plannings.map((planning) => ({
        ...planning,
        totalQtyPrinted: planning.quantityPrint || 0,
        totalQtyCheck: planning.quantityCheck || 0,
      }));

      res.json({
        status: "success",
        message: "Data planning berhasil diambil",
        data: planningsWithQuantities,
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
        where: { id: parseInt(id), isDeleted: false },
        include: {
          creator: { select: { fullName: true } },
          customer: { select: { name: true } },
          product: { select: { productName: true } },
          planningDetails: {
            where: { isDeleted: false },
          },
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
        data: {
          ...planning,
          totalQtyPrinted: planning.quantityPrint || 0,
          totalQtyCheck: planning.quantityCheck || 0,
        },
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
      const planning = await prisma.planning_header.findUnique({
        where: { id: parseInt(id) },
      });
      if (!planning || planning.isDeleted) {
        return res
          .status(404)
          .json({ status: "error", message: "Planning tidak ditemukan" });
      }
      await prisma.planning_header.update({
        where: { id: parseInt(id) },
        data: { isDeleted: true },
      });
      res.json({
        status: "success",
        message: "Planning berhasil dihapus (soft delete)",
      });
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
      const { idPlanning, qty } = req.body;
      const planning = await prisma.planning_header.findUnique({
        where: { id: idPlanning, isDeleted: false },
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
        where: { idPlanning, isDeleted: false },
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
        if (
          typeof x !== "number" ||
          typeof y !== "number" ||
          typeof z !== "number"
        ) {
          return null;
        }
        return Math.sqrt(x * x + y * y + z * z);
      }
      const {
        tintDeltaL,
        tintDeltaA,
        tintDeltaB,
        colorDeltaL,
        colorDeltaA,
        colorDeltaB,
        visualCheck,
        colorCheck,
      } = req.body;
      const tintDeltaE = hitungMagnitude(tintDeltaL, tintDeltaA, tintDeltaB);
      const colorDeltaE = hitungMagnitude(
        colorDeltaL,
        colorDeltaA,
        colorDeltaB
      );

      if (planning.status === "close") {
        return res.status(400).json({
          status: "error",
          message:
            "Tidak dapat mengupdate detail pada planning yang sudah di-close.",
        });
      }

      let qcJudgment = "NG";
      const standards = await prisma.product_standards.findMany({
        where: { product_id: planning.idProduct },
      });
      let allPassed = true;
      for (const std of standards) {
        // Jika target_value kosong/null, langsung gagal
        if (std.target_value === undefined || std.target_value === null) {
          allPassed = false;
          break;
        }
        const actual = req.body[std.property_name];
        // Jika target_value ada tapi actual null/undefined, gagal
        if (
          std.target_value !== undefined &&
          std.target_value !== null &&
          (actual === undefined || actual === null)
        ) {
          allPassed = false;
          break;
        }
        if (std.operator === "PLUS_MINUS") {
          if (
            actual < std.target_value - (std.tolerance || 0) ||
            actual > std.target_value + (std.tolerance || 0)
          ) {
            allPassed = false;
            break;
          }
        } else if (std.operator === "LESS_THAN") {
          if (!(actual < std.target_value)) {
            allPassed = false;
            break;
          }
        } else if (std.operator === "LESS_EQUAL") {
          if (!(actual <= std.target_value)) {
            allPassed = false;
            break;
          }
        } else if (std.operator === "GREATER_THAN") {
          if (!(actual > std.target_value)) {
            allPassed = false;
            break;
          }
        } else if (std.operator === "GREATER_EQUAL") {
          if (!(actual >= std.target_value)) {
            allPassed = false;
            break;
          }
        }
      }
      // Setelah loop, cek visual_check dan color_check
      if (visualCheck !== "Ok" || colorCheck !== "Ok") {
        allPassed = false;
      }
      if (allPassed) qcJudgment = "Passed";

      // Bersihkan data sebelum create - ubah string kosong menjadi null dan string angka menjadi number untuk field Float
      const cleanData = { ...req.body };
      const floatFields = [
        "dispersibility",
        "contamination",
        "macaroni",
        "pelletLength",
        "pelletDiameter",
        "moisture",
        "carbonContent",
        "foreignMatter",
        "weightOfChips",
        "intrinsicViscosity",
        "ashContent",
        "heatStability",
        "lightFastness",
        "granule",
        "tintDeltaL",
        "tintDeltaA",
        "tintDeltaB",
        "colorDeltaL",
        "colorDeltaA",
        "colorDeltaB",
        "deltaP",
        "density",
        "mfr",
      ];

      floatFields.forEach((field) => {
        if (
          cleanData[field] === "" ||
          cleanData[field] === undefined ||
          cleanData[field] === null
        ) {
          cleanData[field] = null;
        } else if (
          typeof cleanData[field] === "string" &&
          !isNaN(cleanData[field])
        ) {
          cleanData[field] = parseFloat(cleanData[field]);
        }
      });

      const detail = await prisma.planning_detail.create({
        data: {
          ...cleanData,
          tintDeltaE,
          colorDeltaE,
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
      await updateQuantityCheck(idPlanning);
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
        where: { idPlanning: parseInt(idPlanning), isDeleted: false },
        include: { creator: { select: { fullName: true } } },
      });
      // Ambil standar produk
      const planning = await prisma.planning_header.findUnique({
        where: { id: parseInt(idPlanning), isDeleted: false },
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

      res.json({
        status: "success",
        totalQtyCheck: planning.quantityCheck || 0,
        totalQtyPrinted: planning.quantityPrint || 0,
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
  async getDetailsByLotNumber(req, res) {
    try {
      const { lotNumber } = req.params;
      const planning = await prisma.planning_header.findFirst({
        where: { lotNumber, isDeleted: false },
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
        where: { idPlanning: planning.id, isDeleted: false },
        include: { creator: { select: { fullName: true } } },
      });
      const standards = await prisma.product_standards.findMany({
        where: {
          product_id: planning.idProduct,
          isDeleted: false,
        },
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
        totalQtyCheck: planning.quantityCheck || 0,
        totalQtyPrinted: planning.quantityPrint || 0,
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

      // Ambil detail dan planning terkait
      const detailOld = await prisma.planning_detail.findUnique({
        where: { id: parseInt(id), isDeleted: false },
      });
      const planning = await prisma.planning_header.findUnique({
        where: { id: detailOld.idPlanning, isDeleted: false },
      });

      // Validasi status planning
      if (planning.status === "close") {
        return res.status(400).json({
          status: "error",
          message:
            "Tidak dapat mengupdate detail pada planning yang sudah di-close.",
        });
      }

      // Gabungkan data lama dengan data update
      const mergedData = { ...detailOld, ...updateData };

      // Bersihkan data sebelum update - ubah string kosong menjadi null dan string angka menjadi number untuk field Float
      const floatFields = [
        "dispersibility",
        "contamination",
        "macaroni",
        "pelletLength",
        "pelletDiameter",
        "moisture",
        "carbonContent",
        "foreignMatter",
        "weightOfChips",
        "intrinsicViscosity",
        "ashContent",
        "heatStability",
        "lightFastness",
        "granule",
        "tintDeltaL",
        "tintDeltaA",
        "tintDeltaB",
        "colorDeltaL",
        "colorDeltaA",
        "colorDeltaB",
        "deltaP",
        "density",
        "mfr",
        "caCO3",
        "odor",
        "nucleatingAgent",
        "hals",
        "hiding",
      ];

      floatFields.forEach((field) => {
        if (
          mergedData[field] === "" ||
          mergedData[field] === undefined ||
          mergedData[field] === null
        ) {
          mergedData[field] = null;
        } else if (
          typeof mergedData[field] === "string" &&
          !isNaN(mergedData[field])
        ) {
          mergedData[field] = parseFloat(mergedData[field]);
        }
      });

      // Hitung ulang tintDeltaE dan colorDeltaE
      function hitungMagnitude(x, y, z) {
        if (
          typeof x !== "number" ||
          typeof y !== "number" ||
          typeof z !== "number"
        ) {
          return null;
        }
        return Math.sqrt(x * x + y * y + z * z);
      }
      mergedData.tintDeltaE = hitungMagnitude(
        mergedData.tintDeltaL,
        mergedData.tintDeltaA,
        mergedData.tintDeltaB
      );
      mergedData.colorDeltaE = hitungMagnitude(
        mergedData.colorDeltaL,
        mergedData.colorDeltaA,
        mergedData.colorDeltaB
      );

      // QC Judgement logic
      let qcJudgment = "NG";
      const standards = await prisma.product_standards.findMany({
        where: { product_id: planning.idProduct },
      });
      let allPassed = true;
      for (const std of standards) {
        // Jika target_value kosong/null, langsung gagal
        if (std.target_value === undefined || std.target_value === null) {
          allPassed = false;
          break;
        }
        const actual = mergedData[std.property_name];
        // Jika target_value ada tapi actual null/undefined, gagal
        if (
          std.target_value !== undefined &&
          std.target_value !== null &&
          (actual === undefined || actual === null)
        ) {
          allPassed = false;
          break;
        }
        if (std.operator === "PLUS_MINUS") {
          if (
            actual < std.target_value - (std.tolerance || 0) ||
            actual > std.target_value + (std.tolerance || 0)
          ) {
            allPassed = false;
            break;
          }
        } else if (std.operator === "LESS_THAN") {
          if (!(actual < std.target_value)) {
            allPassed = false;
            break;
          }
        } else if (std.operator === "LESS_EQUAL") {
          if (!(actual <= std.target_value)) {
            allPassed = false;
            break;
          }
        } else if (std.operator === "GREATER_THAN") {
          if (!(actual > std.target_value)) {
            allPassed = false;
            break;
          }
        } else if (std.operator === "GREATER_EQUAL") {
          if (!(actual >= std.target_value)) {
            allPassed = false;
            break;
          }
        }
      }
      // Setelah loop, cek visual_check dan color_check
      if (mergedData.visualCheck !== "Ok" || mergedData.colorCheck !== "Ok") {
        allPassed = false;
      }
      if (allPassed) qcJudgment = "Passed";
      mergedData.qcJudgment = qcJudgment;

      const allowedFields = [
        "qty",
        "lineNo",
        "tintDeltaL",
        "tintDeltaA",
        "tintDeltaB",
        "tintDeltaE",
        "colorDeltaL",
        "colorDeltaA",
        "colorDeltaB",
        "colorDeltaE",
        "deltaP",
        "density",
        "mfr",
        "dispersibility",
        "contamination",
        "macaroni",
        "pelletLength",
        "pelletDiameter",
        "visualCheck",
        "colorCheck",
        "moisture",
        "carbonContent",
        "foreignMatter",
        "weightOfChips",
        "intrinsicViscosity",
        "ashContent",
        "heatStability",
        "lightFastness",
        "granule",
        "qcJudgment",
        "analysisDate",
        "checkedBy",
        "caCO3",
        "odor",
        "nucleatingAgent",
        "hals",
        "hiding",
        "remark",
      ];
      const updatePayload = {};
      allowedFields.forEach((field) => {
        if (mergedData[field] !== undefined)
          updatePayload[field] = mergedData[field];
      });
      // Pastikan idPlanning tidak ikut
      delete updatePayload.idPlanning;

      const detail = await prisma.planning_detail.update({
        where: { id: parseInt(id) },
        data: updatePayload,
        include: { creator: { select: { fullName: true } } },
      });
      await updateQuantityCheck(detailOld.idPlanning);
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
      if (!detailToDelete || detailToDelete.isDeleted) {
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
      await prisma.planning_detail.update({
        where: { id: parseInt(id) },
        data: { isDeleted: true },
      });
      const remainingDetails = await prisma.planning_detail.count({
        where: { idPlanning, isDeleted: false },
      });
      if (remainingDetails === 0) {
        await prisma.planning_header.update({
          where: { id: idPlanning },
          data: { status: "open" },
        });
      }
      await updateQuantityCheck(idPlanning);
      res.json({
        status: "success",
        message: "Detail berhasil dihapus (soft delete)",
      });
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
