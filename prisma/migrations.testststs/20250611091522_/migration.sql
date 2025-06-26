/*
  Warnings:

  - You are about to alter the column `quantity` on the `deleted_coa` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `deleted_coa` MODIFY `quantity` DOUBLE NULL;
