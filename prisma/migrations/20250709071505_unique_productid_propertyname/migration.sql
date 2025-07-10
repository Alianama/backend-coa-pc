/*
  Warnings:

  - You are about to drop the column `pellet_visual` on the `print_coa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id,property_name]` on the table `product_standards` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `product_standards_property_name_key` ON `product_standards`;

-- AlterTable
ALTER TABLE `print_coa` DROP COLUMN `pellet_visual`;

-- CreateIndex
CREATE UNIQUE INDEX `product_standards_product_id_property_name_key` ON `product_standards`(`product_id`, `property_name`);
