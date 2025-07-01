/*
  Warnings:

  - You are about to drop the column `color` on the `master_products` table. All the data in the column will be lost.
  - You are about to drop the `mandatory_fields` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `mandatory_fields` DROP FOREIGN KEY `mandatory_fields_customer_id_fkey`;

-- AlterTable
ALTER TABLE `master_customers` ADD COLUMN `CaCO3Mandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `NucleatingAgentMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `OdorMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `analysisDateMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ashContentMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `carbonContentMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `colorCheckMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `colorDeltaEMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `colorMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deltaPMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `densityMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `dispersibilityMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `expiryDateMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `foreignMatterMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `granuleMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `halsMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `heatStabilityMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hidingMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `intrinsicViscosityMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lightFastnessMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `macaroniMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `mfgDateMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `mfrMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `moistureMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pelletDiameterMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pelletLengthMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `printedDateMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tintDeltaEMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `visualCheckMandatory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `weightOfChipsMandatory` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `master_products` DROP COLUMN `color`;

-- DropTable
DROP TABLE `mandatory_fields`;
