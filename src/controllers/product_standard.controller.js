const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Daftar field valid dari PlanningDetail
const VALID_FIELDS = [
  "colorDeltaL",
  "colorDeltaA",
  "colorDeltaB",
  "colorDeltaE",
  "tintDeltaL",
  "tintDeltaA",
  "tintDeltaB",
  "tintDeltaE",
  "deltaP",
  "density",
  "mfr",
  "dispersibility",
  "contamination",
  "macaroni",
  "pelletLength",
  "pelletDiameter",
  "visualCheck",
  "moisture",
  "carbonContent",
  "foreignMatter",
  "weightOfChips",
  "intrinsicViscosity",
  "ashContent",
  "heatStability",
  "lightFastness",
  "granule",
  "caCO3",
  "hals",
  "hiding",
  "odor",
  "nucleatingAgent",
];

const getAllProductStandards = async (req, res) => {
  try {
    const data = await prisma.product_standards.findMany({
      where: { isDeleted: false },
    });
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const getProductStandardsByProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const data = await prisma.product_standards.findMany({
      where: { product_id: parseInt(product_id), isDeleted: false },
      include: {
        product: {
          select: {
            productName: true,
            resin: true,
          },
        },
      },
    });

    let productInfo = null;
    if (data.length > 0 && data[0].product) {
      productInfo = {
        productName: data[0].product.productName,
        resin: data[0].product.resin,
      };
    }
    res.json({ status: "success", product: productInfo, data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const updateProductStatusByStandard = async (product_id) => {
  const count = await prisma.product_standards.count({
    where: { product_id, isDeleted: false },
  });
  await prisma.master_product.update({
    where: { id: product_id },
    data: { status: count > 0 ? "active" : "draft" },
  });
};

const createProductStandard = async (req, res) => {
  try {
    const input = Array.isArray(req.body) ? req.body : [req.body];
    // Validasi semua property_name
    for (const item of input) {
      if (!VALID_FIELDS.includes(item.property_name)) {
        return res.status(400).json({
          status: "error",
          message: `property_name harus salah satu dari: ${VALID_FIELDS.join(
            ", "
          )}`,
        });
      }
    }
    // Validasi tidak ada property_name yang sama untuk product_id yang sama
    const keySet = new Set();
    for (const item of input) {
      const key = `${item.product_id}_${item.property_name}`;
      if (keySet.has(key)) {
        return res.status(400).json({
          status: "error",
          message: `Terdapat property_name '${item.property_name}' yang duplikat untuk product_id ${item.product_id}.`,
        });
      }
      keySet.add(key);
    }
    const data = await prisma.product_standards.createMany({ data: input });
    // Update status product terkait
    if (input[0] && input[0].product_id) {
      await updateProductStatusByStandard(input[0].product_id);
    }
    res.status(201).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const updateProductStandard = async (req, res) => {
  const { id } = req.params;
  try {
    if (Array.isArray(req.body)) {
      // Batch update: req.body = [{id, ...data}, ...]
      const results = [];
      for (const item of req.body) {
        if (!item.id) {
          return res.status(400).json({
            status: "error",
            message: "Setiap data harus ada id untuk update batch.",
          });
        }
        if (item.property_name && !VALID_FIELDS.includes(item.property_name)) {
          return res.status(400).json({
            status: "error",
            message: `property_name harus salah satu dari: ${VALID_FIELDS.join(
              ", "
            )}`,
          });
        }
        const updated = await prisma.product_standards.update({
          where: { id: parseInt(item.id) },
          data: item,
        });
        results.push(updated);
      }
      return res.json({ status: "success", data: results });
    } else {
      // Single update
      if (
        req.body.property_name &&
        !VALID_FIELDS.includes(req.body.property_name)
      ) {
        return res.status(400).json({
          status: "error",
          message: `property_name harus salah satu dari: ${VALID_FIELDS.join(
            ", "
          )}`,
        });
      }
      const data = await prisma.product_standards.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.json({ status: "success", data });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const deleteProductStandard = async (req, res) => {
  const { id } = req.params;
  try {
    // Cari product_id sebelum delete
    const standard = await prisma.product_standards.findUnique({
      where: { id: parseInt(id) },
    });
    if (!standard || standard.isDeleted) {
      return res
        .status(404)
        .json({ status: "error", message: "Data tidak ditemukan" });
    }
    await prisma.product_standards.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });
    // Update status product terkait
    if (standard && standard.product_id) {
      await updateProductStatusByStandard(standard.product_id);
    }
    res.json({ status: "success", message: "Deleted (soft delete)" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = {
  getAllProductStandards,
  getProductStandardsByProduct,
  createProductStandard,
  updateProductStandard,
  deleteProductStandard,
};
