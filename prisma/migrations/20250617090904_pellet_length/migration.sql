/*
  Warnings:

  - You are about to drop the column `pelletDimension` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pelletDimension` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `pellet` on the `master_product` table. All the data in the column will be lost.
  - You are about to drop the column `pelletDimension` on the `print_coa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `deleted_coa` DROP COLUMN `pelletDimension`,
    ADD COLUMN `pelletHeight` DOUBLE NULL;

-- AlterTable
ALTER TABLE `master_coa` DROP COLUMN `pelletDimension`,
    ADD COLUMN `pelletHeight` DOUBLE NULL;

-- AlterTable
ALTER TABLE `master_product` DROP COLUMN `pellet`,
    ADD COLUMN `pelletHeight` DOUBLE NULL,
    ADD COLUMN `pelletLength` DOUBLE NULL,
    ADD COLUMN `pelletVisual` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `print_coa` DROP COLUMN `pelletDimension`,
    ADD COLUMN `pelletHeight` DOUBLE NULL;
