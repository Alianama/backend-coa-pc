-- CreateTable
CREATE TABLE `print_coa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `costumerName` VARCHAR(191) NOT NULL,
    `productId` INTEGER NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `lotNumber` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NULL,
    `letDownResin` VARCHAR(191) NULL,
    `pelletLength` DOUBLE NULL,
    `pelletDimension` DOUBLE NULL,
    `pelletVisual` BOOLEAN NULL,
    `color` VARCHAR(191) NULL,
    `dispersibility` VARCHAR(191) NULL,
    `mfr` DOUBLE NULL,
    `density` DOUBLE NULL,
    `moisture` DOUBLE NULL,
    `carbonContent` DOUBLE NULL,
    `mfgDate` DATETIME(3) NULL,
    `expiryDate` DATETIME(3) NULL,
    `analysisDate` DATETIME(3) NULL,
    `printedDate` DATETIME(3) NULL,
    `foreignMatter` VARCHAR(191) NULL,
    `weightOfChips` DOUBLE NULL,
    `intrinsicViscosity` DOUBLE NULL,
    `ashContent` DOUBLE NULL,
    `heatStability` DOUBLE NULL,
    `lightFastness` DOUBLE NULL,
    `granule` VARCHAR(191) NULL,
    `deltaE` DOUBLE NULL,
    `macaroni` DOUBLE NULL,
    `issueBy` VARCHAR(191) NULL,
    `approvedBy` INTEGER NULL,
    `approvedDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `printedBy` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `print_coa` ADD CONSTRAINT `print_coa_printedBy_fkey` FOREIGN KEY (`printedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
