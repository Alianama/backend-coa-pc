const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        where: { isDeleted: false },
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
        },
      });

      res.json({
        status: "success",
        message: "Data user berhasil diambil",
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data user",
        error: error.message,
      });
    }
  },

  // Create a new user
  async create(req, res) {
    try {
      const { fullName, username, email, password, roleId } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          fullName,
          username,
          email,
          password: hashedPassword,
          roleId,
        },
        include: {
          role: true,
        },
      });
      res.status(201).json({
        status: "success",
        message: "User berhasil dibuat",
        data: user,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat membuat user",
        error: error.message,
      });
    }
  },

  async getAll(req, res) {
    try {
      const users = await prisma.user.findMany({
        where: { isDeleted: false },
        include: {
          role: true,
        },
      });
      res.json({
        status: "success",
        message: "Data user berhasil diambil",
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data user",
        error: error.message,
      });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          role: true,
        },
      });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User tidak ditemukan",
        });
      }
      res.json({
        status: "success",
        message: "Data user berhasil diambil",
        data: user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data user",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      let { fullName, username, email, password, roleId } = req.body;

      // Validasi input
      if (!fullName || !username || !email || !roleId) {
        return res.status(400).json({
          status: "error",
          message:
            "Semua field (fullName, username, email, roleId) wajib diisi",
          data: null,
        });
      }

      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "Format email tidak valid",
          data: null,
        });
      }

      // Cek user yang akan diupdate
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!existingUser) {
        return res.status(404).json({
          status: "error",
          message: "User tidak ditemukan",
          data: null,
        });
      }

      // Cek apakah username/email sudah digunakan user lain
      const duplicate = await prisma.user.findFirst({
        where: {
          OR: [
            { username, NOT: { id: parseInt(id) } },
            { email, NOT: { id: parseInt(id) } },
          ],
        },
      });
      if (duplicate) {
        return res.status(400).json({
          status: "error",
          message: "Username atau email sudah digunakan user lain",
          data: null,
        });
      }

      // Siapkan data update
      const data = {
        fullName,
        username,
        email,
        role: { connect: { id: parseInt(roleId) } },
      };

      if (password) {
        data.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data,
        include: {
          role: true,
        },
      });

      res.json({
        status: "success",
        message: "User berhasil diupdate",
        data: user,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengupdate user",
        error: error.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!user || user.isDeleted) {
        return res.status(404).json({
          status: "error",
          message: "User tidak ditemukan",
        });
      }
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: { isDeleted: true },
      });
      res.json({
        status: "success",
        message: "User berhasil dihapus (soft delete)",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menghapus user",
        error: error.message,
      });
    }
  },

  async createUser(req, res) {
    try {
      let { username, fullName, email, password, roleId } = req.body;
      roleId = parseInt(roleId);
      if (!username || !fullName || !email || !password || !roleId) {
        return res.status(400).json({
          status: "error",
          message: "Semua field wajib diisi",
          data: null,
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "Format email tidak valid",
          data: null,
        });
      }
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "Username atau email sudah digunakan",
          data: null,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          fullName,
          email,
          password: hashedPassword,
          role: { connect: { id: roleId } },
          tokenVersion: 0,
        },
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
          role: true,
        },
      });
      res.status(201).json({
        status: "success",
        message: "User berhasil dibuat",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: error,
        message: "Terjadi kesalahan pada server",
        data: null,
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      if (req.user.id === parseInt(id)) {
        return res.status(400).json({
          status: "error",
          message: "Tidak bisa menghapus user sendiri",
          data: null,
        });
      }
      await prisma.user.delete({ where: { id: parseInt(id) } });
      res.json({
        status: "success",
        message: "User berhasil dihapus",
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        status: error,
        message: "Gagal menghapus user",
        data: null,
      });
    }
  },

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
          status: "error",
          message: "User tidak ditemukan",
          data: null,
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
        message: "Profil berhasil diambil",
        data: transformedUser,
      });
    } catch (error) {
      console.error("Error getting own profile:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil profil",
        data: null,
      });
    }
  },

  async resetPassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      if (!newPassword) {
        return res.status(400).json({
          status: "error",
          message: "Password baru wajib diisi",
        });
      }
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User tidak ditemukan",
        });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: { password: hashed, tokenVersion: { increment: 1 } },
      });
      res.json({
        status: "success",
        message: "Password user berhasil direset. User harus login ulang.",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mereset password user",
        error: error.message,
      });
    }
  },
};

module.exports = userController;
