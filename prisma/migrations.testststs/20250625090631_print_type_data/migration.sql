/*
  Warnings:

  - You are about to drop the column `dispersion` on the `planning_details` table. All the data in the column will be lost.
  - You are about to drop the column `weight_chips` on the `planning_details` table. All the data in the column will be lost.
  - You are about to alter the column `dispersibility` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `granule` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `foreign_matter` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `planning_details` DROP COLUMN `dispersion`,
    DROP COLUMN `weight_chips`,
    ADD COLUMN `dispersibility` DOUBLE NULL,
    ADD COLUMN `weight_of_chips` DOUBLE NULL;

-- AlterTable
ALTER TABLE `print_coa` MODIFY `dispersibility` DOUBLE NULL,
    MODIFY `granule` DOUBLE NULL,
    MODIFY `foreign_matter` DOUBLE NULL;
