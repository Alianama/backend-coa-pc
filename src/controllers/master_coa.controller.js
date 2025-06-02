const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const masterCoaController = {
  // Create new COA
  async create(req, res) {
    try {
      const {
        costumerName,
        productName,
        letDownResin,
        lotNumber,
        quantity,
        pelletSize,
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
      } = req.body;

      // Validasi data wajib
      if (!costumerName || !productName || !lotNumber || !quantity) {
        return res.status(400).json({
          status: "error",
          message: "Data tidak lengkap",
          error:
            "costumerName, productName, lotNumber, dan quantity harus diisi",
        });
      }

      // Validasi format tanggal
      const dates = { mfgDate, expiryDate, analysisDate, printedDate };
      for (const [key, value] of Object.entries(dates)) {
        if (value && isNaN(new Date(value).getTime())) {
          return res.status(400).json({
            status: "error",
            message: "Format tanggal tidak valid",
            error: `Format tanggal ${key} tidak valid`,
          });
        }
      }

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

      const coa = await prisma.master_coa.create({
        data: {
          costumerName,
          productName,
          letDownResin: letDownResin || null,
          lotNumber,
          quantity: quantity.toString(),
          pelletSize: pelletSize || null,
          pelletVisual: pelletVisual || null,
          color: color || null,
          dispersibility: dispersibility || null,
          mfr: mfr || null,
          density: density || null,
          moisture: moisture || null,
          carbonContent: carbonContent || null,
          status: "draft",
          mfgDate: mfgDate ? new Date(mfgDate) : null,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          analysisDate: analysisDate ? new Date(analysisDate) : null,
          printedDate: printedDate ? new Date(printedDate) : null,
          foreignMatter: foreignMatter || null,
          weightOfChips: weightOfChips || null,
          intrinsicViscosity: intrinsicViscosity || null,
          ashContent: ashContent || null,
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
        },
      });

      // Transform dates to ISO string
      const transformedCoa = {
        ...coa,
        createdAt: coa.createdAt?.toISOString(),
        updatedAt: coa.updatedAt?.toISOString(),
        mfgDate: coa.mfgDate?.toISOString(),
        expiryDate: coa.expiryDate?.toISOString(),
        analysisDate: coa.analysisDate?.toISOString(),
        printedDate: coa.printedDate?.toISOString(),
      };

      res.status(201).json({
        status: "success",
        message: "COA berhasil dibuat",
        data: transformedCoa,
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
              { costumerName: { contains: search } },
              { productName: { contains: search } },
              { lotNumber: { contains: search } },
            ],
          }
        : {};

      statusFilter = {
        OR: [
          { createdBy: req.user.id },
          { status: { in: ["approved", "need_approval"] } },
        ],
      };

      const where = {
        ...baseFilter,
        ...statusFilter,
      };

      const [coas, total] = await Promise.all([
        prisma.master_coa.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: "desc" },
          include: {
            creator: {
              select: {
                username: true,
              },
            },
            approver: {
              select: {
                username: true,
              },
            },
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
      });
    }
  },

  // Get COA by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      // Validasi ID
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          status: "error",
          message: "ID tidak valid",
          error: "ID harus berupa angka",
        });
      }

      const coaId = parseInt(id);
      const coa = await prisma.master_coa.findUnique({
        where: {
          id: coaId,
        },
        include: {
          creator: {
            select: {
              username: true,
            },
          },
          approver: {
            select: {
              username: true,
            },
          },
        },
      });

      if (!coa) {
        return res.status(404).json({
          status: "error",
          message: "COA tidak ditemukan",
          error: `COA dengan ID ${coaId} tidak ditemukan`,
        });
      }

      // Transform dates to ISO string
      const transformedCoa = {
        ...coa,
        createdAt: coa.createdAt?.toISOString(),
        updatedAt: coa.updatedAt?.toISOString(),
        approvedDate: coa.approvedDate?.toISOString(),
        mfgDate: coa.mfgDate?.toISOString(),
        expiryDate: coa.expiryDate?.toISOString(),
        analysisDate: coa.analysisDate?.toISOString(),
        printedDate: coa.printedDate?.toISOString(),
      };

      res.json({
        status: "success",
        message: "Data COA berhasil diambil",
        data: transformedCoa,
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
        costumerName,
        productName,
        letDownResin,
        lotNumber,
        quantity,
        pelletSize,
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
      } = req.body;

      const coa = await prisma.master_coa.update({
        where: {
          id: parseInt(id),
        },
        data: {
          costumerName,
          productName,
          letDownResin,
          lotNumber,
          quantity: quantity.toString(),
          pelletSize,
          pelletVisual,
          color,
          dispersibility,
          mfr,
          density,
          moisture,
          carbonContent,
          mfgDate: new Date(mfgDate),
          expiryDate: new Date(expiryDate),
          analysisDate: new Date(analysisDate),
          printedDate: new Date(printedDate),
          foreignMatter,
          weightOfChips,
          intrinsicViscosity,
          ashContent,
        },
        include: {
          creator: {
            select: {
              username: true,
            },
          },
          approver: {
            select: {
              username: true,
            },
          },
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
      });
    }
  },

  // Soft Delete COA
  async delete(req, res) {
    try {
      const { id } = req.params;
      const existingCoa = await prisma.master_coa.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingCoa) {
        return res.status(404).json({ message: "COA tidak ditemukan" });
      }

      // Cek status COA
      if (existingCoa.status === "approved") {
        return res.status(403).json({
          status: "error",
          message: "COA has been Approved, Cant be Deleted!",
        });
      }

      // Buat record di deleted_coa
      await prisma.deleted_coa.create({
        data: {
          costumerName: existingCoa.costumerName,
          productName: existingCoa.productName,
          letDownResin: existingCoa.letDownResin,
          lotNumber: existingCoa.lotNumber,
          quantity: existingCoa.quantity,
          pelletSize: existingCoa.pelletSize,
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
          issueBy: existingCoa.issueBy,
          approvedBy: existingCoa.approvedBy,
          approvedDate: existingCoa.approvedDate,
          createdBy: existingCoa.createdBy,
          createdAt: existingCoa.createdAt,
          updatedAt: existingCoa.updatedAt,
          deletedBy: req.user.id,
          originalId: existingCoa.id,
        },
      });

      // Hapus COA asli
      await prisma.master_coa.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        status: "success",
        message: "COA berhasil dihapus",
      });
    } catch (error) {
      console.error("Error deleting COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menghapus COA",
      });
    }
  },

  // Get all deleted COAs
  async getDeleted(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        startDate,
        endDate,
        sortBy = "deletedAt",
        sortOrder = "desc",
      } = req.query;

      // Validasi parameter
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({
          message: "Parameter page tidak valid",
          error: "Page harus berupa angka positif",
        });
      }

      if (isNaN(limitNum) || limitNum < 1) {
        return res.status(400).json({
          message: "Parameter limit tidak valid",
          error: "Limit harus berupa angka positif",
        });
      }

      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      let where = {
        isRestored: false,
      };

      // Add search condition if search parameter exists
      if (search && search.trim() !== "") {
        where.OR = [
          { costumerName: { contains: search.trim(), mode: "insensitive" } },
          { productName: { contains: search.trim(), mode: "insensitive" } },
          { lotNumber: { contains: search.trim(), mode: "insensitive" } },
          { issueBy: { contains: search.trim(), mode: "insensitive" } },
        ];
      }

      // Add date range filter if provided
      if (startDate || endDate) {
        where.deletedAt = {};

        if (startDate) {
          const start = new Date(startDate + "T00:00:00.000Z");
          if (isNaN(start.getTime())) {
            return res.status(400).json({
              message: "Parameter startDate tidak valid",
              error: "Format tanggal tidak valid",
            });
          }
          where.deletedAt.gte = start;
        }

        if (endDate) {
          const end = new Date(endDate + "T23:59:59.999Z");
          if (isNaN(end.getTime())) {
            return res.status(400).json({
              message: "Parameter endDate tidak valid",
              error: "Format tanggal tidak valid",
            });
          }
          where.deletedAt.lte = end;
        }
      }

      // Validate sortBy field
      const allowedSortFields = [
        "deletedAt",
        "costumerName",
        "productName",
        "lotNumber",
        "issueBy",
        "createdAt",
        "updatedAt",
      ];
      const finalSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "deletedAt";
      const finalSortOrder = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

      // Get deleted COAs with pagination
      const [deletedCoas, total] = await Promise.all([
        prisma.deleted_coa.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: {
            [finalSortBy]: finalSortOrder,
          },
          include: {
            creator: {
              select: {
                username: true,
              },
            },
            approver: {
              select: {
                username: true,
              },
            },
            deleter: {
              select: {
                username: true,
              },
            },
            restorer: {
              select: {
                username: true,
              },
            },
          },
        }),
        prisma.deleted_coa.count({ where }),
      ]);

      // Transform data to include usernames and format dates
      const transformedData = deletedCoas.map((coa) => ({
        ...coa,
        creatorName: coa.creator?.username || "Unknown",
        approverName: coa.approver?.username || "Not Approved",
        deleterName: coa.deleter?.username || "Unknown",
        restorerName: coa.restorer?.username || null,
        // Format dates to ISO string
        createdAt: coa.createdAt?.toISOString() || null,
        updatedAt: coa.updatedAt?.toISOString() || null,
        deletedAt: coa.deletedAt?.toISOString() || null,
        restoredAt: coa.restoredAt?.toISOString() || null,
        approvedDate: coa.approvedDate?.toISOString() || null,
        mfgDate: coa.mfgDate?.toISOString() || null,
        expiryDate: coa.expiryDate?.toISOString() || null,
        analysisDate: coa.analysisDate?.toISOString() || null,
        printedDate: coa.printedDate?.toISOString() || null,
      }));

      res.json({
        message: "Data COA yang dihapus berhasil diambil",
        data: transformedData,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
        filters: {
          search: search.trim(),
          startDate,
          endDate,
          sortBy: finalSortBy,
          sortOrder: finalSortOrder,
        },
      });
    } catch (error) {
      console.error("Error fetching deleted COAs:", error);
      res.status(500).json({
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
        return res
          .status(404)
          .json({ message: "COA yang dihapus tidak ditemukan" });
      }

      if (deletedCoa.isRestored) {
        return res
          .status(400)
          .json({ message: "COA sudah dipulihkan sebelumnya" });
      }

      // Buat COA baru dari data yang dihapus
      await prisma.master_coa.create({
        data: {
          costumerName: deletedCoa.costumerName,
          productName: deletedCoa.productName,
          letDownResin: deletedCoa.letDownResin,
          lotNumber: deletedCoa.lotNumber,
          quantity: deletedCoa.quantity,
          pelletSize: deletedCoa.pelletSize,
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
          issueBy: deletedCoa.issueBy,
          approvedBy: deletedCoa.approvedBy,
          approvedDate: deletedCoa.approvedDate,
          createdBy: deletedCoa.createdBy,
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

      res.json({
        message: "COA berhasil dipulihkan",
      });
    } catch (error) {
      console.error("Error restoring COA:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat memulihkan COA" });
    }
  },

  // Permanent delete COA
  async permanentDelete(req, res) {
    try {
      const { id } = req.params;
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
      const coa = await prisma.master_coa.update({
        where: {
          id: parseInt(id),
        },
        data: {
          approvedBy: req.user.id,
          status: "approved",
          approvedDate: new Date(),
        },
      });

      res.json({
        status: "success",
        message: "COA berhasil disetujui",
        data: coa,
      });
    } catch (error) {
      console.error("Error approving COA:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menyetujui COA",
      });
    }
  },

  async requestApproval(req, res) {
    try {
      const { id } = req.params;

      // Cek apakah COA ada
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
