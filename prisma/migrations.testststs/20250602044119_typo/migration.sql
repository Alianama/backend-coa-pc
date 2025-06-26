/*
  Warnings:

  - You are about to drop the column `anaysisDate` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `carbonConten` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `forignMater` on the `deleted_coa` table. All the data in the column will be lost.
  - You are about to drop the column `anaysisDate` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `carbonConten` on the `master_coa` table. All the data in the column will be lost.
  - You are about to drop the column `forignMater` on the `master_coa` table. All the data in the column will be lost.
  - Added the required column `analysisDate` to the `deleted_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbonContent` to the `deleted_coa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foreignMatter` to the `deleted_coa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deleted_coa` DROP COLUMN `anaysisDate`,
    DROP COLUMN `carbonConten`,
    DROP COLUMN `forignMater`,
    ADD COLUMN `analysisDate` DATETIME(3) NOT NULL,
    ADD COLUMN `carbonContent` VARCHAR(191) NOT NULL,
    ADD COLUMN `foreignMatter` VARCHAR(191) NOT NULL;
