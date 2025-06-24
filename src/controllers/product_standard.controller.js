const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Daftar field valid dari PlanningDetail
const VALID_FIELDS = [
  "lineNo",
  "deltaL",
  "deltaA",
  "deltaB",
  "deltaE",
  "density",
  "mfr",
  "dispersion",
  "contamination",
  "macaroni",
  "pelletLength",
  "pelletDiameter",
  "visualCheck",
  "moisture",
  "carbonContent",
  "foreignMatter",
  "weightChips",
  "intrinsicViscosity",
  "ashContent",
  "heatStability",
  "lightFastness",
  "granule",
  "qcJudgment",
  "analysisDate",
  "checkedBy",
  "remark",
];

const getAllProductStandards = async (req, res) => {
  try {
    const data = await prisma.product_standards.findMany();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const getProductStandardsByProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const data = await prisma.product_standards.findMany({
      where: { product_id: parseInt(product_id) },
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
    const data = await prisma.product_standards.createMany({ data: input });
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
    await prisma.product_standards.delete({ where: { id: parseInt(id) } });
    res.json({ status: "success", message: "Deleted" });
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
