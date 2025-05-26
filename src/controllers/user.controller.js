const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
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
};

module.exports = userController;
