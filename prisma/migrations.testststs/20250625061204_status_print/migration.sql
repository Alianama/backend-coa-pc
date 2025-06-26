/*
  Warnings:

  - You are about to drop the column `ash_content` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `carbon_content` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `delta_e` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `density` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `dispersibility` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `foreign_matter` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `granule` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `heat_stability` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `intrinsic_viscosity` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `light_fastness` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `macaroni` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `mfr` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `moisture` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `pellet_height` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `pellet_length` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the column `weight_of_chips` on the `master_products` table. All the data in the column will be lost.
  - Added the required column `status` to the `print_coa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `master_products` DROP COLUMN `ash_content`,
    DROP COLUMN `carbon_content`,
    DROP COLUMN `delta_e`,
    DROP COLUMN `density`,
    DROP COLUMN `dispersibility`,
    DROP COLUMN `foreign_matter`,
    DROP COLUMN `granule`,
    DROP COLUMN `heat_stability`,
    DROP COLUMN `intrinsic_viscosity`,
    DROP COLUMN `light_fastness`,
    DROP COLUMN `macaroni`,
    DROP COLUMN `mfr`,
    DROP COLUMN `moisture`,
    DROP COLUMN `pellet_height`,
    DROP COLUMN `pellet_length`,
    DROP COLUMN `weight_of_chips`,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE `print_coa` ADD COLUMN `status` ENUM('REQUESTED', 'APPROVED', 'REJECTED') NOT NULL;
