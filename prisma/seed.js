const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { ROLES } = require("../src/constants/roles");

const prisma = new PrismaClient();

async function main() {
  try {
    // Hapus data yang ada dengan urutan yang benar
    await prisma.user.deleteMany(); // Hapus user terlebih dahulu
    await prisma.rolePermission.deleteMany(); // Hapus role permission
    await prisma.permission.deleteMany(); // Hapus permission
    await prisma.role.deleteMany(); // Hapus role

    // Buat permissions
    const permissions = await Promise.all([
      prisma.permission.create({
        data: {
          name: "CREATE_COA",
          description: "Dapat membuat COA baru",
        },
      }),
      prisma.permission.create({
        data: {
          name: "READ_COA",
          description: "Dapat melihat COA",
        },
      }),
      prisma.permission.create({
        data: {
          name: "UPDATE_COA",
          description: "Dapat mengubah COA",
        },
      }),
      prisma.permission.create({
        data: {
          name: "DELETE_COA",
          description: "Dapat menghapus COA",
        },
      }),
      prisma.permission.create({
        data: {
          name: "APPROVE_COA",
          description: "Dapat menyetujui COA",
        },
      }),
      prisma.permission.create({
        data: {
          name: "MANAGE_USERS",
          description: "Dapat mengelola pengguna",
        },
      }),
      prisma.permission.create({
        data: {
          name: "MANAGE_ROLES",
          description: "Dapat mengelola peran",
        },
      }),
    ]);

    // Buat roles
    const superAdminRole = await prisma.role.create({
      data: {
        name: "SUPER_ADMIN",
        description: "Super Administrator dengan akses penuh",
        permissions: {
          create: permissions.map((permission) => ({
            permission: {
              connect: { id: permission.id },
            },
          })),
        },
      },
    });

    const adminRole = await prisma.role.create({
      data: {
        name: "ADMIN",
        description: "Administrator dengan akses terbatas",
        permissions: {
          create: permissions
            .filter((p) => p.name !== "MANAGE_ROLES")
            .map((permission) => ({
              permission: {
                connect: { id: permission.id },
              },
            })),
        },
      },
    });

    const userRole = await prisma.role.create({
      data: {
        name: "USER",
        description: "Pengguna biasa",
        permissions: {
          create: permissions
            .filter((p) => ["CREATE_COA", "READ_COA"].includes(p.name))
            .map((permission) => ({
              permission: {
                connect: { id: permission.id },
              },
            })),
        },
      },
    });

    // Buat user default
    const hashedPassword = await bcrypt.hash("123321", 10);
    const adminHashedPassword = await bcrypt.hash("admin123", 10);
    const userHashedPassword = await bcrypt.hash("user123", 10);

    // Buat Super Admin
    await prisma.user.create({
      data: {
        username: "superadmin",
        fullName: "Super Admin",
        email: "it@toyoink.co.id",
        password: hashedPassword,
        roleId: superAdminRole.id,
      },
    });

    // Buat Admin
    await prisma.user.create({
      data: {
        username: "admin",
        fullName: "Admin",
        email: "admin@example.com",
        password: adminHashedPassword,
        roleId: adminRole.id,
      },
    });

    // Buat User Biasa
    await prisma.user.create({
      data: {
        username: "user",
        fullName: "User",
        email: "user@example.com",
        password: userHashedPassword,
        roleId: userRole.id,
      },
    });

    console.log("Seed berhasil dijalankan!");
  } catch (error) {
    console.error("Error saat menjalankan seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
