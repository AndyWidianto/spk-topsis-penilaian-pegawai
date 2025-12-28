/*
  Warnings:

  - You are about to alter the column `total_value` on the `Assessments` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,6)`.

*/
-- AlterTable
ALTER TABLE `Assessments` MODIFY `total_value` DECIMAL(10, 6) NULL;
