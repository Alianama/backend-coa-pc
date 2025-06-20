/*
  Warnings:

  - Added the required column `updatedAt` to the `master_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `master_product` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
