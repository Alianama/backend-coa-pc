/*
  Warnings:

  - You are about to alter the column `qcJudgment` on the `planningdetail` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `planningdetail` MODIFY `qcJudgment` VARCHAR(191) NULL;
