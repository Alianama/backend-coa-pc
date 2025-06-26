-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `roleId` INTEGER NOT NULL,
    `tokenVersion` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Permission_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RolePermission_roleId_permissionId_key`(`roleId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_coa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `costumerName` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `letDownResin` VARCHAR(191) NOT NULL,
    `lotNumber` VARCHAR(191) NOT NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `pelletSize` VARCHAR(191) NOT NULL,
    `pelletVisual` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `dispersibility` VARCHAR(191) NOT NULL,
    `mfr` VARCHAR(191) NOT NULL,
    `density` VARCHAR(191) NOT NULL,
    `moisture` VARCHAR(191) NOT NULL,
    `carbonConten` VARCHAR(191) NOT NULL,
    `mfgDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `anaysisDate` DATETIME(3) NOT NULL,
    `printedDate` DATETIME(3) NOT NULL,
    `forignMater` VARCHAR(191) NOT NULL,
    `weightOfChips` VARCHAR(191) NOT NULL,
    `intrinsicViscosity` VARCHAR(191) NOT NULL,
    `ashContent` VARCHAR(191) NOT NULL,
    `issueBy` VARCHAR(191) NOT NULL,
    `approvedBy` INTEGER NULL,
    `approvedDate` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deleted_coa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `costumerName` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `letDownResin` VARCHAR(191) NOT NULL,
    `lotNumber` VARCHAR(191) NOT NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `pelletSize` VARCHAR(191) NOT NULL,
    `pelletVisual` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `dispersibility` VARCHAR(191) NOT NULL,
    `mfr` VARCHAR(191) NOT NULL,
    `density` VARCHAR(191) NOT NULL,
    `moisture` VARCHAR(191) NOT NULL,
    `carbonConten` VARCHAR(191) NOT NULL,
    `mfgDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `anaysisDate` DATETIME(3) NOT NULL,
    `printedDate` DATETIME(3) NOT NULL,
    `forignMater` VARCHAR(191) NOT NULL,
    `weightOfChips` VARCHAR(191) NOT NULL,
    `intrinsicViscosity` VARCHAR(191) NOT NULL,
    `ashContent` VARCHAR(191) NOT NULL,
    `issueBy` VARCHAR(191) NOT NULL,
    `approvedBy` INTEGER NULL,
    `approvedDate` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedBy` INTEGER NOT NULL,
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isRestored` BOOLEAN NOT NULL DEFAULT false,
    `restoredAt` DATETIME(3) NULL,
    `restoredBy` INTEGER NULL,
    `originalId` INTEGER NOT NULL,

    UNIQUE INDEX `deleted_coa_originalId_key`(`originalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_coa` ADD CONSTRAINT `master_coa_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_coa` ADD CONSTRAINT `master_coa_approvedBy_fkey` FOREIGN KEY (`approvedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_approvedBy_fkey` FOREIGN KEY (`approvedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_deletedBy_fkey` FOREIGN KEY (`deletedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_restoredBy_fkey` FOREIGN KEY (`restoredBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
