const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createLog(action, description, userId) {
  try {
    const logData = {
      action,
      description,
      userId,
    };

    const log = await prisma.log.create({
      data: logData,
    });
    console.log(`Log created: ${action} - ${description}`);
    return log;
  } catch (error) {
    console.error("Error creating log:", error);
    return null;
  }
}

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.master_product.findMany({
      where: {
        status: "active",
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data produk berhasil diambil",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data produk",
      details: error.message,
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return res.status(400).json({
        status: "error",
        message: "ID produk tidak valid",
      });
    }

    const product = await prisma.master_product.findFirst({
      where: {
        id: productId,
        status: "active",
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Produk tidak ditemukan",
      });
    }

    await createLog(
      "GET_PRODUCT_BY_ID",
      `Berhasil mengambil data produk dengan ID ${productId}`,
      req.user?.id
    );

    res.status(200).json({
      status: "success",
      message: "Produk berhasil ditemukan",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data produk",
      details: error.message,
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  const productData = req.body;
  try {
    if (!productData.productName) {
      return res.status(400).json({
        status: "error",
        message: "Nama produk wajib diisi",
      });
    }

    // Validasi tipe data numerik
    const numericFields = [
      "pelletLength",
      "pelletHeight",
      "mfr",
      "density",
      "moisture",
      "carbonContent",
      "weightOfChips",
      "intrinsicViscosity",
      "ashContent",
      "heatStability",
      "lightFastness",
      "deltaE",
      "macaroni",
    ];

    for (const field of numericFields) {
      if (
        productData[field] !== undefined &&
        isNaN(parseFloat(productData[field]))
      ) {
        return res.status(400).json({
          status: "error",
          message: `Field ${field} harus berupa angka`,
        });
      }
    }

    const product = await prisma.master_product.create({
      data: {
        ...productData,
        status: "active",
        createdBy: req.user.id,
      },
    });

    await createLog(
      "CREATE_PRODUCT",
      `Produk "${product.productName}" berhasil dibuat`,
      req.user?.id
    );

    res.status(201).json({
      status: "success",
      message: "Produk berhasil dibuat",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal membuat produk",
      details: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  try {
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return res.status(400).json({
        status: "error",
        message: "ID produk tidak valid",
      });
    }

    const existingProduct = await prisma.master_product.findFirst({
      where: {
        id: productId,
        status: "active",
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Produk tidak ditemukan",
      });
    }

    // Validasi tipe data numerik
    const numericFields = [
      "pelletLength",
      "pelletHeight",
      "mfr",
      "density",
      "moisture",
      "carbonContent",
      "weightOfChips",
      "intrinsicViscosity",
      "ashContent",
      "heatStability",
      "lightFastness",
      "deltaE",
      "macaroni",
    ];

    for (const field of numericFields) {
      if (
        productData[field] !== undefined &&
        isNaN(parseFloat(productData[field]))
      ) {
        return res.status(400).json({
          status: "error",
          message: `Field ${field} harus berupa angka`,
        });
      }
    }

    const product = await prisma.master_product.update({
      where: { id: productId },
      data: {
        ...productData,
        updatedAt: new Date(),
      },
    });

    await createLog(
      "UPDATE_PRODUCT",
      `Produk "${product.productName}" dengan ID ${productId} berhasil diupdate`,
      req.user?.id
    );

    res.status(200).json({
      status: "success",
      message: "Produk berhasil diupdate",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengupdate produk",
      details: error.message,
    });
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return res.status(400).json({
        status: "error",
        message: "ID produk tidak valid",
      });
    }

    const existingProduct = await prisma.master_product.findFirst({
      where: {
        id: productId,
        status: "active",
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Produk tidak ditemukan",
      });
    }

    const product = await prisma.master_product.update({
      where: { id: productId },
      data: {
        status: "inactive",
        updatedAt: new Date(),
      },
    });

    await createLog(
      "DELETE_PRODUCT",
      `Produk "${product.productName}" dengan ID ${id} berhasil dihapus`,
      req.user?.id
    );

    res.status(200).json({
      status: "success",
      message: "Produk berhasil dihapus",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus produk",
      details: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
