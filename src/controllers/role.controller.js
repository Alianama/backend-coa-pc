const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const roleController = {
  // Get all roles
  async getAll(req, res) {
    try {
      const roles = await prisma.role.findMany({
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      res.json({
        status: "success",
        message: "Data role berhasil diambil",
        data: roles,
      });
    } catch (error) {
      console.error("Error fetching roles:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil data role" });
    }
  },

  // Create new role
  async create(req, res) {
    try {
      const { name, description, permissions } = req.body;

      const role = await prisma.role.create({
        data: {
          name,
          description,
          permissions: {
            create: permissions.map((permissionId) => ({
              permission: {
                connect: { id: permissionId },
              },
            })),
          },
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      res.status(201).json({
        status: "success",
        message: "Role berhasil dibuat",
        data: role,
      });
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat membuat role" });
    }
  },

  // Update role
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, permissions } = req.body;

      // Delete existing permissions
      await prisma.role_permission.deleteMany({
        where: { roleId: parseInt(id) },
      });

      const role = await prisma.role.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          permissions: {
            create: permissions.map((permissionId) => ({
              permission: {
                connect: { id: permissionId },
              },
            })),
          },
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      res.json({
        status: "success",
        message: "Role berhasil diperbarui",
        data: role,
      });
    } catch (error) {
      console.error("Error updating role:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat memperbarui role" });
    }
  },

  // Delete role
  async delete(req, res) {
    try {
      const { id } = req.params;

      await prisma.role.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        status: "success",
        message: "Role berhasil dihapus",
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menghapus role" });
    }
  },

  // Get all permissions
  async getAllPermissions(req, res) {
    try {
      const permissions = await prisma.permission.findMany();

      res.json({
        status: "success",
        message: "Data permission berhasil diambil",
        data: permissions,
      });
    } catch (error) {
      console.error("Error fetching permissions:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil data permission" });
    }
  },

  // Create new permission
  async createPermission(req, res) {
    try {
      const { name, description } = req.body;

      const permission = await prisma.permission.create({
        data: {
          name,
          description,
        },
      });

      res.status(201).json({
        message: "Permission berhasil dibuat",
        data: permission,
      });
    } catch (error) {
      console.error("Error creating permission:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat membuat permission" });
    }
  },

  // Update permission
  async updatePermission(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const permission = await prisma.permission.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
        },
      });

      res.json({
        message: "Permission berhasil diperbarui",
        data: permission,
      });
    } catch (error) {
      console.error("Error updating permission:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat memperbarui permission" });
    }
  },

  // Delete permission
  async deletePermission(req, res) {
    try {
      const { id } = req.params;

      await prisma.permission.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        message: "Permission berhasil dihapus",
      });
    } catch (error) {
      console.error("Error deleting permission:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menghapus permission" });
    }
  },

  // Get user roles
  async getUserRoles(req, res) {
    try {
      const users = await prisma.user.findMany({
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

      res.json({
        message: "Data role user berhasil diambil",
        data: users,
      });
    } catch (error) {
      console.error("Error fetching user roles:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil data role user" });
    }
  },

  // Update user role
  async updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { roleId } = req.body;

      const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          roleId: parseInt(roleId),
        },
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

      res.json({
        message: "Role user berhasil diperbarui",
        data: user,
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat memperbarui role user" });
    }
  },

  // Get role by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const role = await prisma.role.findUnique({
        where: { id: parseInt(id) },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.json({
        status: "success",
        message: "Data role berhasil diambil",
        data: role,
      });
    } catch (error) {
      console.error("Error fetching role by ID:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil data role" });
    }
  },
};

module.exports = roleController;
