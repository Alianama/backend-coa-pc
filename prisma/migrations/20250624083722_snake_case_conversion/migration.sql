/*
  Warnings:

  - You are about to drop the column `analysisDate` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `approvedDate` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `ashContent` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `carbonContent` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `costumerName` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `deltaE` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `foreignMatter` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `heatStability` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `intrinsicViscosity` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `isRestored` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `issueBy` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `letDownRatio` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `lightFastness` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `lotNumber` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `mfgDate` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `originalId` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pelletHeight` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pelletLength` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pelletVisual` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `printedDate` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `restoredAt` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `restoredBy` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `weightOfChips` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `coaId` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `analysisDate` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `approvedDate` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `ashContent` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `carbonContent` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `costumerName` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `deltaE` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `foreignMatter` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `heatStability` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `intrinsicViscosity` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `issueBy` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `letDownRatio` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `lightFastness` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `lotNumber` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `mfgDate` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pelletHeight` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pelletLength` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pelletVisual` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `printedDate` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `weightOfChips` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `analysisDate` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `approvedDate` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `ashContent` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `carbonContent` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `costumerName` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `deltaE` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `foreignMatter` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `heatStability` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `intrinsicViscosity` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `issueBy` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `letDownRatio` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `lightFastness` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `lotNumber` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `mfgDate` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pelletDiameter` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pelletLength` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pelletVisual` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `planningId` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `printedBy` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `printedDate` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the column `weightOfChips` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the `mandatoryfield` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planningdetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planningheader` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rolepermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[original_id]` on the table `deleted_coa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `costumer_name` to the `deleted_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lot_number` to the `deleted_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_id` to the `deleted_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `deleted_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costumer_name` to the `master_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `master_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lot_number` to the `master_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `master_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `master_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `master_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costumer_name` to the `print_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lot_number` to the `print_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `print_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `print_coa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `deleted_coa` DROP FOREIGN KEY `deleted_coa_approvedBy_fkey`;

-- DropForeignKey
ALTER TABLE `deleted_coa` DROP FOREIGN KEY `deleted_coa_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `deleted_coa` DROP FOREIGN KEY `deleted_coa_deletedBy_fkey`;

-- DropForeignKey
ALTER TABLE `deleted_coa` DROP FOREIGN KEY `deleted_coa_restoredBy_fkey`;

-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `logs_coaId_fkey`;

-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `logs_userId_fkey`;

-- DropForeignKey
ALTER TABLE `mandatoryfield` DROP FOREIGN KEY `MandatoryField_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `master_coa` DROP FOREIGN KEY `master_coa_approvedBy_fkey`;

-- DropForeignKey
ALTER TABLE `master_coa` DROP FOREIGN KEY `master_coa_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `master_coa` DROP FOREIGN KEY `master_coa_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `master_coa` DROP FOREIGN KEY `master_coa_productId_fkey`;

-- DropForeignKey
ALTER TABLE `master_product` DROP FOREIGN KEY `master_product_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `planningdetail` DROP FOREIGN KEY `PlanningDetail_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `planningdetail` DROP FOREIGN KEY `PlanningDetail_idPlanning_fkey`;

-- DropForeignKey
ALTER TABLE `planningheader` DROP FOREIGN KEY `planningHeader_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `planningheader` DROP FOREIGN KEY `planningHeader_idCustomer_fkey`;

-- DropForeignKey
ALTER TABLE `planningheader` DROP FOREIGN KEY `planningHeader_idProduct_fkey`;

-- DropForeignKey
ALTER TABLE `print_coa` DROP FOREIGN KEY `print_coa_printedBy_fkey`;

-- DropForeignKey
ALTER TABLE `product_standards` DROP FOREIGN KEY `product_standards_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_roleId_fkey`;

-- DropIndex
DROP INDEX `deleted_coa_approvedBy_fkey` ON `deleted_coa`;

-- DropIndex
DROP INDEX `deleted_coa_createdBy_fkey` ON `deleted_coa`;

-- DropIndex
DROP INDEX `deleted_coa_deletedBy_fkey` ON `deleted_coa`;

-- DropIndex
DROP INDEX `deleted_coa_originalId_key` ON `deleted_coa`;

-- DropIndex
DROP INDEX `deleted_coa_restoredBy_fkey` ON `deleted_coa`;

-- DropIndex
DROP INDEX `logs_coaId_fkey` ON `logs`;

-- DropIndex
DROP INDEX `logs_userId_fkey` ON `logs`;

-- DropIndex
DROP INDEX `master_coa_approvedBy_fkey` ON `master_coa`;

-- DropIndex
DROP INDEX `master_coa_createdBy_fkey` ON `master_coa`;

-- DropIndex
DROP INDEX `master_coa_customerId_fkey` ON `master_coa`;

-- DropIndex
DROP INDEX `master_coa_productId_fkey` ON `master_coa`;

-- DropIndex
DROP INDEX `print_coa_printedBy_fkey` ON `print_coa`;

-- DropIndex
DROP INDEX `product_standards_product_id_fkey` ON `product_standards`;

-- AlterTable
ALTER TABLE `deleted_coa` DROP COLUMN `analysisDate`,
    DROP COLUMN `approvedBy`,
    DROP COLUMN `approvedDate`,
    DROP COLUMN `ashContent`,
    DROP COLUMN `carbonContent`,
    DROP COLUMN `costumerName`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `createdBy`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedBy`,
    DROP COLUMN `deltaE`,
    DROP COLUMN `expiryDate`,
    DROP COLUMN `foreignMatter`,
    DROP COLUMN `heatStability`,
    DROP COLUMN `intrinsicViscosity`,
    DROP COLUMN `isRestored`,
    DROP COLUMN `issueBy`,
    DROP COLUMN `letDownRatio`,
    DROP COLUMN `lightFastness`,
    DROP COLUMN `lotNumber`,
    DROP COLUMN `mfgDate`,
    DROP COLUMN `originalId`,
    DROP COLUMN `pelletHeight`,
    DROP COLUMN `pelletLength`,
    DROP COLUMN `pelletVisual`,
    DROP COLUMN `printedDate`,
    DROP COLUMN `productName`,
    DROP COLUMN `restoredAt`,
    DROP COLUMN `restoredBy`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `weightOfChips`,
    ADD COLUMN `analysis_date` DATETIME(3) NULL,
    ADD COLUMN `approved_by` INTEGER NULL,
    ADD COLUMN `approved_date` DATETIME(3) NULL,
    ADD COLUMN `ash_content` DOUBLE NULL,
    ADD COLUMN `carbon_content` DOUBLE NULL,
    ADD COLUMN `costumer_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NULL,
    ADD COLUMN `created_by` INTEGER NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_by` INTEGER NULL,
    ADD COLUMN `delta_e` DOUBLE NULL,
    ADD COLUMN `expiry_date` DATETIME(3) NULL,
    ADD COLUMN `foreign_matter` VARCHAR(191) NULL,
    ADD COLUMN `heat_stability` DOUBLE NULL,
    ADD COLUMN `intrinsic_viscosity` DOUBLE NULL,
    ADD COLUMN `is_restored` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `issue_by` VARCHAR(191) NULL,
    ADD COLUMN `let_down_ratio` VARCHAR(191) NULL,
    ADD COLUMN `light_fastness` DOUBLE NULL,
    ADD COLUMN `lot_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `mfg_date` DATETIME(3) NULL,
    ADD COLUMN `original_id` INTEGER NOT NULL,
    ADD COLUMN `pellet_height` DOUBLE NULL,
    ADD COLUMN `pellet_length` DOUBLE NULL,
    ADD COLUMN `pellet_visual` BOOLEAN NULL,
    ADD COLUMN `printed_date` DATETIME(3) NULL,
    ADD COLUMN `product_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `restored_at` DATETIME(3) NULL,
    ADD COLUMN `restored_by` INTEGER NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL,
    ADD COLUMN `weight_of_chips` DOUBLE NULL;

-- AlterTable
ALTER TABLE `logs` DROP COLUMN `coaId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `coa_id` INTEGER NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `master_coa` DROP COLUMN `analysisDate`,
    DROP COLUMN `approvedBy`,
    DROP COLUMN `approvedDate`,
    DROP COLUMN `ashContent`,
    DROP COLUMN `carbonContent`,
    DROP COLUMN `costumerName`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `createdBy`,
    DROP COLUMN `customerId`,
    DROP COLUMN `deltaE`,
    DROP COLUMN `expiryDate`,
    DROP COLUMN `foreignMatter`,
    DROP COLUMN `heatStability`,
    DROP COLUMN `intrinsicViscosity`,
    DROP COLUMN `issueBy`,
    DROP COLUMN `letDownRatio`,
    DROP COLUMN `lightFastness`,
    DROP COLUMN `lotNumber`,
    DROP COLUMN `mfgDate`,
    DROP COLUMN `pelletHeight`,
    DROP COLUMN `pelletLength`,
    DROP COLUMN `pelletVisual`,
    DROP COLUMN `printedDate`,
    DROP COLUMN `productId`,
    DROP COLUMN `productName`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `weightOfChips`,
    ADD COLUMN `analysis_date` DATETIME(3) NULL,
    ADD COLUMN `approved_by` INTEGER NULL,
    ADD COLUMN `approved_date` DATETIME(3) NULL,
    ADD COLUMN `ash_content` DOUBLE NULL,
    ADD COLUMN `carbon_content` DOUBLE NULL,
    ADD COLUMN `costumer_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by` INTEGER NOT NULL,
    ADD COLUMN `customer_id` INTEGER NULL,
    ADD COLUMN `delta_e` DOUBLE NULL,
    ADD COLUMN `expiry_date` DATETIME(3) NULL,
    ADD COLUMN `foreign_matter` VARCHAR(191) NULL,
    ADD COLUMN `heat_stability` DOUBLE NULL,
    ADD COLUMN `intrinsic_viscosity` DOUBLE NULL,
    ADD COLUMN `issue_by` VARCHAR(191) NULL,
    ADD COLUMN `let_down_ratio` VARCHAR(191) NULL,
    ADD COLUMN `light_fastness` DOUBLE NULL,
    ADD COLUMN `lot_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `mfg_date` DATETIME(3) NULL,
    ADD COLUMN `pellet_height` DOUBLE NULL,
    ADD COLUMN `pellet_length` DOUBLE NULL,
    ADD COLUMN `pellet_visual` BOOLEAN NULL,
    ADD COLUMN `printed_date` DATETIME(3) NULL,
    ADD COLUMN `product_id` INTEGER NOT NULL,
    ADD COLUMN `product_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `weight_of_chips` DOUBLE NULL;

-- AlterTable
ALTER TABLE `print_coa` DROP COLUMN `analysisDate`,
    DROP COLUMN `approvedBy`,
    DROP COLUMN `approvedDate`,
    DROP COLUMN `ashContent`,
    DROP COLUMN `carbonContent`,
    DROP COLUMN `costumerName`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `deltaE`,
    DROP COLUMN `expiryDate`,
    DROP COLUMN `foreignMatter`,
    DROP COLUMN `heatStability`,
    DROP COLUMN `intrinsicViscosity`,
    DROP COLUMN `issueBy`,
    DROP COLUMN `letDownRatio`,
    DROP COLUMN `lightFastness`,
    DROP COLUMN `lotNumber`,
    DROP COLUMN `mfgDate`,
    DROP COLUMN `pelletDiameter`,
    DROP COLUMN `pelletLength`,
    DROP COLUMN `pelletVisual`,
    DROP COLUMN `planningId`,
    DROP COLUMN `printedBy`,
    DROP COLUMN `printedDate`,
    DROP COLUMN `productId`,
    DROP COLUMN `productName`,
    DROP COLUMN `weightOfChips`,
    ADD COLUMN `analysis_date` DATETIME(3) NULL,
    ADD COLUMN `approved_by` INTEGER NULL,
    ADD COLUMN `approved_date` DATETIME(3) NULL,
    ADD COLUMN `ash_content` DOUBLE NULL,
    ADD COLUMN `carbon_content` DOUBLE NULL,
    ADD COLUMN `costumer_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `delta_e` DOUBLE NULL,
    ADD COLUMN `expiry_date` DATETIME(3) NULL,
    ADD COLUMN `foreign_matter` VARCHAR(191) NULL,
    ADD COLUMN `heat_stability` DOUBLE NULL,
    ADD COLUMN `intrinsic_viscosity` DOUBLE NULL,
    ADD COLUMN `issue_by` VARCHAR(191) NULL,
    ADD COLUMN `let_down_ratio` VARCHAR(191) NULL,
    ADD COLUMN `light_fastness` DOUBLE NULL,
    ADD COLUMN `lot_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `mfg_date` DATETIME(3) NULL,
    ADD COLUMN `pellet_diameter` DOUBLE NULL,
    ADD COLUMN `pellet_length` DOUBLE NULL,
    ADD COLUMN `pellet_visual` BOOLEAN NULL,
    ADD COLUMN `planning_id` INTEGER NULL,
    ADD COLUMN `printed_by` INTEGER NULL,
    ADD COLUMN `printed_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `product_id` INTEGER NOT NULL,
    ADD COLUMN `product_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `weight_of_chips` DOUBLE NULL;

-- DropTable
DROP TABLE `mandatoryfield`;

-- DropTable
DROP TABLE `master_customer`;

-- DropTable
DROP TABLE `master_product`;

-- DropTable
DROP TABLE `permission`;

-- DropTable
DROP TABLE `planningdetail`;

-- DropTable
DROP TABLE `planningheader`;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `rolepermission`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `token_version` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permissions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `role_permissions_role_id_permission_id_key`(`role_id`, `permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(191) NOT NULL,
    `resin` VARCHAR(191) NULL,
    `let_down_ratio` VARCHAR(191) NULL,
    `pellet_length` DOUBLE NULL,
    `pellet_height` DOUBLE NULL,
    `color` VARCHAR(191) NULL,
    `dispersibility` VARCHAR(191) NULL,
    `mfr` DOUBLE NULL,
    `density` DOUBLE NULL,
    `moisture` DOUBLE NULL,
    `carbon_content` DOUBLE NULL,
    `foreign_matter` VARCHAR(191) NULL,
    `weight_of_chips` DOUBLE NULL,
    `intrinsic_viscosity` DOUBLE NULL,
    `ash_content` DOUBLE NULL,
    `heat_stability` DOUBLE NULL,
    `light_fastness` DOUBLE NULL,
    `granule` VARCHAR(191) NULL,
    `delta_e` DOUBLE NULL,
    `macaroni` DOUBLE NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `master_customers_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mandatory_fields` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `field_name` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `mandatory_fields_field_name_idx`(`field_name`),
    UNIQUE INDEX `mandatory_fields_customer_id_field_name_key`(`customer_id`, `field_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planning_headers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_customer` INTEGER NOT NULL,
    `id_product` INTEGER NOT NULL,
    `resin` VARCHAR(191) NOT NULL,
    `ratio` VARCHAR(191) NOT NULL,
    `moulding` VARCHAR(191) NOT NULL,
    `lot_number` VARCHAR(191) NOT NULL,
    `qty_planning` INTEGER NOT NULL,
    `mfg_date` DATETIME(3) NOT NULL,
    `expiry_date` DATETIME(3) NOT NULL,
    `status` ENUM('open', 'progress', 'close') NOT NULL DEFAULT 'open',
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planning_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qty` DOUBLE NOT NULL,
    `id_planning` INTEGER NOT NULL,
    `line_no` INTEGER NULL,
    `delta_l` DOUBLE NULL,
    `delta_a` DOUBLE NULL,
    `delta_b` DOUBLE NULL,
    `delta_e` DOUBLE NULL,
    `density` DOUBLE NULL,
    `mfr` DOUBLE NULL,
    `dispersion` DOUBLE NULL,
    `contamination` DOUBLE NULL,
    `macaroni` DOUBLE NULL,
    `pellet_length` DOUBLE NULL,
    `pellet_diameter` DOUBLE NULL,
    `visual_check` VARCHAR(191) NULL,
    `moisture` DOUBLE NULL,
    `carbon_content` DOUBLE NULL,
    `foreign_matter` DOUBLE NULL,
    `weight_chips` DOUBLE NULL,
    `intrinsic_viscosity` DOUBLE NULL,
    `ash_content` DOUBLE NULL,
    `heat_stability` DOUBLE NULL,
    `light_fastness` DOUBLE NULL,
    `granule` DOUBLE NULL,
    `qc_judgment` VARCHAR(191) NULL,
    `analysis_date` DATETIME(3) NULL,
    `checked_by` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `deleted_coa_original_id_key` ON `deleted_coa`(`original_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `print_coa` ADD CONSTRAINT `print_coa_printed_by_fkey` FOREIGN KEY (`printed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_products` ADD CONSTRAINT `master_products_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_standards` ADD CONSTRAINT `product_standards_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `master_products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_coa` ADD CONSTRAINT `master_coa_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_coa` ADD CONSTRAINT `master_coa_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_coa` ADD CONSTRAINT `master_coa_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `master_customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_coa` ADD CONSTRAINT `master_coa_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `master_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_restored_by_fkey` FOREIGN KEY (`restored_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mandatory_fields` ADD CONSTRAINT `mandatory_fields_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `master_customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_coa_id_fkey` FOREIGN KEY (`coa_id`) REFERENCES `master_coa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_headers` ADD CONSTRAINT `planning_headers_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_headers` ADD CONSTRAINT `planning_headers_id_customer_fkey` FOREIGN KEY (`id_customer`) REFERENCES `master_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_headers` ADD CONSTRAINT `planning_headers_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `master_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_details` ADD CONSTRAINT `planning_details_id_planning_fkey` FOREIGN KEY (`id_planning`) REFERENCES `planning_headers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_details` ADD CONSTRAINT `planning_details_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
