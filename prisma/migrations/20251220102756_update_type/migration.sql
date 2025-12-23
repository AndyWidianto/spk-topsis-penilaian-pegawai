/*
  Warnings:

  - You are about to alter the column `nilai` on the `AsessmentDetails` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `total_value` on the `Asessments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - Added the required column `updatedAt` to the `Criterias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AsessmentDetails` MODIFY `nilai` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Asessments` MODIFY `total_value` INTEGER NOT NULL,
    MODIFY `ranking` INTEGER NULL;

-- AlterTable
ALTER TABLE `Criterias` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
