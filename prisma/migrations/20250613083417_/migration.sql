/*
  Warnings:

  - You are about to drop the column `Granule` on the `deleted_coa` table. All the data in the column will be lost.
  - Added the required column `productId` to the `master_coa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deleted_coa` DROP COLUMN `Granule`,
    ADD COLUMN `granule` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `master_coa` ADD COLUMN `productId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `master_coa` ADD CONSTRAINT `master_coa_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `master_product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
