-- AlterTable
ALTER TABLE `master_coa` MODIFY `letDownResin` VARCHAR(191) NULL,
    MODIFY `pelletSize` VARCHAR(191) NULL,
    MODIFY `pelletVisual` VARCHAR(191) NULL,
    MODIFY `color` VARCHAR(191) NULL,
    MODIFY `dispersibility` VARCHAR(191) NULL,
    MODIFY `mfr` VARCHAR(191) NULL,
    MODIFY `density` VARCHAR(191) NULL,
    MODIFY `moisture` VARCHAR(191) NULL,
    MODIFY `carbonConten` VARCHAR(191) NULL,
    MODIFY `mfgDate` DATETIME(3) NULL,
    MODIFY `expiryDate` DATETIME(3) NULL,
    MODIFY `anaysisDate` DATETIME(3) NULL,
    MODIFY `printedDate` DATETIME(3) NULL,
    MODIFY `forignMater` VARCHAR(191) NULL,
    MODIFY `weightOfChips` VARCHAR(191) NULL,
    MODIFY `intrinsicViscosity` VARCHAR(191) NULL,
    MODIFY `ashContent` VARCHAR(191) NULL,
    MODIFY `issueBy` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'draft';
