const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fungsi helper untuk membuat log
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

const masterCoaController = {
  // Create new COA
  async create(req, res) {
    try {
      const coaData = Array.isArray(req.body) ? req.body : [req.body];
      const results = [];
      const errors = [];

      // Ambil data user yang sedang login
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { username: true },
      });

      if (!currentUser) {
        return res.status(404).json({
          status: "error",
          message: "User tidak ditemukan",
          error: "User yang sedang login tidak ditemukan",
        });
      }

      for (const data of coaData) {
        const {
          customerId,
          productName,
          letDownResin,
          lotNumber,
          quantity,
          pelletLength,
          pelletDimension,
          pelletVisual,
          color,
          dispersibility,
          mfr,
          density,
          moisture,
          carbonContent,
          mfgDate,
          expiryDate,
          analysisDate,
          printedDate,
          foreignMatter,
          weightOfChips,
          intrinsicViscosity,
          ashContent,
          heatStability,
          lightFastness,
          granule,
          deltaE,
          macaroni,
        } = data;

        // Validasi data wajib
        if (!customerId) {
          errors.push({
            data,
            error: "Customer Name harus diisi",
          });
          continue;
        }

        if (!productName) {
          errors.push({
            data,
            error: "Product Name harus diisi",
          });
          continue;
        }

        if (!lotNumber) {
          errors.push({
            data,
            error: "Lot Number harus diisi",
          });
          continue;
        }

        // Validasi customer exists
        const customer = await prisma.master_customer.findUnique({
          where: { id: parseInt(customerId) },
        });

        if (!customer) {
          errors.push({
            data,
            error: `Customer dengan ID ${customerId} tidak ditemukan`,
          });
          continue;
        }

        // Validasi format tanggal
        const dates = { mfgDate, expiryDate, analysisDate, printedDate };
        const dateErrors = [];

        for (const [key, value] of Object.entries(dates)) {
          if (value && isNaN(new Date(value).getTime())) {
            dateErrors.push(key);
          }
        }

        if (dateErrors.length > 0) {
          errors.push({
            data,
            error: `Format tanggal tidak valid untuk: ${dateErrors.join(", ")}`,
          });
          continue;
        }

        try {
          const coa = await prisma.master_coa.create({
            data: {
              customer: {
                connect: {
                  id: parseInt(customerId),
                },
              },
              costumerName: customer.name,
              productName,
              letDownResin: letDownResin || null,
              lotNumber,
              quantity: parseFloat(quantity) || null,
              pelletLength: parseFloat(pelletLength) || null,
              pelletDimension: parseFloat(pelletDimension) || null,
              pelletVisual:
                typeof pelletVisual === "boolean" ? pelletVisual : null,
              color: color || null,
              dispersibility: dispersibility || null,
              mfr: parseFloat(mfr) || null,
              density: parseFloat(density) || null,
              moisture: parseFloat(moisture) || null,
              carbonContent: parseFloat(carbonContent) || null,
              status: "need_approval",
              mfgDate: mfgDate ? new Date(mfgDate) : null,
              expiryDate: expiryDate ? new Date(expiryDate) : null,
              analysisDate: analysisDate ? new Date(analysisDate) : null,
              printedDate: printedDate ? new Date(printedDate) : null,
              foreignMatter: foreignMatter || null,
              weightOfChips: parseFloat(weightOfChips) || null,
              intrinsicViscosity: parseFloat(intrinsicViscosity) || null,
              ashContent: parseFloat(ashContent) || null,
              heatStability: parseFloat(heatStability) || null,
              lightFastness: parseFloat(lightFastness) || null,
              granule: granule || null,
              deltaE: parseFloat(deltaE) || null,
              macaroni: parseFloat(macaroni) || null,
              issueBy: currentUser.username,
              creator: {
                connect: {
                  id: req.user.id,
                },
              },
            },
            include: {
              creator: {
                select: {
                  username: true,
                },
              },
              customer: true,
            },
          });

          // Buat log untuk pembuatan COA
          await createLog(
            "create",
            `COA baru dibuat untuk ${coa.customer.name} - ${coa.productName} (Lot: ${coa.lotNumber})`,
            coa.id,
            req.user.id
          );

          results.push(coa);
        } catch (error) {
          errors.push({
            data,
            error: error.message,
          });
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          status: "error",
          message: errors[errors.length - 1].error,
          errors: errors,
          results: results.length > 0 ? results : undefined,
        });
      }

      res.status(201).json({
        status: "success",
        message: "COA berhasil dibuat",
        data: results,
      });
    } catch (error) {
      console.error("Error creating COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat membuat COA",
        error: error.message,
      });
    }
  },

  // Get all COAs with pagination and filters
  async getAll(req, res) {
    try {
      const { page = 1, limit = 100, search = "" } = req.query;
      const skip = (page - 1) * limit;

      const baseFilter = search
        ? {
            OR: [
              { productName: { contains: search } },
              { lotNumber: { contains: search } },
              { issueBy: { contains: search } },
              { customer: { name: { contains: search } } },
            ],
          }
        : {};

      const statusFilter = {
        OR: [
          { createdBy: req.user.id },
          { status: { in: ["approved", "need_approval"] } },
        ],
      };

      const where = {
        AND: [baseFilter, statusFilter],
      };

      const [coas, total] = await Promise.all([
        prisma.master_coa.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: "desc" },
          include: {
            creator: {
              select: { username: true },
            },
            approver: {
              select: { username: true },
            },
            customer: true,
          },
        }),
        prisma.master_coa.count({ where }),
      ]);

      res.json({
        status: "success",
        role: req.user.roleId,
        message: "Data COA berhasil diambil",
        data: coas,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching COAs:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data COA",
        error: error.message,
      });
    }
  },

  // Get COA by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const coa = await prisma.master_coa.findUnique({
        where: { id: parseInt(id) },
        include: {
          creator: {
            select: { username: true },
          },
          approver: {
            select: { username: true },
          },
          customer: true,
        },
      });

      if (!coa) {
        return res.status(404).json({
          status: "error",
          message: "COA tidak ditemukan",
        });
      }

      res.json({
        status: "success",
        message: "Data COA berhasil diambil",
        data: coa,
      });
    } catch (error) {
      console.error("Error fetching COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data COA",
        error: error.message,
      });
    }
  },

  // Update COA
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        customerId,
        productName,
        letDownResin,
        lotNumber,
        quantity,
        pelletLength,
        pelletDimension,
        pelletVisual,
        color,
        dispersibility,
        mfr,
        density,
        moisture,
        carbonContent,
        mfgDate,
        expiryDate,
        analysisDate,
        printedDate,
        foreignMatter,
        weightOfChips,
        intrinsicViscosity,
        ashContent,
        heatStability,
        lightFastness,
        granule,
        deltaE,
        macaroni,
      } = req.body;

      // Validasi customer exists jika customerId diupdate
      let customer = null;
      if (customerId) {
        customer = await prisma.master_customer.findUnique({
          where: { id: parseInt(customerId) },
        });

        if (!customer) {
          return res.status(404).json({
            status: "error",
            message: "Customer tidak ditemukan",
          });
        }
      }

      const updateData = {
        ...(customerId && {
          customer: { connect: { id: parseInt(customerId) } },
        }),
        ...(productName && { productName }),
        ...(letDownResin && { letDownResin }),
        ...(lotNumber && { lotNumber }),
        ...(quantity !== undefined && {
          quantity: parseFloat(quantity) || null,
        }),
        ...(pelletLength !== undefined && {
          pelletLength: parseFloat(pelletLength) || null,
        }),
        ...(pelletDimension !== undefined && {
          pelletDimension: parseFloat(pelletDimension) || null,
        }),
        ...(pelletVisual !== undefined && {
          pelletVisual: typeof pelletVisual === "boolean" ? pelletVisual : null,
        }),
        ...(color && { color }),
        ...(dispersibility && { dispersibility }),
        ...(mfr !== undefined && { mfr: parseFloat(mfr) || null }),
        ...(density !== undefined && { density: parseFloat(density) || null }),
        ...(moisture !== undefined && {
          moisture: parseFloat(moisture) || null,
        }),
        ...(carbonContent !== undefined && {
          carbonContent: parseFloat(carbonContent) || null,
        }),
        ...(mfgDate !== undefined && {
          mfgDate: mfgDate ? new Date(mfgDate) : null,
        }),
        ...(expiryDate !== undefined && {
          expiryDate: expiryDate ? new Date(expiryDate) : null,
        }),
        ...(analysisDate !== undefined && {
          analysisDate: analysisDate ? new Date(analysisDate) : null,
        }),
        ...(printedDate !== undefined && {
          printedDate: printedDate ? new Date(printedDate) : null,
        }),
        ...(foreignMatter !== undefined && { foreignMatter }),
        ...(weightOfChips !== undefined && {
          weightOfChips: parseFloat(weightOfChips) || null,
        }),
        ...(intrinsicViscosity !== undefined && {
          intrinsicViscosity: parseFloat(intrinsicViscosity) || null,
        }),
        ...(ashContent !== undefined && {
          ashContent: parseFloat(ashContent) || null,
        }),
        ...(heatStability !== undefined && {
          heatStability: parseFloat(heatStability) || null,
        }),
        ...(lightFastness !== undefined && {
          lightFastness: parseFloat(lightFastness) || null,
        }),
        ...(granule !== undefined && { granule: granule || null }),
        ...(deltaE !== undefined && { deltaE: parseFloat(deltaE) || null }),
        ...(macaroni !== undefined && {
          macaroni: parseFloat(macaroni) || null,
        }),
      };

      const coa = await prisma.master_coa.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          creator: { select: { username: true } },
          approver: { select: { username: true } },
          customer: true,
        },
      });

      res.json({
        status: "success",
        message: "COA berhasil diperbarui",
        data: coa,
      });
    } catch (error) {
      console.error("Error updating COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat memperbarui COA",
        error: error.message,
      });
    }
  },

  // Soft Delete COA
  async delete(req, res) {
    try {
      const { id } = req.params;
      const existingCoa = await prisma.master_coa.findUnique({
        where: { id: parseInt(id) },
        include: {
          customer: true,
        },
      });

      if (!existingCoa) {
        return res.status(404).json({
          status: "error",
          message: "COA tidak ditemukan",
        });
      }

      // Cek status COA
      if (existingCoa.status === "approved") {
        return res.status(403).json({
          status: "error",
          message: "COA yang sudah diapprove tidak dapat dihapus",
        });
      }

      // Cek apakah user adalah pembuat COA
      if (existingCoa.createdBy !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak memiliki akses untuk menghapus COA ini",
        });
      }

      // Cek apakah COA sudah pernah dihapus sebelumnya
      const existingDeletedCoa = await prisma.deleted_coa.findFirst({
        where: { originalId: existingCoa.id },
      });

      if (existingDeletedCoa) {
        return res.status(400).json({
          status: "error",
          message: "COA sudah pernah dihapus sebelumnya",
        });
      }

      // Buat log sebelum menghapus
      await createLog(
        "delete",
        `COA dihapus: ${existingCoa.costumerName} - ${existingCoa.productName} (Lot: ${existingCoa.lotNumber})`,
        existingCoa.id,
        req.user.id
      );

      // Buat salinan COA di tabel deleted_coa
      await prisma.deleted_coa.create({
        data: {
          costumerName: existingCoa.costumerName,
          productName: existingCoa.productName,
          lotNumber: existingCoa.lotNumber,
          quantity: existingCoa.quantity,
          letDownResin: existingCoa.letDownResin,
          pelletLength: existingCoa.pelletLength,
          pelletDimension: existingCoa.pelletDimension,
          pelletVisual: existingCoa.pelletVisual,
          color: existingCoa.color,
          dispersibility: existingCoa.dispersibility,
          mfr: existingCoa.mfr,
          density: existingCoa.density,
          moisture: existingCoa.moisture,
          carbonContent: existingCoa.carbonContent,
          mfgDate: existingCoa.mfgDate,
          expiryDate: existingCoa.expiryDate,
          analysisDate: existingCoa.analysisDate,
          printedDate: existingCoa.printedDate,
          foreignMatter: existingCoa.foreignMatter,
          weightOfChips: existingCoa.weightOfChips,
          intrinsicViscosity: existingCoa.intrinsicViscosity,
          ashContent: existingCoa.ashContent,
          heatStability: existingCoa.heatStability,
          lightFastness: existingCoa.lightFastness,
          granule: existingCoa.granule,
          deltaE: existingCoa.deltaE,
          macaroni: existingCoa.macaroni,
          issueBy: existingCoa.issueBy,
          createdAt: existingCoa.createdAt,
          updatedAt: existingCoa.updatedAt,
          originalId: existingCoa.id,
          creator: {
            connect: {
              id: existingCoa.createdBy,
            },
          },
          deleter: {
            connect: {
              id: req.user.id,
            },
          },
          approver: existingCoa.approvedBy
            ? {
                connect: {
                  id: existingCoa.approvedBy,
                },
              }
            : undefined,
          isRestored: false,
          deletedAt: new Date(),
        },
      });

      // Hapus COA asli
      await prisma.master_coa.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        status: "success",
        message: "COA berhasil dihapus",
        data: {
          id: existingCoa.id,
          costumerName: existingCoa.costumerName,
          productName: existingCoa.productName,
          lotNumber: existingCoa.lotNumber,
        },
      });
    } catch (error) {
      console.error("Error deleting COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menghapus COA",
        error: error.message,
      });
    }
  },

  // Get all deleted COAs
  async getDeleted(req, res) {
    try {
      const { page = 1, limit = 100, search = "" } = req.query;
      const skip = (page - 1) * limit;

      const baseFilter = search
        ? {
            OR: [
              { costumerName: { contains: search } },
              { productName: { contains: search } },
              { lotNumber: { contains: search } },
              { issueBy: { contains: search } },
            ],
          }
        : {};

      const where = {
        ...baseFilter,
        isRestored: false,
      };

      const [deletedCoas, total] = await Promise.all([
        prisma.deleted_coa.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { deletedAt: "desc" },
          include: {
            creator: {
              select: { username: true },
            },
            approver: {
              select: { username: true },
            },
            deleter: {
              select: { username: true },
            },
            restorer: {
              select: { username: true },
            },
          },
        }),
        prisma.deleted_coa.count({ where }),
      ]);

      res.json({
        status: "success",
        message: "Data COA yang dihapus berhasil diambil",
        data: deletedCoas,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching deleted COAs:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data COA yang dihapus",
        error: error.message,
      });
    }
  },

  // Restore deleted COA
  async restore(req, res) {
    try {
      const { id } = req.params;
      const deletedCoa = await prisma.deleted_coa.findUnique({
        where: { id: parseInt(id) },
      });

      if (!deletedCoa) {
        return res.status(404).json({
          status: "error",
          message: "COA yang dihapus tidak ditemukan",
        });
      }

      if (deletedCoa.isRestored) {
        return res.status(400).json({
          status: "error",
          message: "COA sudah dipulihkan sebelumnya",
        });
      }

      // Cari customer berdasarkan nama
      const customer = await prisma.master_customer.findFirst({
        where: { name: deletedCoa.costumerName },
      });

      // Buat COA baru dari data yang dihapus
      const restoredCoa = await prisma.master_coa.create({
        data: {
          customer: customer
            ? {
                connect: {
                  id: customer.id,
                },
              }
            : undefined,
          costumerName: deletedCoa.costumerName,
          productName: deletedCoa.productName,
          letDownResin: deletedCoa.letDownResin,
          lotNumber: deletedCoa.lotNumber,
          quantity: deletedCoa.quantity,
          pelletLength: deletedCoa.pelletLength,
          pelletDimension: deletedCoa.pelletDimension,
          pelletVisual: deletedCoa.pelletVisual,
          color: deletedCoa.color,
          dispersibility: deletedCoa.dispersibility,
          mfr: deletedCoa.mfr,
          density: deletedCoa.density,
          moisture: deletedCoa.moisture,
          carbonContent: deletedCoa.carbonContent,
          mfgDate: deletedCoa.mfgDate,
          expiryDate: deletedCoa.expiryDate,
          analysisDate: deletedCoa.analysisDate,
          printedDate: deletedCoa.printedDate,
          foreignMatter: deletedCoa.foreignMatter,
          weightOfChips: deletedCoa.weightOfChips,
          intrinsicViscosity: deletedCoa.intrinsicViscosity,
          ashContent: deletedCoa.ashContent,
          heatStability: deletedCoa.heatStability,
          lightFastness: deletedCoa.lightFastness,
          granule: deletedCoa.granule,
          deltaE: deletedCoa.deltaE,
          macaroni: deletedCoa.macaroni,
          issueBy: deletedCoa.issueBy,
          approvedBy: deletedCoa.approvedBy,
          approvedDate: deletedCoa.approvedDate,
          createdBy: deletedCoa.createdBy,
          status: "draft",
        },
        include: {
          customer: {
            include: {
              mandatoryFields: true,
            },
          },
        },
      });

      // Update status deleted_coa
      await prisma.deleted_coa.update({
        where: { id: parseInt(id) },
        data: {
          isRestored: true,
          restoredAt: new Date(),
          restoredBy: req.user.id,
        },
      });

      // Buat log untuk restore COA
      await createLog(
        "restore",
        `COA dipulihkan: ${restoredCoa.costumerName} - ${restoredCoa.productName} (Lot: ${restoredCoa.lotNumber})`,
        restoredCoa.id,
        req.user.id
      );

      res.json({
        status: "success",
        message: "COA berhasil dipulihkan",
        data: restoredCoa,
      });
    } catch (error) {
      console.error("Error restoring COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat memulihkan COA",
        error: error.message,
      });
    }
  },

  // Permanent delete COA
  async permanentDelete(req, res) {
    try {
      const { id } = req.params;
      const deletedCoa = await prisma.deleted_coa.findUnique({
        where: { id: parseInt(id) },
      });

      if (!deletedCoa) {
        return res.status(404).json({
          message: "COA yang dihapus tidak ditemukan",
        });
      }

      // Buat log sebelum menghapus permanen
      await createLog(
        "permanent_delete",
        `COA dihapus permanen: ${deletedCoa.costumerName} - ${deletedCoa.productName} (Lot: ${deletedCoa.lotNumber})`,
        null, // Tidak perlu coaId karena COA sudah dihapus
        req.user.id
      );

      await prisma.deleted_coa.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        message: "COA berhasil dihapus secara permanen",
      });
    } catch (error) {
      console.error("Error permanently deleting COA:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat menghapus COA secara permanen",
      });
    }
  },

  // Approve COA
  async approve(req, res) {
    try {
      const { id } = req.params;
      const coa = await prisma.master_coa.findUnique({
        where: { id: parseInt(id) },
        include: {
          customer: true,
        },
      });

      if (!coa) {
        return res.status(404).json({
          status: "error",
          message: "COA tidak ditemukan",
        });
      }

      if (coa.status === "approved") {
        return res.status(400).json({
          status: "error",
          message: "COA sudah diapprove sebelumnya",
        });
      }

      const approvedCoa = await prisma.master_coa.update({
        where: { id: parseInt(id) },
        data: {
          status: "approved",
          approvedBy: req.user.id,
          approvedDate: new Date(),
        },
        include: {
          creator: {
            select: { username: true },
          },
          approver: {
            select: { username: true },
          },
          customer: {
            include: {
              mandatoryFields: true,
            },
          },
        },
      });

      // Buat log untuk approval COA
      await createLog(
        "approve",
        `COA diapprove untuk ${coa.costumerName} - ${coa.productName} (Lot: ${coa.lotNumber})`,
        coa.id,
        req.user.id
      );

      res.json({
        status: "success",
        message: "COA berhasil diapprove",
        data: approvedCoa,
      });
    } catch (error) {
      console.error("Error approving COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat approve COA",
        error: error.message,
      });
    }
  },

  async requestApproval(req, res) {
    try {
      const { id } = req.params;
      const existingCoa = await prisma.master_coa.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingCoa) {
        return res.status(404).json({
          status: "error",
          message: "COA tidak ditemukan",
        });
      }

      // Cek apakah user adalah pembuat COA
      if (existingCoa.createdBy !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message:
            "Hanya pembuat COA yang dapat mengirim permintaan persetujuan",
        });
      }

      // Cek status COA
      if (existingCoa.status === "need_approval") {
        return res.status(400).json({
          status: "error",
          message: "COA sudah dalam status menunggu persetujuan",
        });
      }

      const coa = await prisma.master_coa.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status: "need_approval",
        },
      });

      // Buat log untuk permintaan persetujuan COA
      await createLog(
        "request_approval",
        `Permintaan persetujuan COA: ${coa.costumerName} - ${coa.productName} (Lot: ${coa.lotNumber})`,
        coa.id,
        req.user.id
      );

      res.json({
        status: "success",
        message: "Permintaan persetujuan COA berhasil dikirim",
        data: coa,
      });
    } catch (error) {
      console.error("Error requesting COA approval:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengirim permintaan persetujuan COA",
      });
    }
  },
};

module.exports = masterCoaController;
