/*
  Warnings:

  - A unique constraint covering the columns `[customerId,fieldName]` on the table `MandatoryField` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `master_customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `mandatoryfield` DROP FOREIGN KEY `MandatoryField_customerId_fkey`;

-- DropIndex
DROP INDEX `MandatoryField_customerId_fkey` ON `mandatoryfield`;

-- CreateIndex
CREATE INDEX `MandatoryField_fieldName_idx` ON `MandatoryField`(`fieldName`);

-- CreateIndex
CREATE UNIQUE INDEX `MandatoryField_customerId_fieldName_key` ON `MandatoryField`(`customerId`, `fieldName`);

-- CreateIndex
CREATE UNIQUE INDEX `master_customer_name_key` ON `master_customer`(`name`);

-- AddForeignKey
ALTER TABLE `MandatoryField` ADD CONSTRAINT `MandatoryField_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `master_customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
