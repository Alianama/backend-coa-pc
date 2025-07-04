-- AlterTable
ALTER TABLE `print_coa` ADD COLUMN `rejected_by` INTEGER NULL,
    ADD COLUMN `rejected_date` DATETIME(3) NULL;
