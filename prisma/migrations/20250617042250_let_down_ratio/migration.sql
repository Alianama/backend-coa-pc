/*
  Warnings:

  - You are about to drop the column `letDownResin` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `letDownResin` on the `print_coa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `master_coa` DROP COLUMN `letDownResin`,
    ADD COLUMN `letDownRatio` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `print_coa` DROP COLUMN `letDownResin`,
    ADD COLUMN `letDownRatio` VARCHAR(191) NULL;
