/*
  Warnings:

  - You are about to drop the column `Granule` on the `master_coa` table. All the data in the column will be lost.
  - You are about to alter the column `mfr` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Double`.
  - You are about to alter the column `density` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,4)` to `Double`.
  - You are about to alter the column `moisture` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Double`.
  - You are about to alter the column `carbonContent` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Double`.
  - You are about to alter the column `weightOfChips` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,2)` to `Double`.
  - You are about to alter the column `intrinsicViscosity` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,3)` to `Double`.
  - You are about to alter the column `ashContent` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Double`.
  - You are about to alter the column `heatStability` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Double`.
  - You are about to alter the column `lightFastness` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Double`.
  - You are about to alter the column `deltaE` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Double`.
  - You are about to alter the column `macaroni` on the `master_product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
-- ALTER TABLE `master_coa` DROP COLUMN `Granule`,
--     ADD COLUMN `granule` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `master_product` MODIFY `resin` VARCHAR(191) NULL,
    MODIFY `letDownRatio` VARCHAR(191) NULL,
    MODIFY `pellet` VARCHAR(191) NULL,
    MODIFY `color` VARCHAR(191) NULL,
    MODIFY `dispersibility` VARCHAR(191) NULL,
    MODIFY `mfr` DOUBLE NULL,
    MODIFY `density` DOUBLE NULL,
    MODIFY `moisture` DOUBLE NULL,
    MODIFY `carbonContent` DOUBLE NULL,
    MODIFY `foreignMatter` VARCHAR(191) NULL,
    MODIFY `weightOfChips` DOUBLE NULL,
    MODIFY `intrinsicViscosity` DOUBLE NULL,
    MODIFY `ashContent` DOUBLE NULL,
    MODIFY `heatStability` DOUBLE NULL,
    MODIFY `lightFastness` DOUBLE NULL,
    MODIFY `granule` VARCHAR(191) NULL,
    MODIFY `deltaE` DOUBLE NULL,
    MODIFY `macaroni` DOUBLE NULL;
