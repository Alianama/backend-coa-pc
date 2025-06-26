/*
  Warnings:

  - You are about to drop the column `pelletHeight` on the `print_coa` table. All the data in the column will be lost.
  - You are about to drop the `lot_results` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `printedDate` on table `print_coa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `print_coa` DROP COLUMN `pelletHeight`,
    ADD COLUMN `pelletDiameter` DOUBLE NULL,
    ADD COLUMN `planningId` INTEGER NULL,
    ADD COLUMN `resin` VARCHAR(191) NULL,
    MODIFY `printedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `lot_results`;
