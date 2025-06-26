/*
  Warnings:

  - You are about to alter the column `operator` on the `product_standards` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `product_standards` MODIFY `operator` ENUM('PLUS_MINUS', 'LESS_THAN', 'LESS_EQUAL', 'GREATER_THAN', 'GREATER_EQUAL') NOT NULL;
