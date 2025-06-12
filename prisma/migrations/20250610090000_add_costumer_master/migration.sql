-- AlterTable
ALTER TABLE `master_coa` ADD COLUMN `customerId` INTEGER NULL;

-- CreateTable
CREATE TABLE `master_customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MandatoryField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fieldName` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `master_coa` ADD CONSTRAINT `master_coa_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `master_customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MandatoryField` ADD CONSTRAINT `MandatoryField_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `master_customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
