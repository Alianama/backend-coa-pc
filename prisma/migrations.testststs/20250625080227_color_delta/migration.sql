/*
  Warnings:

  - You are about to drop the column `delta_a` on the `planning_details` table. All the data in the column will be lost.
  - You are about to drop the column `delta_b` on the `planning_details` table. All the data in the column will be lost.
  - You are about to drop the column `delta_e` on the `planning_details` table. All the data in the column will be lost.
  - You are about to drop the column `delta_l` on the `planning_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `planning_details` DROP COLUMN `delta_a`,
    DROP COLUMN `delta_b`,
    DROP COLUMN `delta_e`,
    DROP COLUMN `delta_l`,
    ADD COLUMN `color_delta_a` DOUBLE NULL,
    ADD COLUMN `color_delta_b` DOUBLE NULL,
    ADD COLUMN `color_delta_e` DOUBLE NULL,
    ADD COLUMN `color_delta_l` DOUBLE NULL,
    ADD COLUMN `delta_p` DOUBLE NULL,
    ADD COLUMN `tint_delta_a` DOUBLE NULL,
    ADD COLUMN `tint_delta_b` DOUBLE NULL,
    ADD COLUMN `tint_delta_e` DOUBLE NULL,
    ADD COLUMN `tint_delta_l` DOUBLE NULL;
