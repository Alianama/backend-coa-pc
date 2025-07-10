const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { generateTokens, verifyRefreshToken } = require("../utils/jwt");

const prisma = new PrismaClient();

const authController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { username },
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
        return res.status(401).json({
          status: "error",
          message: "Username atau password salah",
          data: null,
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: "error",
          message: "Username atau password salah",
          data: null,
        });
      }

      // Generate tokens pakai utils
      const { accessToken, refreshToken } = generateTokens(user);

      res.json({
        status: "success",
        message: "Login berhasil",
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
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        data: error,
      });
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          status: "error",
          message: "Refresh token diperlukan",
          data: null,
        });
      }

      let decoded;
      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch (error) {
        if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
            status: "error",
            message: "Token tidak valid",
            data: null,
          });
        }
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({
            status: "error",
            message: "Token sudah expired",
            data: null,
          });
        }
        return res.status(401).json({
          status: "error",
          message: "Refresh token tidak valid",
          data: null,
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        return res.status(401).json({
          status: "error",
          message: "Refresh token tidak valid",
          data: null,
        });
      }

      // Generate access token baru
      const { accessToken } = generateTokens(user);

      res.json({
        status: "success",
        message: "Token berhasil diperbarui",
        data: {
          accessToken,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat memperbarui token",
        data: error,
      });
    }
  },

  // Hapus fungsi createUser dan deleteUser

  async logout(req, res) {
    try {
      // Invalidate the token by incrementing the tokenVersion
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          tokenVersion: {
            increment: 1,
          },
        },
      });

      res.json({
        status: "success",
        message: "Logout berhasil",
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        data: error,
      });
    }
  },

  // Hapus fungsi getOwnProfile

  async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          username: true,
          email: true,
          role: {
            select: {
              id: true,
              name: true,
              permissions: {
                select: {
                  permission: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
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
      console.error("Error getting profile:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil profil",
        data: null,
      });
    }
  },

  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      const isValid = await bcrypt.compare(oldPassword, user.password);
      if (!isValid) {
        return res.status(400).json({
          status: "error",
          message: "Password lama salah",
          data: null,
        });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashed, tokenVersion: { increment: 1 } },
      });
      res.json({
        status: "success",
        message: "Password berhasil diubah, silakan login kembali.",
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengubah password",
        data: error,
      });
    }
  },
};

module.exports = authController;
