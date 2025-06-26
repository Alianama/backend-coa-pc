-- DropForeignKey
ALTER TABLE `deleted_coa` DROP FOREIGN KEY `deleted_coa_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `deleted_coa` DROP FOREIGN KEY `deleted_coa_deletedBy_fkey`;

-- DropIndex
DROP INDEX `deleted_coa_createdBy_fkey` ON `deleted_coa`;

-- DropIndex
DROP INDEX `deleted_coa_deletedBy_fkey` ON `deleted_coa`;

-- AlterTable
ALTER TABLE `deleted_coa` MODIFY `letDownResin` VARCHAR(191) NULL,
    MODIFY `quantity` VARCHAR(191) NULL,
    MODIFY `pelletSize` VARCHAR(191) NULL,
    MODIFY `pelletVisual` VARCHAR(191) NULL,
    MODIFY `color` VARCHAR(191) NULL,
    MODIFY `dispersibility` VARCHAR(191) NULL,
    MODIFY `mfr` VARCHAR(191) NULL,
    MODIFY `density` VARCHAR(191) NULL,
    MODIFY `moisture` VARCHAR(191) NULL,
    MODIFY `mfgDate` DATETIME(3) NULL,
    MODIFY `expiryDate` DATETIME(3) NULL,
    MODIFY `printedDate` DATETIME(3) NULL,
    MODIFY `weightOfChips` VARCHAR(191) NULL,
    MODIFY `intrinsicViscosity` VARCHAR(191) NULL,
    MODIFY `ashContent` VARCHAR(191) NULL,
    MODIFY `issueBy` VARCHAR(191) NULL,
    MODIFY `createdBy` INTEGER NULL,
    MODIFY `createdAt` DATETIME(3) NULL,
    MODIFY `updatedAt` DATETIME(3) NULL,
    MODIFY `deletedBy` INTEGER NULL,
    MODIFY `analysisDate` DATETIME(3) NULL,
    MODIFY `carbonContent` VARCHAR(191) NULL,
    MODIFY `foreignMatter` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_deletedBy_fkey` FOREIGN KEY (`deletedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
