-- CreateTable
CREATE TABLE `product_standards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `property_name` VARCHAR(191) NOT NULL,
    `target_value` DOUBLE NOT NULL,
    `tolerance` DOUBLE NULL,
    `operator` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lot_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lot_id` INTEGER NOT NULL,
    `property_name` VARCHAR(191) NOT NULL,
    `actual_value` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_standards` ADD CONSTRAINT `product_standards_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `master_product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
