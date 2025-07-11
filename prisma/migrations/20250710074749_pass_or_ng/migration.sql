/*
  Warnings:

  - You are about to alter the column `visual_check` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(8))`.
  - You are about to alter the column `color_check` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(8))`.
  - You are about to alter the column `odor` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(8))`.
  - You are about to alter the column `odor` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(8))`.
  - You are about to alter the column `color_check` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(8))`.
  - You are about to alter the column `visual_check` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(8))`.

*/
-- AlterTable
ALTER TABLE `planning_details` MODIFY `visual_check` ENUM('Pass', 'NG') NULL,
    MODIFY `color_check` ENUM('Pass', 'NG') NULL,
    MODIFY `odor` ENUM('Pass', 'NG') NULL;

-- AlterTable
ALTER TABLE `print_coa` MODIFY `odor` ENUM('Pass', 'NG') NULL,
    MODIFY `color_check` ENUM('Pass', 'NG') NULL,
    MODIFY `visual_check` ENUM('Pass', 'NG') NULL;
