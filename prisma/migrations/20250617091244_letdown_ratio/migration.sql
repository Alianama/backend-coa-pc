/*
  Warnings:

  - You are about to drop the column `letDownResin` on the `deleted_coa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `deleted_coa` DROP COLUMN `letDownResin`,
    ADD COLUMN `letDownRatio` VARCHAR(191) NULL;
