/*
  Warnings:

  - You are about to drop the column `quantity` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `master_coa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `deleted_coa` DROP COLUMN `quantity`;
