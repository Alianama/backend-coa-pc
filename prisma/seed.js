const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
// const { ROLES } = require("../src/constants/roles");

const prisma = new PrismaClient();

async function main() {
  try {
    // Hapus data dari tabel yang punya foreign key ke user dulu
    await prisma.report_log.deleteMany({});
    await prisma.log.deleteMany({});
    await prisma.planning_detail.deleteMany({});
    await prisma.planning_header.deleteMany({});
    await prisma.master_product.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role_permission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.log.deleteMany();
    await prisma.print_coa.deleteMany();
    await prisma.deleted_coa.deleteMany();
    await prisma.product_standards.deleteMany();
    await prisma.planning_detail.deleteMany();
    await prisma.planning_header.deleteMany();
    await prisma.master_customer.deleteMany();
    await prisma.master_product.deleteMany();

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
      prisma.permission.create({
        data: {
          name: "CREATE_CUSTOMER",
          description: "Dapat membuat customer baru",
        },
      }),
      prisma.permission.create({
        data: {
          name: "READ_CUSTOMER",
          description: "Dapat melihat data customer",
        },
      }),
      prisma.permission.create({
        data: {
          name: "UPDATE_CUSTOMER",
          description: "Dapat mengubah data customer",
        },
      }),
      prisma.permission.create({
        data: {
          name: "DELETE_CUSTOMER",
          description: "Dapat menghapus customer",
        },
      }),

      prisma.permission.create({
        data: {
          name: "READ_PRODUCT",
          description: "Dapat melihat data produk",
        },
      }),
      prisma.permission.create({
        data: {
          name: "CREATE_PRODUCT",
          description: "Dapat membuat produk baru",
        },
      }),
      prisma.permission.create({
        data: {
          name: "UPDATE_PRODUCT",
          description: "Dapat mengubah data produk",
        },
      }),
      prisma.permission.create({
        data: {
          name: "DELETE_PRODUCT",
          description: "Dapat menghapus produk",
        },
      }),
      prisma.permission.create({
        data: {
          name: "PRINT_COA",
          description: "Dapat print coa",
        },
      }),
      prisma.permission.create({
        data: {
          name: "DELETE_PRINT_COA",
          description: "Dapat print coa",
        },
      }),
      prisma.permission.create({
        data: {
          name: "READ_PRINT_COA",
          description: "Dapat read print coa",
        },
      }),
      prisma.permission.create({
        data: {
          name: "APPROVE_PRINT_COA",
          description: "Dapat read print coa",
        },
      }),
      prisma.permission.create({
        data: {
          name: "REJECT_PRINT_COA",
          description: "Dapat read print coa",
        },
      }),
      // Permission untuk planning_header
      prisma.permission.create({
        data: {
          name: "CREATE_PLANNING_HEADER",
          description: "Dapat membuat planning header",
        },
      }),
      prisma.permission.create({
        data: {
          name: "READ_PLANNING_HEADER",
          description: "Dapat melihat planning header",
        },
      }),
      prisma.permission.create({
        data: {
          name: "UPDATE_PLANNING_HEADER",
          description: "Dapat mengubah planning header",
        },
      }),
      prisma.permission.create({
        data: {
          name: "DELETE_PLANNING_HEADER",
          description: "Dapat menghapus planning header",
        },
      }),
      // Permission untuk planning_detail
      prisma.permission.create({
        data: {
          name: "CREATE_PLANNING_DETAIL",
          description: "Dapat membuat planning detail",
        },
      }),
      prisma.permission.create({
        data: {
          name: "READ_PLANNING_DETAIL",
          description: "Dapat melihat planning detail",
        },
      }),
      prisma.permission.create({
        data: {
          name: "UPDATE_PLANNING_DETAIL",
          description: "Dapat mengubah planning detail",
        },
      }),
      prisma.permission.create({
        data: {
          name: "DELETE_PLANNING_DETAIL",
          description: "Dapat menghapus planning detail",
        },
      }),
      prisma.permission.create({
        data: {
          name: "READ_REPORT",
          description: "Dapat read report",
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
            .filter((p) =>
              [
                "READ_CUSTOMER",
                "READ_PRODUCT",
                "PRINT_COA",
                "READ_PRINT_COA",
                "DELETE_PRINT_COA",
                "READ_PLANNING_HEADER",
                "CREATE_PLANNING_DETAIL",
                "READ_PLANNING_DETAIL",
                "UPDATE_PLANNING_DETAIL",
                "DELETE_PLANNING_DETAIL",
              ].includes(p.name)
            )
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
