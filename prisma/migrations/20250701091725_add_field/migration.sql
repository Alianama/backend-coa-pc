/*
  Warnings:

  - You are about to drop the column `color` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `let_down_ratio` on the `planning_details` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `print_coa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `deleted_coa` DROP COLUMN `color`;

-- AlterTable
ALTER TABLE `master_customers` DROP COLUMN `color`;

-- AlterTable
ALTER TABLE `planning_details` DROP COLUMN `let_down_ratio`,
    ADD COLUMN `ca_co3` DOUBLE NULL,
    ADD COLUMN `hals` VARCHAR(191) NULL,
    ADD COLUMN `hiding` VARCHAR(191) NULL,
    ADD COLUMN `nucleating_agent` VARCHAR(191) NULL,
    ADD COLUMN `odor` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `print_coa` DROP COLUMN `color`,
    ADD COLUMN `ca_co3` DOUBLE NULL,
    ADD COLUMN `hals` VARCHAR(191) NULL,
    ADD COLUMN `hiding` VARCHAR(191) NULL,
    ADD COLUMN `nucleating_agent` VARCHAR(191) NULL,
    ADD COLUMN `odor` VARCHAR(191) NULL;
