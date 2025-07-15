-- AlterTable
ALTER TABLE `master_customers` ADD COLUMN `contamination` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `dispersion` BOOLEAN NOT NULL DEFAULT false;
