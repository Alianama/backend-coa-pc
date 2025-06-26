/*
  Warnings:

  - You are about to drop the column `pelletVisual` on the `master_product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `master_product` DROP COLUMN `pelletVisual`;

-- CreateTable
CREATE TABLE `palnning` (
    `id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planning_header` (
    `id_header` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cust` INTEGER NOT NULL,
    `id_prod` INTEGER NOT NULL,
    `resin` VARCHAR(191) NOT NULL,
    `ratio` VARCHAR(191) NOT NULL,
    `moulding` VARCHAR(191) NOT NULL,
    `lot_no` VARCHAR(191) NOT NULL,
    `qty_planning` INTEGER NOT NULL,
    `mfg_date` DATETIME(3) NOT NULL,
    `expiry_date` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_header`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `planning_header` ADD CONSTRAINT `planning_header_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
