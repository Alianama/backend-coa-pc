/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `restoredAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `restoredBy` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `mastercoa` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `master_coa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `mastercoa` DROP FOREIGN KEY `MasterCoa_approvedBy_fkey`;

-- DropForeignKey
ALTER TABLE `mastercoa` DROP FOREIGN KEY `MasterCoa_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `mastercoa` DROP FOREIGN KEY `MasterCoa_updatedBy_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_deletedBy_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_restoredBy_fkey`;

-- DropIndex
DROP INDEX `User_deletedBy_fkey` ON `user`;

-- DropIndex
DROP INDEX `User_restoredBy_fkey` ON `user`;

-- AlterTable
ALTER TABLE `master_coa` ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedBy`,
    DROP COLUMN `isActive`,
    DROP COLUMN `lastLogin`,
    DROP COLUMN `restoredAt`,
    DROP COLUMN `restoredBy`;

-- DropTable
DROP TABLE `mastercoa`;
