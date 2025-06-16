/*
  Warnings:

  - Added the required column `createdBy` to the `master_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `master_product` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdBy` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `master_product` ADD CONSTRAINT `master_product_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
