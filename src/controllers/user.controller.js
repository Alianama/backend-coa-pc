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
      const { fullName, username, email, password, roleId } = req.body;
      const data = { fullName, username, email, roleId };
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
};

module.exports = userController;
