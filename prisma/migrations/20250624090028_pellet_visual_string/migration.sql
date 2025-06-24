/*
  Warnings:

  - You are about to alter the column `pellet_visual` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `print_coa` MODIFY `pellet_visual` VARCHAR(191) NULL;
