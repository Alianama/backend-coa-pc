/*
  Warnings:

  - You are about to drop the column `pellerDimension` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pellerDimension` on the `master_coa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `deleted_coa` DROP COLUMN `pellerDimension`,
    ADD COLUMN `pelletDimension` DOUBLE NULL;

-- AlterTable
ALTER TABLE `master_coa` DROP COLUMN `pellerDimension`,
    ADD COLUMN `pelletDimension` DOUBLE NULL;
