/*
  Warnings:

  - You are about to alter the column `dispersibility` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(13))`.
  - The values [Pass] on the enum `planning_details_odor` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pass] on the enum `planning_details_odor` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pass] on the enum `planning_details_odor` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `dispersibility` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(13))`.
  - The values [Pass] on the enum `planning_details_odor` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pass] on the enum `planning_details_odor` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pass] on the enum `planning_details_odor` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `deleted_coa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `deleted_coa` DROP FOREIGN KEY `deleted_coa_approved_by_fkey`;

-- DropForeignKey
ALTER TABLE `deleted_coa` DROP FOREIGN KEY `deleted_coa_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `deleted_coa` DROP FOREIGN KEY `deleted_coa_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `deleted_coa` DROP FOREIGN KEY `deleted_coa_restored_by_fkey`;

-- AlterTable
ALTER TABLE `master_customers` ADD COLUMN `pellet_visual` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `planning_details` ADD COLUMN `pellet_visual` ENUM('PASS', 'NG') NULL,
    MODIFY `dispersibility` ENUM('PASS', 'NG') NULL,
    MODIFY `visual_check` ENUM('PASS', 'NG') NULL,
    MODIFY `color_check` ENUM('PASS', 'NG') NULL,
    MODIFY `odor` ENUM('PASS', 'NG') NULL;

-- AlterTable
ALTER TABLE `print_coa` ADD COLUMN `pellet_visual` ENUM('PASS', 'NG') NULL,
    MODIFY `dispersibility` ENUM('PASS', 'NG') NULL,
    MODIFY `odor` ENUM('PASS', 'NG') NULL,
    MODIFY `color_check` ENUM('PASS', 'NG') NULL,
    MODIFY `visual_check` ENUM('PASS', 'NG') NULL;

-- AlterTable
ALTER TABLE `product_standards` MODIFY `property_name` ENUM('colorDeltaL', 'colorDeltaA', 'colorDeltaB', 'colorDeltaE', 'tintDeltaL', 'tintDeltaA', 'tintDeltaB', 'tintDeltaE', 'deltaP', 'density', 'mfr', 'dispersibility', 'contamination', 'macaroni', 'pelletLength', 'pelletDiameter', 'visualCheck', 'pelletVisual', 'moisture', 'carbonContent', 'foreignMatter', 'weightOfChips', 'intrinsicViscosity', 'ashContent', 'heatStability', 'lightFastness', 'granule', 'caCO3', 'hals', 'hiding', 'odor', 'nucleatingAgent', 'dispersion') NOT NULL;

-- DropTable
DROP TABLE `deleted_coa`;
