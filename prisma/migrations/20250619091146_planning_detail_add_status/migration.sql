-- AlterTable
ALTER TABLE `planningheader` ADD COLUMN `status` ENUM('open', 'progress', 'close') NOT NULL DEFAULT 'open';
