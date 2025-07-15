const { PrismaClient } = require("@prisma/client");
const { logCreate, logUpdate, logDelete } = require("../utils/logger");
const prisma = new PrismaClient();

// Daftar kolom yang valid dari master_coa
const VALID_COA_FIELDS = [
  "pelletLength",
  "pelletDiameter",
  "visualCheck",
  "colorCheck",
  "dispersibility",
  "mfr",
  "density",
  "moisture",
  "carbonContent",
  "analysisDate",
  "printedDate",
  "foreignMatter",
  "weightOfChips",
  "intrinsicViscosity",
  "ashContent",
  "heatStability",
  "lightFastness",
  "granule",
  "tintDeltaE",
  "colorDeltaE",
  "deltaP",
  "macaroni",
  "caCO3",
  "odor",
  "nucleatingAgent",
  "hals",
  "hiding",
  "dispersion",
  "contamination",
];

const FIELD_MAP = {
  pelletLength: "pelletLength",
  pelletDiameter: "pelletDiameter",
  visualCheck: "visualCheck",
  colorCheck: "colorCheck",
  dispersibility: "dispersibility",
  mfr: "mfr",
  density: "density",
  moisture: "moisture",
  carbonContent: "carbonContent",
  analysisDate: "analysisDate",
  foreignMatter: "foreignMatter",
  weightOfChips: "weightOfChips",
  intrinsicViscosity: "intrinsicViscosity",
  ashContent: "ashContent",
  heatStability: "heatStability",
  lightFastness: "lightFastness",
  granule: "granule",
  tintDeltaE: "tintDeltaE",
  colorDeltaE: "colorDeltaE",
  deltaP: "deltaP",
  macaroni: "macaroni",
  caCO3: "caCO3",
  odor: "odor",
  nucleatingAgent: "nucleatingAgent",
  hals: "hals",
  hiding: "hiding",
  dispersion: "dispersion",
  contamination: "contamination",
};

function mapMandatoryFieldsToDb(mandatoryFields = {}) {
  const mapped = {};
  for (const [input, dbField] of Object.entries(FIELD_MAP)) {
    mapped[dbField] = !!mandatoryFields[input];
  }
  return mapped;
}

module.exports = {
  createCustomer: async (req, res) => {
    const { name, mandatoryFields } = req.body;
    try {
      if (!name) {
        return res.status(400).json({
          status: "error",
          message: "Name is required",
        });
      }
      // Validasi mandatoryFields jika ada
      if (mandatoryFields && typeof mandatoryFields !== "object") {
        return res.status(400).json({
          status: "error",
          message: "Mandatory fields harus berupa object",
        });
      }
      // Validasi setiap field jika ada mandatoryFields
      if (mandatoryFields) {
        for (const field of Object.keys(mandatoryFields)) {
          if (!VALID_COA_FIELDS.includes(field)) {
            return res.status(400).json({
              status: "error",
              message: `Invalid field name: ${field}`,
              validFields: VALID_COA_FIELDS,
            });
          }
        }
      }
      // Mapping mandatoryFields ke kolom boolean
      const mandatoryDbFields = mapMandatoryFieldsToDb(mandatoryFields);
      // Buat customer
      const customer = await prisma.master_customer.create({
        data: {
          name,
          ...mandatoryDbFields,
        },
      });

      // Log aktivitas create
      await logCreate(
        "master_customers",
        req.user.id,
        req.user.username,
        customer.id,
        { name, mandatoryFields },
        `Customer baru dibuat: ${name}`
      );
      res.status(201).json({
        status: "success",
        message: "Customer berhasil dibuat",
        data: customer,
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(400).json({
          status: "error",
          message: "Customer name already exists",
        });
      }
      res.status(500).json({
        status: "error",
        message: "Failed to create customer",
        details: error.message,
      });
    }
  },

  getAllCustomers: async (req, res) => {
    try {
      const customers = await prisma.master_customer.findMany({
        where: { isDeleted: false },
      });

      res.status(200).json({
        status: "success",
        message: "Data customer berhasil diambil",
        data: customers,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil data customer",
        details: error.message,
      });
    }
  },

  getCustomerById: async (req, res) => {
    const { id } = req.params;
    try {
      const customerId = parseInt(id);
      if (isNaN(customerId)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid customer ID",
        });
      }
      const customer = await prisma.master_customer.findUnique({
        where: { id: customerId, isDeleted: false },
      });
      if (!customer) {
        return res.status(404).json({
          status: "error",
          message: "Customer not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Customer berhasil ditemukan",
        data: customer,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to get customer",
        details: error.message,
      });
    }
  },

  updateCustomer: async (req, res) => {
    const { id } = req.params;
    const { name, mandatoryFields } = req.body;
    try {
      const customerId = parseInt(id);
      if (isNaN(customerId)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid customer ID",
        });
      }
      // Validasi customer exists
      const existingCustomer = await prisma.master_customer.findUnique({
        where: { id: customerId, isDeleted: false },
      });
      if (!existingCustomer) {
        return res.status(404).json({
          status: "error",
          message: "Customer not found",
        });
      }
      // Validasi mandatoryFields jika ada
      if (mandatoryFields && typeof mandatoryFields !== "object") {
        return res.status(400).json({
          status: "error",
          message: "Mandatory fields harus berupa object",
        });
      }
      if (mandatoryFields) {
        for (const field of Object.keys(mandatoryFields)) {
          if (!VALID_COA_FIELDS.includes(field)) {
            return res.status(400).json({
              status: "error",
              message: `Invalid field name: ${field}`,
              validFields: VALID_COA_FIELDS,
            });
          }
        }
      }
      // Mapping mandatoryFields ke kolom boolean
      const mandatoryDbFields = mapMandatoryFieldsToDb(mandatoryFields);
      // Update customer
      const updateData = { ...mandatoryDbFields };
      if (name) updateData.name = name;
      const customer = await prisma.master_customer.update({
        where: { id: customerId },
        data: updateData,
      });

      // Log aktivitas update
      await logUpdate(
        "master_customers",
        req.user.id,
        req.user.username,
        customerId,
        existingCustomer,
        { name, mandatoryFields },
        `Customer diupdate: ${customer.name}`
      );
      res.status(200).json({
        status: "success",
        message: "Customer berhasil diupdate",
        data: customer,
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(400).json({
          status: "error",
          message: "Customer name already exists",
        });
      }
      res.status(500).json({
        status: "error",
        message: "Failed to update customer",
        details: error.message,
      });
    }
  },

  deleteCustomer: async (req, res) => {
    const { id } = req.params;
    try {
      // Cek apakah customer dengan id tersebut ada
      const existingCustomer = await prisma.master_customer.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingCustomer || existingCustomer.isDeleted) {
        return res.status(404).json({
          status: "error",
          message: "Customer tidak ditemukan",
        });
      }

      const customer = await prisma.master_customer.update({
        where: { id: parseInt(id) },
        data: { isDeleted: true },
      });

      // Log aktivitas delete
      await logDelete(
        "master_customers",
        req.user.id,
        req.user.username,
        parseInt(id),
        existingCustomer,
        `Customer dihapus: ${customer.name}`
      );
      res.status(200).json({
        status: "success",
        message: "Customer berhasil dihapus (soft delete)",
        data: customer,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to delete customer",
        details: error.message,
      });
    }
  },

  getValidFields: async (req, res) => {
    try {
      res.status(200).json({ fields: Object.keys(FIELD_MAP) });
    } catch (error) {
      res.status(500).json({
        error: "Failed to get valid fields",
        details: error.message,
      });
    }
  },
};
