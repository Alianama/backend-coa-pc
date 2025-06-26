-- AlterTable
ALTER TABLE `planning_headers` ADD COLUMN `quantity_check` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `quantity_print` DOUBLE NOT NULL DEFAULT 0;
