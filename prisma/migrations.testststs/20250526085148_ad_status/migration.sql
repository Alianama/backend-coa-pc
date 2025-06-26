-- AlterTable
ALTER TABLE `user` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `deletedBy` INTEGER NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `lastLogin` DATETIME(3) NULL,
    ADD COLUMN `restoredAt` DATETIME(3) NULL,
    ADD COLUMN `restoredBy` INTEGER NULL;

-- CreateTable
CREATE TABLE `MasterCoa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coaNumber` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `batchNumber` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NOT NULL,
    `approvedBy` INTEGER NULL,
    `approvedAt` DATETIME(3) NULL,

    UNIQUE INDEX `MasterCoa_coaNumber_key`(`coaNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_deletedBy_fkey` FOREIGN KEY (`deletedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_restoredBy_fkey` FOREIGN KEY (`restoredBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasterCoa` ADD CONSTRAINT `MasterCoa_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasterCoa` ADD CONSTRAINT `MasterCoa_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasterCoa` ADD CONSTRAINT `MasterCoa_approvedBy_fkey` FOREIGN KEY (`approvedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
