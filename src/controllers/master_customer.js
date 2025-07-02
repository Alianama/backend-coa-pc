const { PrismaClient } = require("@prisma/client");
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
};

function mapMandatoryFieldsToDb(mandatoryFields = {}) {
  const mapped = {};
  for (const [input, dbField] of Object.entries(FIELD_MAP)) {
    mapped[dbField] = !!mandatoryFields[input];
  }
  return mapped;
}

async function createLog(action, description, coaId, userId) {
  try {
    // Jika coaId adalah null atau undefined, kita tidak perlu menyertakannya
    const logData = {
      action,
      description,
      userId,
    };

    // Hanya tambahkan coaId jika ada dan valid
    if (coaId) {
      logData.coaId = coaId;
    }

    const log = await prisma.log.create({
      data: logData,
    });
    console.log(`Log created: ${action} - ${description}`);
    return log;
  } catch (error) {
    console.error("Error creating log:", error);
    // Jangan throw error, hanya log saja
    return null;
  }
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
      await createLog(
        "CREATE_CUSTOMER",
        `Customer \"${name}\" berhasil dibuat`,
        null,
        req.user?.id
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
      await createLog(
        "GET_ALL_CUSTOMERS",
        `Berhasil mengambil ${customers.length} data customer`,
        null,
        req.user?.id
      );
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
      await createLog(
        "GET_CUSTOMER_BY_ID",
        `Berhasil mengambil data customer dengan ID ${customerId}`,
        null,
        req.user?.id
      );
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
      await createLog(
        "UPDATE_CUSTOMER",
        `Customer dengan ID ${customerId} berhasil diupdate`,
        null,
        req.user?.id
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

      // Tambahkan log untuk delete customer
      await createLog(
        "DELETE_CUSTOMER",
        `Customer "${customer.name}" dengan ID ${id} berhasil dihapus (soft delete)`,
        null,
        req.user?.id
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
      const validFields = [
        "letDownRatio",
        "resin",
        "pelletLength",
        "pelletDiameter",
        "pelletVisual",
        "dispersibility",
        "mfr",
        "density",
        "moisture",
        "carbonContent",
        "analysisDate",
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
      ];

      // Tambahkan log untuk mengambil valid fields
      await createLog(
        "GET_VALID_FIELDS",
        "Berhasil mengambil daftar valid fields",
        null,
        req.user?.id
      );

      res.status(200).json({ fields: validFields });
    } catch (error) {
      res.status(500).json({
        error: "Failed to get valid fields",
        details: error.message,
      });
    }
  },
};
