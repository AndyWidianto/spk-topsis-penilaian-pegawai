/*
  Warnings:

  - You are about to drop the column `asessment_id` on the `AssessmentDetails` table. All the data in the column will be lost.
  - Added the required column `assessment_id` to the `AssessmentDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AssessmentDetails` DROP FOREIGN KEY `AssessmentDetails_asessment_id_fkey`;

-- DropIndex
DROP INDEX `AssessmentDetails_asessment_id_fkey` ON `AssessmentDetails`;

-- AlterTable
ALTER TABLE `AssessmentDetails` DROP COLUMN `asessment_id`,
    ADD COLUMN `assessment_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `AssessmentDetails` ADD CONSTRAINT `AssessmentDetails_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `Assessments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
