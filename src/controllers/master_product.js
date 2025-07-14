const { PrismaClient } = require("@prisma/client");
const { logCreate, logUpdate, logDelete } = require("../utils/logger");
const prisma = new PrismaClient();

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.master_product.findMany({
      where: { isDeleted: false },
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

    const product = await prisma.master_product.create({
      data: {
        ...productData,
        status: "draft",
        createdBy: req.user.id,
      },
    });

    // Log aktivitas create
    await logCreate(
      "master_products",
      req.user.id,
      req.user.username,
      product.id,
      productData,
      `Produk baru dibuat: ${product.productName}`
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
        isDeleted: false,
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
        productName: productData.productName,
        resin: productData.resin,
        letDownRatio: productData.letDownRatio,
        expiredAge: productData.expiredAge,
        status: productData.status,
        isDeleted: productData.isDeleted,
        updatedAt: new Date(),
      },
    });

    // Log aktivitas update
    await logUpdate(
      "master_products",
      req.user.id,
      req.user.username,
      productId,
      existingProduct,
      productData,
      `Produk diupdate: ${product.productName}`
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
        isDeleted: false,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Produk tidak ditemukan",
      });
    }

    // Soft delete
    const deletedProduct = await prisma.master_product.update({
      where: { id: productId },
      data: { isDeleted: true },
    });

    // Log aktivitas delete
    await logDelete(
      "master_products",
      req.user.id,
      req.user.username,
      productId,
      existingProduct,
      `Produk dihapus: ${deletedProduct.productName}`
    );

    res.status(200).json({
      status: "success",
      message: "Produk berhasil dihapus (soft delete)",
      data: deletedProduct,
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
