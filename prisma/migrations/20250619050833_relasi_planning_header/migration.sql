/*
  Warnings:

  - You are about to drop the `palnning` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `palnning`;

-- AddForeignKey
ALTER TABLE `planning_header` ADD CONSTRAINT `planning_header_id_cust_fkey` FOREIGN KEY (`id_cust`) REFERENCES `master_customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planning_header` ADD CONSTRAINT `planning_header_id_prod_fkey` FOREIGN KEY (`id_prod`) REFERENCES `master_product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
