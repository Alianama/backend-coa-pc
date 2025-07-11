/*
  Warnings:

  - You are about to alter the column `property_name` on the `product_standards` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `product_standards` MODIFY `property_name` ENUM('COLOR_DELTA_L', 'COLOR_DELTA_A', 'COLOR_DELTA_B', 'COLOR_DELTA_E', 'TINT_DELTA_L', 'TINT_DELTA_A', 'TINT_DELTA_B', 'TINT_DELTA_E', 'DELTA_P', 'DENSITY', 'MFR', 'DISPERSIBILITY', 'CONTAMINATION', 'MACARONI', 'PELLET_LENGTH', 'PELLET_DIAMETER', 'VISUAL_CHECK', 'MOISTURE', 'CARBON_CONTENT', 'FOREIGN_MATTER', 'WEIGHT_OF_CHIPS', 'INTRINSIC_VISCOSITY', 'ASH_CONTENT', 'HEAT_STABILITY', 'LIGHT_FASTNESS', 'GRANULE', 'CACO3', 'HALS', 'HIDING', 'ODOR', 'NUCLEATING_AGENT') NOT NULL;
