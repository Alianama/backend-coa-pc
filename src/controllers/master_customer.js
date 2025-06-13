const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Daftar kolom yang valid dari master_coa
const VALID_COA_FIELDS = [
  "productName",
  "lotNumber",
  "quantity",
  "letDownResin",
  "pelletLength",
  "pelletDimension",
  "pelletVisual",
  "color",
  "dispersibility",
  "mfr",
  "density",
  "moisture",
  "carbonContent",
  "mfgDate",
  "expiryDate",
  "analysisDate",
  "printedDate",
  "foreignMatter",
  "weightOfChips",
  "intrinsicViscosity",
  "ashContent",
  "heatStability",
  "lightFastness",
  "granule",
  "deltaE",
  "macaroni",
];

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

      if (!Array.isArray(mandatoryFields)) {
        return res.status(400).json({
          status: "error",
          message: "Mandatory fields must be an array",
        });
      }

      // Validasi setiap field
      for (const field of mandatoryFields) {
        if (!VALID_COA_FIELDS.includes(field)) {
          return res.status(400).json({
            status: "error",
            message: `Invalid field name: ${field}`,
            validFields: VALID_COA_FIELDS,
          });
        }
      }

      // Buat customer dan mandatory fields dalam satu transaksi
      const result = await prisma.$transaction(async (prisma) => {
        // Buat customer
        const customer = await prisma.master_customer.create({
          data: { name },
        });

        // Buat mandatory fields
        const mandatoryFieldsData = mandatoryFields.map((fieldName) => ({
          customerId: customer.id,
          fieldName,
        }));

        await prisma.mandatoryField.createMany({
          data: mandatoryFieldsData,
        });

        // Ambil data customer lengkap dengan mandatory fields
        return await prisma.master_customer.findUnique({
          where: { id: customer.id },
          include: {
            mandatoryFields: true,
          },
        });
      });

      // Tambahkan log untuk pembuatan customer
      await createLog(
        "CREATE_CUSTOMER",
        `Customer "${name}" berhasil dibuat dengan ${mandatoryFields.length} mandatory fields`,
        null,
        req.user?.id
      );

      res.status(201).json({
        status: "success",
        message: "Customer berhasil dibuat",
        data: result,
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
        include: {
          mandatoryFields: true,
        },
      });

      // Tambahkan log untuk mengambil semua customer
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
        where: { id: customerId },
        include: {
          mandatoryFields: true,
        },
      });
      if (!customer) {
        return res.status(404).json({
          status: "error",
          message: "Customer not found",
        });
      }

      // Tambahkan log untuk mengambil customer by ID
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
        where: { id: customerId },
      });

      if (!existingCustomer) {
        return res.status(404).json({
          status: "error",
          message: "Customer not found",
        });
      }

      // Validasi mandatory fields jika ada
      if (mandatoryFields) {
        if (!Array.isArray(mandatoryFields)) {
          return res.status(400).json({
            status: "error",
            message: "Mandatory fields must be an array",
          });
        }

        for (const field of mandatoryFields) {
          if (!VALID_COA_FIELDS.includes(field)) {
            return res.status(400).json({
              status: "error",
              message: `Invalid field name: ${field}`,
              validFields: VALID_COA_FIELDS,
            });
          }
        }
      }

      // Update dalam satu transaksi
      const result = await prisma.$transaction(async (prisma) => {
        // Update customer name jika ada
        const updateData = {};
        if (name) {
          updateData.name = name;
        }

        // Update mandatory fields jika ada
        if (mandatoryFields) {
          // Hapus semua mandatory fields yang ada
          await prisma.mandatoryField.deleteMany({
            where: { customerId },
          });

          // Buat mandatory fields baru
          const mandatoryFieldsData = mandatoryFields.map((fieldName) => ({
            customerId,
            fieldName,
          }));

          await prisma.mandatoryField.createMany({
            data: mandatoryFieldsData,
          });
        }

        // Ambil data customer lengkap dengan mandatory fields
        return await prisma.master_customer.findUnique({
          where: { id: customerId },
          include: {
            mandatoryFields: true,
          },
        });
      });

      // Tambahkan log untuk update customer
      await createLog(
        "UPDATE_CUSTOMER",
        `Customer dengan ID ${customerId} berhasil diupdate`,
        null,
        req.user?.id
      );

      res.status(200).json({
        status: "success",
        message: "Customer berhasil diupdate",
        data: result,
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

      if (!existingCustomer) {
        return res.status(404).json({
          status: "error",
          message: "Customer tidak ditemukan",
        });
      }

      const customer = await prisma.master_customer.delete({
        where: { id: parseInt(id) },
      });

      // Tambahkan log untuk delete customer
      await createLog(
        "DELETE_CUSTOMER",
        `Customer "${customer.name}" dengan ID ${id} berhasil dihapus`,
        null,
        req.user?.id
      );

      res.status(200).json({
        status: "success",
        message: "Customer berhasil dihapus",
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
        "productName",
        "lotNumber",
        "quantity",
        "letDownResin",
        "pelletLength",
        "pelletDimension",
        "pelletVisual",
        "color",
        "dispersibility",
        "mfr",
        "density",
        "moisture",
        "carbonContent",
        "mfgDate",
        "expiryDate",
        "analysisDate",
        "printedDate",
        "foreignMatter",
        "weightOfChips",
        "intrinsicViscosity",
        "ashContent",
        "heatStability",
        "lightFastness",
        "granule",
        "deltaE",
        "macaroni",
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
