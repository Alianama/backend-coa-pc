/*
  Warnings:

  - You are about to drop the column `delta_e` on the `print_coa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `print_coa` DROP COLUMN `delta_e`,
    ADD COLUMN `color_delta_e` DOUBLE NULL,
    ADD COLUMN `delta_p` DOUBLE NULL,
    ADD COLUMN `tint_delta_e` DOUBLE NULL;
