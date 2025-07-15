/*
  Warnings:

  - You are about to alter the column `dispersion` on the `planning_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `dispersion` on the `print_coa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `planning_details` MODIFY `dispersion` DOUBLE NULL;

-- AlterTable
ALTER TABLE `print_coa` MODIFY `dispersion` DOUBLE NULL;

-- AlterTable
ALTER TABLE `product_standards` MODIFY `property_name` ENUM('colorDeltaL', 'colorDeltaA', 'colorDeltaB', 'colorDeltaE', 'tintDeltaL', 'tintDeltaA', 'tintDeltaB', 'tintDeltaE', 'deltaP', 'density', 'mfr', 'dispersibility', 'contamination', 'macaroni', 'pelletLength', 'pelletDiameter', 'visualCheck', 'moisture', 'carbonContent', 'foreignMatter', 'weightOfChips', 'intrinsicViscosity', 'ashContent', 'heatStability', 'lightFastness', 'granule', 'caCO3', 'hals', 'hiding', 'odor', 'nucleatingAgent', 'dispersion') NOT NULL;
