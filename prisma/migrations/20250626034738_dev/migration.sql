-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `token_version` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `print_coa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('REQUESTED', 'APPROVED', 'REJECTED') NOT NULL,
    `planning_id` INTEGER NULL,
    `costumer_name` VARCHAR(191) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `lot_number` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NULL,
    `let_down_ratio` VARCHAR(191) NULL,
    `resin` VARCHAR(191) NULL,
    `pellet_length` DOUBLE NULL,
    `pellet_diameter` DOUBLE NULL,
    `pellet_visual` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `dispersibility` DOUBLE NULL,
    `mfr` DOUBLE NULL,
    `density` DOUBLE NULL,
    `moisture` DOUBLE NULL,
    `carbon_content` DOUBLE NULL,
    `mfg_date` DATETIME(3) NULL,
    `expiry_date` DATETIME(3) NULL,
    `analysis_date` DATETIME(3) NULL,
    `printed_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `foreign_matter` DOUBLE NULL,
    `weight_of_chips` DOUBLE NULL,
    `intrinsic_viscosity` DOUBLE NULL,
    `ash_content` DOUBLE NULL,
    `heat_stability` DOUBLE NULL,
    `light_fastness` DOUBLE NULL,
    `granule` DOUBLE NULL,
    `tint_delta_e` DOUBLE NULL,
    `color_delta_e` DOUBLE NULL,
    `delta_p` DOUBLE NULL,
    `macaroni` DOUBLE NULL,
    `issue_by` VARCHAR(191) NULL,
    `approved_by` INTEGER NULL,
    `approved_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `printed_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permissions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `role_permissions_role_id_permission_id_key`(`role_id`, `permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(191) NOT NULL,
    `resin` VARCHAR(191) NULL,
    `let_down_ratio` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_standards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `property_name` VARCHAR(191) NOT NULL,
    `target_value` DOUBLE NOT NULL,
    `tolerance` DOUBLE NULL,
    `operator` ENUM('PLUS_MINUS', 'LESS_THAN', 'LESS_EQUAL', 'GREATER_THAN', 'GREATER_EQUAL') NOT NULL,
    `unit` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deleted_coa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `costumer_name` VARCHAR(191) NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `lot_number` VARCHAR(191) NOT NULL,
    `let_down_ratio` VARCHAR(191) NULL,
    `pellet_length` DOUBLE NULL,
    `pellet_height` DOUBLE NULL,
    `pellet_visual` BOOLEAN NULL,
    `color` VARCHAR(191) NULL,
    `dispersibility` VARCHAR(191) NULL,
    `mfr` DOUBLE NULL,
    `density` DOUBLE NULL,
    `moisture` DOUBLE NULL,
    `carbon_content` DOUBLE NULL,
    `mfg_date` DATETIME(3) NULL,
    `expiry_date` DATETIME(3) NULL,
    `analysis_date` DATETIME(3) NULL,
    `printed_date` DATETIME(3) NULL,
    `foreign_matter` VARCHAR(191) NULL,
    `weight_of_chips` DOUBLE NULL,
    `intrinsic_viscosity` DOUBLE NULL,
    `ash_content` DOUBLE NULL,
    `heat_stability` DOUBLE NULL,
    `light_fastness` DOUBLE NULL,
    `granule` VARCHAR(191) NULL,
    `delta_e` DOUBLE NULL,
    `macaroni` DOUBLE NULL,
    `issue_by` VARCHAR(191) NULL,
    `approved_by` INTEGER NULL,
    `approved_date` DATETIME(3) NULL,
    `created_by` INTEGER NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_by` INTEGER NULL,
    `deleted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_restored` BOOLEAN NOT NULL DEFAULT false,
    `restored_at` DATETIME(3) NULL,
    `restored_by` INTEGER NULL,
    `original_id` INTEGER NOT NULL,

    UNIQUE INDEX `deleted_coa_original_id_key`(`original_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `master_customers_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mandatory_fields` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `field_name` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `mandatory_fields_field_name_idx`(`field_name`),
    UNIQUE INDEX `mandatory_fields_customer_id_field_name_key`(`customer_id`, `field_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `coa_id` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planning_headers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_customer` INTEGER NOT NULL,
    `id_product` INTEGER NOT NULL,
    `resin` VARCHAR(191) NOT NULL,
    `ratio` VARCHAR(191) NOT NULL,
    `moulding` VARCHAR(191) NOT NULL,
    `lot_number` VARCHAR(191) NOT NULL,
    `qty_planning` INTEGER NOT NULL,
    `quantity_print` DOUBLE NOT NULL DEFAULT 0,
    `quantity_check` DOUBLE NOT NULL DEFAULT 0,
    `mfg_date` DATETIME(3) NOT NULL,
    `expiry_date` DATETIME(3) NOT NULL,
    `status` ENUM('open', 'progress', 'close') NOT NULL DEFAULT 'open',
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planning_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qty` DOUBLE NOT NULL,
    `id_planning` INTEGER NOT NULL,
    `line_no` INTEGER NULL,
    `tint_delta_l` DOUBLE NULL,
    `tint_delta_a` DOUBLE NULL,
    `tint_delta_b` DOUBLE NULL,
    `tint_delta_e` DOUBLE NULL,
    `color_delta_l` DOUBLE NULL,
    `color_delta_a` DOUBLE NULL,
    `color_delta_b` DOUBLE NULL,
    `color_delta_e` DOUBLE NULL,
    `delta_p` DOUBLE NULL,
    `density` DOUBLE NULL,
    `mfr` DOUBLE NULL,
    `dispersibility` DOUBLE NULL,
    `contamination` DOUBLE NULL,
    `macaroni` DOUBLE NULL,
    `pellet_length` DOUBLE NULL,
    `pellet_diameter` DOUBLE NULL,
    `visual_check` VARCHAR(191) NULL,
    `moisture` DOUBLE NULL,
    `carbon_content` DOUBLE NULL,
    `foreign_matter` DOUBLE NULL,
    `weight_of_chips` DOUBLE NULL,
    `intrinsic_viscosity` DOUBLE NULL,
    `ash_content` DOUBLE NULL,
    `heat_stability` DOUBLE NULL,
    `light_fastness` DOUBLE NULL,
    `granule` DOUBLE NULL,
    `qc_judgment` VARCHAR(191) NULL,
    `analysis_date` DATETIME(3) NULL,
    `checked_by` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `print_coa` ADD CONSTRAINT `print_coa_printed_by_fkey` FOREIGN KEY (`printed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_products` ADD CONSTRAINT `master_products_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_standards` ADD CONSTRAINT `product_standards_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `master_products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deleted_coa` ADD CONSTRAINT `deleted_coa_restored_by_fkey` FOREIGN KEY (`restored_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mandatory_fields` ADD CONSTRAINT `mandatory_fields_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `master_customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_headers` ADD CONSTRAINT `planning_headers_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_headers` ADD CONSTRAINT `planning_headers_id_customer_fkey` FOREIGN KEY (`id_customer`) REFERENCES `master_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_headers` ADD CONSTRAINT `planning_headers_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `master_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_details` ADD CONSTRAINT `planning_details_id_planning_fkey` FOREIGN KEY (`id_planning`) REFERENCES `planning_headers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_details` ADD CONSTRAINT `planning_details_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
