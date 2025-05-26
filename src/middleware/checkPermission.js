const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Ambil user beserta role dan permissions-nya
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      // Cek apakah user memiliki permission yang dibutuhkan
      const hasPermission = user.role.permissions.some(
        (rp) => rp.permission.name === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "Anda tidak memiliki akses untuk melakukan operasi ini",
        });
      }

      next();
    } catch (error) {
      console.error("Error checking permission:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengecek permission" });
    }
  };
};

module.exports = checkPermission;
