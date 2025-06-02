const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
// const { generateTokens, verifyRefreshToken } = require("../utils/jwt");
const { ROLES } = require("../constants/roles");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const authController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Username atau password salah" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ message: "Username atau password salah" });
      }

      const accessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
          tokenVersion: user.tokenVersion,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        {
          id: user.id,
          tokenVersion: user.tokenVersion,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "success",
        data: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token diperlukan" });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        return res.status(401).json({ message: "Refresh token tidak valid" });
      }

      const accessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          tokenVersion: user.tokenVersion,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        status: "success",
        message: "Token berhasil diperbarui",
        data: {
          accessToken,
        },
      });
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Token tidak valid" });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token sudah expired" });
      }
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat memperbarui token" });
    }
  },

  async createUser(req, res) {
    try {
      const { username, fullName, email, password, role } = req.body;
      const adminRole = req.user.role;

      // Hanya SUPER_ADMIN yang bisa membuat ADMIN
      if (role === ROLES.ADMIN && adminRole !== ROLES.SUPER_ADMIN) {
        return res
          .status(403)
          .json({ message: "Anda tidak memiliki akses untuk membuat admin" });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username atau email sudah digunakan" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          fullName,
          email,
          password: hashedPassword,
          role: role || ROLES.USER,
          tokenVersion: 0,
        },
      });

      res.status(201).json({
        message: "User berhasil dibuat",
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },

  async logout(req, res) {
    try {
      const userId = req.user.id;

      // Increment tokenVersion untuk invalidate semua refresh token
      await prisma.user.update({
        where: { id: userId },
        data: { tokenVersion: { increment: 1 } },
      });

      res.json({ message: "Logout berhasil" });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },

  // Get own profile
  async getOwnProfile(req, res) {
    try {
      // Ambil data user dari token yang sudah diverifikasi di middleware
      const { id } = req.user;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User tidak ditemukan",
          error: "User tidak ditemukan dalam sistem",
        });
      }

      // Transform dates to ISO string
      const transformedUser = {
        ...user,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
        lastLogin: user.lastLogin?.toISOString(),
      };

      res.json({
        status: "success",
        data: transformedUser,
      });
    } catch (error) {
      console.error("Error getting own profile:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil profil",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
