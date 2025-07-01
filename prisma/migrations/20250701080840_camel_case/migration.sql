/*
  Warnings:

  - You are about to drop the column `CaCO3` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `NucleatingAgent` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `Odor` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `analysisDate` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `ashContent` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `carbonContent` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `colorCheck` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `colorDeltaE` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `deltaP` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `foreignMatter` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `heatStability` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `intrinsicViscosity` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `lightFastness` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `mfgDate` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `pelletDiameter` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `pelletLength` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `printedDate` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `tintDeltaE` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `visualCheck` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `weightOfChips` on the `master_customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `master_customers` DROP COLUMN `CaCO3`,
    DROP COLUMN `NucleatingAgent`,
    DROP COLUMN `Odor`,
    DROP COLUMN `analysisDate`,
    DROP COLUMN `ashContent`,
    DROP COLUMN `carbonContent`,
    DROP COLUMN `colorCheck`,
    DROP COLUMN `colorDeltaE`,
    DROP COLUMN `deltaP`,
    DROP COLUMN `expiryDate`,
    DROP COLUMN `foreignMatter`,
    DROP COLUMN `heatStability`,
    DROP COLUMN `intrinsicViscosity`,
    DROP COLUMN `lightFastness`,
    DROP COLUMN `mfgDate`,
    DROP COLUMN `pelletDiameter`,
    DROP COLUMN `pelletLength`,
    DROP COLUMN `printedDate`,
    DROP COLUMN `tintDeltaE`,
    DROP COLUMN `visualCheck`,
    DROP COLUMN `weightOfChips`,
    ADD COLUMN `analysis_date` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `ash_content` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `ca_co3` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `carbon_content` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `color_check` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `color_delta_e` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `delta_p` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `expiry_date` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `foreign_matter` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `heat_stability` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `intrinsic_viscosity` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `light_fastness` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `mfg_date` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `nucleating_agent` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `odor` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `pellet_diameter` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `pellet_length` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `printed_date` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `tint_delta_e` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `visual_check` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `weight_of_chips` BOOLEAN NULL DEFAULT false,
    MODIFY `color` BOOLEAN NULL DEFAULT false,
    MODIFY `density` BOOLEAN NULL DEFAULT false,
    MODIFY `dispersibility` BOOLEAN NULL DEFAULT false,
    MODIFY `granule` BOOLEAN NULL DEFAULT false,
    MODIFY `macaroni` BOOLEAN NULL DEFAULT false,
    MODIFY `mfr` BOOLEAN NULL DEFAULT false,
    MODIFY `moisture` BOOLEAN NULL DEFAULT false;
