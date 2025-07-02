/*
  Warnings:

  - A unique constraint covering the columns `[property_name]` on the table `product_standards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `product_standards_property_name_key` ON `product_standards`(`property_name`);
