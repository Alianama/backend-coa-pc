/*
  Warnings:

  - You are about to drop the `planning_header` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `planning_header` DROP FOREIGN KEY `planning_header_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `planning_header` DROP FOREIGN KEY `planning_header_id_cust_fkey`;

-- DropForeignKey
ALTER TABLE `planning_header` DROP FOREIGN KEY `planning_header_id_prod_fkey`;

-- DropTable
DROP TABLE `planning_header`;

-- CreateTable
CREATE TABLE `planningHeader` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCustomer` INTEGER NOT NULL,
    `idProduct` INTEGER NOT NULL,
    `resin` VARCHAR(191) NOT NULL,
    `ratio` VARCHAR(191) NOT NULL,
    `moulding` VARCHAR(191) NOT NULL,
    `lotNumber` VARCHAR(191) NOT NULL,
    `qtyPlanning` INTEGER NOT NULL,
    `mfgDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlanningDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qty` DOUBLE NOT NULL,
    `idPlanning` INTEGER NOT NULL,
    `lineNo` INTEGER NULL,
    `deltaL` DOUBLE NULL,
    `deltaA` DOUBLE NULL,
    `deltaB` DOUBLE NULL,
    `deltaE` DOUBLE NULL,
    `density` DOUBLE NULL,
    `mfr` DOUBLE NULL,
    `dispersion` DOUBLE NULL,
    `contamination` DOUBLE NULL,
    `macaroni` DOUBLE NULL,
    `pelletLength` DOUBLE NULL,
    `pelletDiameter` DOUBLE NULL,
    `visualCheck` DOUBLE NULL,
    `moisture` DOUBLE NULL,
    `carbonContent` DOUBLE NULL,
    `foreignMatter` DOUBLE NULL,
    `weightChips` DOUBLE NULL,
    `intrinsicViscosity` DOUBLE NULL,
    `ashContent` DOUBLE NULL,
    `heatStability` DOUBLE NULL,
    `lightFastness` DOUBLE NULL,
    `granule` DOUBLE NULL,
    `qcJudgment` DOUBLE NULL,
    `analysisDate` DATETIME(3) NULL,
    `checkedBy` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `planningHeader` ADD CONSTRAINT `planningHeader_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planningHeader` ADD CONSTRAINT `planningHeader_idCustomer_fkey` FOREIGN KEY (`idCustomer`) REFERENCES `master_customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planningHeader` ADD CONSTRAINT `planningHeader_idProduct_fkey` FOREIGN KEY (`idProduct`) REFERENCES `master_product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanningDetail` ADD CONSTRAINT `PlanningDetail_idPlanning_fkey` FOREIGN KEY (`idPlanning`) REFERENCES `planningHeader`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanningDetail` ADD CONSTRAINT `PlanningDetail_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
