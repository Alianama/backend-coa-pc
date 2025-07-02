/*
  Warnings:

  - You are about to drop the column `expiry_date` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `mfg_date` on the `master_customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `master_customers` DROP COLUMN `expiry_date`,
    DROP COLUMN `mfg_date`;
