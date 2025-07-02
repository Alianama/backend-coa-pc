/*
  Warnings:

  - You are about to alter the column `hals` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `hiding` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `nucleating_agent` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `odor` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `hals` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `hiding` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `nucleating_agent` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `odor` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `planning_details` MODIFY `hals` DOUBLE NULL,
    MODIFY `hiding` DOUBLE NULL,
    MODIFY `nucleating_agent` DOUBLE NULL,
    MODIFY `odor` DOUBLE NULL;

-- AlterTable
ALTER TABLE `print_coa` MODIFY `hals` DOUBLE NULL,
    MODIFY `hiding` DOUBLE NULL,
    MODIFY `nucleating_agent` DOUBLE NULL,
    MODIFY `odor` DOUBLE NULL;
