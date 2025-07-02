const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyAccessToken } = require("../utils/jwt");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Akses ditolak",
        error: "Token tidak ditemukan",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Akses ditolak",
          error: "Token tidak valid",
        });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Akses ditolak",
          error: "Token sudah expired",
        });
      }
      return res.status(401).json({
        message: "Akses ditolak",
        error: "Token tidak valid",
      });
    }

    // Cek apakah user masih ada dan token version masih valid
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        message: "Akses ditolak",
        error: "Token tidak valid atau sudah expired",
      });
    }

    // Tambahkan data user ke request
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

module.exports = {
  verifyToken,
};
