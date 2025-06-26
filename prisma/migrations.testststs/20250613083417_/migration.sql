/*
  Warnings:

  - You are about to drop the column `Granule` on the `deleted_coa` table. All the data in the column will be lost.
  - Added the required column `productId` to the `master_coa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deleted_coa` DROP COLUMN `Granule`,
    ADD COLUMN `granule` VARCHAR(191) NULL;
