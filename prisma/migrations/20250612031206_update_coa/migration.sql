/*
  Warnings:

  - You are about to drop the column `pelletSize` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to alter the column `pelletVisual` on the `deleted_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `mfr` on the `deleted_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `density` on the `deleted_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `moisture` on the `deleted_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `weightOfChips` on the `deleted_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `intrinsicViscosity` on the `deleted_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `ashContent` on the `deleted_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `carbonContent` on the `deleted_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to drop the column `pelletSize` on the `master_coa` table. All the data in the column will be lost.
  - You are about to alter the column `pelletVisual` on the `master_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `mfr` on the `master_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `density` on the `master_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `moisture` on the `master_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `weightOfChips` on the `master_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `intrinsicViscosity` on the `master_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `ashContent` on the `master_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `carbonContent` on the `master_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `deleted_coa` DROP COLUMN `pelletSize`,
    ADD COLUMN `Granule` VARCHAR(191) NULL,
    ADD COLUMN `deltaE` DOUBLE NULL,
    ADD COLUMN `heatStability` DOUBLE NULL,
    ADD COLUMN `lightFastness` DOUBLE NULL,
    ADD COLUMN `macaroni` DOUBLE NULL,
    ADD COLUMN `pellerDimension` DOUBLE NULL,
    ADD COLUMN `pelletLength` DOUBLE NULL,
    MODIFY `pelletVisual` BOOLEAN NULL,
    MODIFY `mfr` DOUBLE NULL,
    MODIFY `density` DOUBLE NULL,
    MODIFY `moisture` DOUBLE NULL,
    MODIFY `weightOfChips` DOUBLE NULL,
    MODIFY `intrinsicViscosity` DOUBLE NULL,
    MODIFY `ashContent` DOUBLE NULL,
    MODIFY `carbonContent` DOUBLE NULL;

-- AlterTable
ALTER TABLE `master_coa` DROP COLUMN `pelletSize`,
    ADD COLUMN `Granule` VARCHAR(191) NULL,
    ADD COLUMN `deltaE` DOUBLE NULL,
    ADD COLUMN `heatStability` DOUBLE NULL,
    ADD COLUMN `lightFastness` DOUBLE NULL,
    ADD COLUMN `macaroni` DOUBLE NULL,
    ADD COLUMN `pellerDimension` DOUBLE NULL,
    ADD COLUMN `pelletLength` DOUBLE NULL,
    MODIFY `pelletVisual` BOOLEAN NULL,
    MODIFY `mfr` DOUBLE NULL,
    MODIFY `density` DOUBLE NULL,
    MODIFY `moisture` DOUBLE NULL,
    MODIFY `weightOfChips` DOUBLE NULL,
    MODIFY `intrinsicViscosity` DOUBLE NULL,
    MODIFY `ashContent` DOUBLE NULL,
    MODIFY `carbonContent` DOUBLE NULL;

-- CreateTable
CREATE TABLE `master_product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productName` VARCHAR(191) NOT NULL,
    `resin` VARCHAR(191) NOT NULL,
    `letDownRatio` VARCHAR(191) NOT NULL,
    `pellet` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `dispersibility` VARCHAR(191) NOT NULL,
    `mfr` DECIMAL(5, 2) NOT NULL,
    `density` DECIMAL(6, 4) NOT NULL,
    `moisture` DECIMAL(4, 2) NOT NULL,
    `carbonContent` DECIMAL(5, 2) NOT NULL,
    `foreignMatter` VARCHAR(191) NOT NULL,
    `weightOfChips` DECIMAL(6, 2) NOT NULL,
    `intrinsicViscosity` DECIMAL(4, 3) NOT NULL,
    `ashContent` DECIMAL(4, 2) NOT NULL,
    `heatStability` DECIMAL(5, 2) NOT NULL,
    `lightFastness` DECIMAL(5, 2) NOT NULL,
    `granule` VARCHAR(191) NOT NULL,
    `deltaE` DECIMAL(5, 2) NOT NULL,
    `macaroni` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
