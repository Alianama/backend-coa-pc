/*
  Warnings:

  - You are about to alter the column `dispersibility` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `hals` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `hiding` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `nucleating_agent` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `odor` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `dispersibility` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `hals` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `hiding` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `nucleating_agent` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `odor` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `planning_details` ADD COLUMN `dispersion` VARCHAR(191) NULL,
    MODIFY `dispersibility` VARCHAR(191) NULL,
    MODIFY `hals` VARCHAR(191) NULL,
    MODIFY `hiding` VARCHAR(191) NULL,
    MODIFY `nucleating_agent` VARCHAR(191) NULL,
    MODIFY `odor` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `print_coa` ADD COLUMN `dispersion` VARCHAR(191) NULL,
    MODIFY `dispersibility` VARCHAR(191) NULL,
    MODIFY `hals` VARCHAR(191) NULL,
    MODIFY `hiding` VARCHAR(191) NULL,
    MODIFY `nucleating_agent` VARCHAR(191) NULL,
    MODIFY `odor` VARCHAR(191) NULL;
