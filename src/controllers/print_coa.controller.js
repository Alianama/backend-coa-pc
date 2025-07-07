const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendMail } = require("../utils/email");

const APP_URL = process.env.APP_URL || "http://localhost:5173";

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

const printCoaController = {
  // Print COA dari Planning
  async print(req, res) {
    try {
      const { planningId } = req.params;
      const { quantity, remarks } = req.body;

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
          customer: true,
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

      // 9. Masukkan semua field dari planningDetail ke printData, tapi hanya yang ada di model print_coa
      // Daftar field valid print_coa (dari schema.prisma)
      const validPrintCoaFields = [
        "status",
        "planningId",
        "costumerName",
        "productId",
        "productName",
        "lotNumber",
        "quantity",
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
        "tintDeltaE",
        "colorDeltaE",
        "deltaP",
        "macaroni",
        "issueBy",
        "approvedBy",
        "approvedDate",
        "createdAt",
        "printedBy",
        "caCO3",
        "odor",
        "nucleatingAgent",
        "hals",
        "hiding",
        "isDeleted",
        "remarks",
        "rejectedBy",
        "rejectedDate",
      ];
      // Ambil semua field dari planningDetail yang cocok dengan print_coa
      const allDetailFields = {};
      Object.keys(planningDetail).forEach((key) => {
        if (validPrintCoaFields.includes(key)) {
          allDetailFields[key] = planningDetail[key];
        }
      });

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
        status: "REQUESTED",
        remarks: remarks,
        ...allDetailFields,
      };

      // 11. Buat print COA
      const newPrintedCoa = await prisma.print_coa.create({
        data: printData,
      });

      // Kirim email ke semua user role ADMIN
      const adminUsers = await prisma.user.findMany({
        where: {
          role: {
            name: "ADMIN",
          },
          isDeleted: false,
        },
        select: { email: true },
      });
      const adminEmails = adminUsers.map((u) => u.email).filter(Boolean);
      if (adminEmails.length > 0) {
        const html = `
          <h3>Notifikasi Permintaan Print COA Baru</h3>
          <p><b>User:</b> ${req.user.username}</p>
          <p><b>Customer:</b> ${planningHeader.customer.name}</p>
          <p><b>Product:</b> ${planningHeader.product.productName}</p>
          <p><b>Lot:</b> ${planningHeader.lotNumber}</p>
          <a href="${APP_URL}/print/preview/${newPrintedCoa.id}" style="display:inline-block;padding:10px 20px;background:#1976d2;color:#fff;text-decoration:none;border-radius:5px;margin-top:10px;">Lihat Detail COA</a>
        `;
        sendMail(
          adminEmails.join(","),
          "Notifikasi Print COA Baru",
          html
        ).catch(console.error);
      }

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
              { remarks: { contains: search } },
            ],
          },
        ],
      };

      // Tambahkan filter status jika ada
      if (status && ["REQUESTED", "APPROVED", "REJECTED"].includes(status)) {
        where.AND.push({ status: status });
      }

      // Hanya ambil field yang diminta
      const [printedCoas, total] = await Promise.all([
        prisma.print_coa.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { printedDate: "desc" },
          select: {
            id: true,
            costumerName: true,
            productName: true,
            lotNumber: true,
            quantity: true,
            approvedBy: true,
            rejectedBy: true,
            status: true,
            printedDate: true,
            remarks: true,
          },
        }),
        prisma.print_coa.count({ where }),
      ]);

      // Collect unique approvedBy and rejectedBy IDs
      const approvedByIds = [
        ...new Set(
          printedCoas
            .filter(
              (item) =>
                item.approvedBy !== null && item.approvedBy !== undefined
            )
            .map((item) => item.approvedBy)
        ),
      ];
      const rejectedByIds = [
        ...new Set(
          printedCoas
            .filter(
              (item) =>
                item.rejectedBy !== null && item.rejectedBy !== undefined
            )
            .map((item) => item.rejectedBy)
        ),
      ];

      // Merge all user IDs to fetch
      const allUserIds = [...new Set([...approvedByIds, ...rejectedByIds])];

      let userMap = {};
      if (allUserIds.length > 0) {
        const users = await prisma.user.findMany({
          where: { id: { in: allUserIds } },
          select: { id: true, fullName: true },
        });
        userMap = users.reduce((acc, user) => {
          acc[user.id] = user.fullName;
          return acc;
        }, {});
      }

      const data = printedCoas.map((item) => ({
        ...item,
        approvedByName: item.approvedBy
          ? userMap[item.approvedBy] || null
          : null,
        rejectedByName: item.rejectedBy
          ? userMap[item.rejectedBy] || null
          : null,
      }));

      res.json({
        status: "success",
        message: "Data COA yang di-print berhasil diambil",
        data,
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
      // 1. Ambil data print_coa tanpa filter status
      const printedCoa = await prisma.print_coa.findUnique({
        where: { id: parseInt(id), isDeleted: false },
      });

      if (!printedCoa) {
        return res.status(404).json({
          status: "error",
          message: "Data COA yang di-print tidak ditemukan",
        });
      }

      // 2. Ambil data planning_header (untuk customer & product)
      const planningHeader = await prisma.planning_header.findUnique({
        where: { id: printedCoa.planningId },
        include: {
          customer: true,
          product: true,
        },
      });
      if (!planningHeader) {
        return res.status(404).json({
          status: "error",
          message: "Planning Header tidak ditemukan",
        });
      }

      // 3. Ambil mandatory fields dari customer
      const customerMandatoryFields = Object.entries(planningHeader.customer)
        .filter(([key, value]) => value === true)
        .map(([key]) => key);

      // 4. Ambil standard product
      const productStandards = await prisma.product_standards.findMany({
        where: { product_id: planningHeader.idProduct, isDeleted: false },
      });

      // 5. Ambil user issuedBy dan approvedBy
      const [issuedUser, approvedUser] = await Promise.all([
        printedCoa.issueBy
          ? prisma.user.findFirst({
              where: { username: printedCoa.issueBy },
              select: { fullName: true },
            })
          : null,
        printedCoa.approvedBy
          ? prisma.user.findUnique({
              where: { id: printedCoa.approvedBy },
              select: { fullName: true },
            })
          : null,
      ]);

      // 6. Mapping operator ke simbol
      const operatorMap = {
        PLUS_MINUS: "±",
        LESS_THAN: "<",
        LESS_EQUAL: "≤",
        GREATER_THAN: ">",
        GREATER_EQUAL: "≥",
      };

      // 7. Bentuk testItems
      let testItems = [];
      // Cek jika pelletLength dan pelletDiameter ada di mandatory field
      const hasPelletLength = customerMandatoryFields.includes("pelletLength");
      const hasPelletDiameter =
        customerMandatoryFields.includes("pelletDiameter");
      let usedFields = [...customerMandatoryFields];
      if (hasPelletLength && hasPelletDiameter) {
        // Gabungkan keduanya
        // Ambil standard dan unit
        const stdL = productStandards.find(
          (s) => s.property_name === "pelletLength"
        );
        const stdD = productStandards.find(
          (s) => s.property_name === "pelletDiameter"
        );
        const to2 = (v) => (typeof v === "number" ? v.toFixed(2) : v);
        let unitL = stdL && stdL.unit ? stdL.unit : "";
        let unitD = stdD && stdD.unit ? stdD.unit : "";
        let opL = stdL ? operatorMap[stdL.operator] || stdL.operator : "";
        let opD = stdD ? operatorMap[stdD.operator] || stdD.operator : "";
        let toleranceL =
          stdL && stdL.tolerance !== undefined && stdL.tolerance !== null
            ? ` ${opL}${to2(stdL.tolerance)}${unitL}`
            : "";
        let toleranceD =
          stdD && stdD.tolerance !== undefined && stdD.tolerance !== null
            ? ` ${opD}${to2(stdD.tolerance)}${unitD}`
            : "";
        let stdStr = `${to2(stdL?.target_value)}${unitL} x ${to2(
          stdD?.target_value
        )}${unitD}${
          toleranceL || toleranceD
            ? " /" +
              toleranceL +
              (toleranceL && toleranceD ? " & " : "") +
              toleranceD
            : ""
        }`
          .replace(/\s+/g, " ")
          .trim();
        let resStr = "";
        let resL = printedCoa["pelletLength"];
        let resD = printedCoa["pelletDiameter"];
        if (typeof resL === "number") resL = resL.toFixed(2);
        if (typeof resD === "number") resD = resD.toFixed(2);
        if (unitL && resL !== undefined && resL !== null && resL !== "-")
          resL = `${resL} ${unitL}`;
        if (unitD && resD !== undefined && resD !== null && resD !== "-")
          resD = `${resD} ${unitD}`;
        resStr = `${resL || "-"} x ${resD || "-"}`;
        testItems.push({
          parameter: "Pellet Size L x D",
          standard: stdStr,
          result: resStr,
        });
        // Hapus dari usedFields agar tidak diulang di bawah
        usedFields = usedFields.filter(
          (f) => f !== "pelletLength" && f !== "pelletDiameter"
        );
      }
      // Sisanya proses seperti biasa
      testItems = [
        ...testItems,
        ...usedFields.map((field) => {
          const std = productStandards.find((s) => s.property_name === field);
          let standard = "-";
          let unit = std && std.unit ? std.unit : "";
          const to2 = (v) => (typeof v === "number" ? v.toFixed(2) : v);
          if (std) {
            const op = operatorMap[std.operator] || std.operator;
            let toleranceStr =
              std.tolerance !== undefined && std.tolerance !== null
                ? ` ${op}${to2(std.tolerance)}${unit}`
                : "";
            standard = `${to2(std.target_value)}${
              unit ? " " + unit : ""
            }${toleranceStr}`.trim();
          }
          let result = printedCoa[field];
          if (result instanceof Date) {
            result = result.toISOString().split("T")[0];
          }
          if (typeof result === "number") {
            result = result.toFixed(2);
          }
          if (
            unit &&
            result !== undefined &&
            result !== null &&
            result !== "-"
          ) {
            result = `${result} ${unit}`;
          } else if (result === undefined || result === null) {
            result = "-";
          }
          let paramLabel = field
            .replace(/([A-Z])/g, " $1")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
            .trim();
          paramLabel = paramLabel.replace(/Delta/gi, "Δ");
          return {
            parameter: paramLabel,
            standard,
            result,
          };
        }),
      ];

      // 8. Format response
      const response = {
        costumerName: printedCoa.costumerName,
        productName: printedCoa.productName,
        remarks: printedCoa.remarks,
        testItems,
        lotNumber: printedCoa.lotNumber,
        quantity: printedCoa.quantity,
        mfgDate: printedCoa.mfgDate,
        expiryDate: printedCoa.expiryDate,
        analysisDate: printedCoa.analysisDate,
        issuedBy: issuedUser ? issuedUser.fullName : printedCoa.issueBy,
        status: printedCoa.status,
        createdAt: printedCoa.createdAt,
        approvedBy: approvedUser ? approvedUser.fullName : null,
        resin: planningHeader.resin,
        moulding: planningHeader.moulding,
        letDownRatio: planningHeader.ratio,
      };

      res.json({
        status: "success",
        message: "Data COA yang di-print berhasil diambil",
        data: response,
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

      // Kirim email ke user issuedBy
      if (updated.issueBy) {
        const issuedUser = await prisma.user.findFirst({
          where: { username: updated.issueBy },
          select: { email: true },
        });
        if (issuedUser && issuedUser.email) {
          const html = `
            <h3>COA Anda Telah Di-Approve</h3>
            <p>COA yang Anda print untuk:</p>
            <ul>
              <li><b>Customer:</b> ${updated.costumerName}</li>
              <li><b>Product:</b> ${updated.productName}</li>
              <li><b>Lot:</b> ${updated.lotNumber}</li>
            </ul>
            <a href="${APP_URL}/print/preview/${updated.id}" style="display:inline-block;padding:10px 20px;background:#388e3c;color:#fff;text-decoration:none;border-radius:5px;margin-top:10px;">Lihat Detail COA</a>
          `;
          sendMail(issuedUser.email, "COA Anda Telah Di-Approve", html).catch(
            console.error
          );
        }
      }

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
          rejectedBy: req.user.id,
          rejectedDate: new Date(),
        },
      });

      // Kirim email ke user issuedBy
      if (updated.issueBy) {
        const issuedUser = await prisma.user.findFirst({
          where: { username: updated.issueBy },
          select: { email: true },
        });
        if (issuedUser && issuedUser.email) {
          const html = `
            <h3>COA Anda Di-Reject</h3>
            <p>COA yang Anda print untuk:</p>
            <ul>
              <li><b>Customer:</b> ${updated.costumerName}</li>
              <li><b>Product:</b> ${updated.productName}</li>
              <li><b>Lot:</b> ${updated.lotNumber}</li>
            </ul>
            <a href="${APP_URL}/print/preview/${updated.id}" style="display:inline-block;padding:10px 20px;background:#d32f2f;color:#fff;text-decoration:none;border-radius:5px;margin-top:10px;">Lihat Detail COA</a>
          `;
          sendMail(issuedUser.email, "COA Anda Di-Reject", html).catch(
            console.error
          );
        }
      }

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
