/*
  Warnings:

  - You are about to drop the column `CaCO3Mandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `NucleatingAgentMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `OdorMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `analysisDateMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `ashContentMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `carbonContentMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `colorCheckMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `colorDeltaEMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `colorMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `deltaPMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `densityMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `dispersibilityMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDateMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `foreignMatterMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `granuleMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `halsMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `heatStabilityMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `hidingMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `intrinsicViscosityMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `lightFastnessMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `macaroniMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `mfgDateMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `mfrMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `moistureMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `pelletDiameterMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `pelletLengthMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `printedDateMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `tintDeltaEMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `visualCheckMandatory` on the `master_customers` table. All the data in the column will be lost.
  - You are about to drop the column `weightOfChipsMandatory` on the `master_customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `master_customers` DROP COLUMN `CaCO3Mandatory`,
    DROP COLUMN `NucleatingAgentMandatory`,
    DROP COLUMN `OdorMandatory`,
    DROP COLUMN `analysisDateMandatory`,
    DROP COLUMN `ashContentMandatory`,
    DROP COLUMN `carbonContentMandatory`,
    DROP COLUMN `colorCheckMandatory`,
    DROP COLUMN `colorDeltaEMandatory`,
    DROP COLUMN `colorMandatory`,
    DROP COLUMN `deltaPMandatory`,
    DROP COLUMN `densityMandatory`,
    DROP COLUMN `dispersibilityMandatory`,
    DROP COLUMN `expiryDateMandatory`,
    DROP COLUMN `foreignMatterMandatory`,
    DROP COLUMN `granuleMandatory`,
    DROP COLUMN `halsMandatory`,
    DROP COLUMN `heatStabilityMandatory`,
    DROP COLUMN `hidingMandatory`,
    DROP COLUMN `intrinsicViscosityMandatory`,
    DROP COLUMN `lightFastnessMandatory`,
    DROP COLUMN `macaroniMandatory`,
    DROP COLUMN `mfgDateMandatory`,
    DROP COLUMN `mfrMandatory`,
    DROP COLUMN `moistureMandatory`,
    DROP COLUMN `pelletDiameterMandatory`,
    DROP COLUMN `pelletLengthMandatory`,
    DROP COLUMN `printedDateMandatory`,
    DROP COLUMN `tintDeltaEMandatory`,
    DROP COLUMN `visualCheckMandatory`,
    DROP COLUMN `weightOfChipsMandatory`,
    ADD COLUMN `CaCO3` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `NucleatingAgent` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `Odor` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `analysisDate` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ashContent` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `carbonContent` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `color` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `colorCheck` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `colorDeltaE` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deltaP` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `density` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `dispersibility` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `expiryDate` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `foreignMatter` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `granule` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hals` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `heatStability` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hiding` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `intrinsicViscosity` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lightFastness` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `macaroni` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `mfgDate` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `mfr` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `moisture` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pelletDiameter` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pelletLength` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `printedDate` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tintDeltaE` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `visualCheck` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `weightOfChips` BOOLEAN NOT NULL DEFAULT false;
