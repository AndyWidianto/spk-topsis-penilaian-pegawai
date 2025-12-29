/*
  Warnings:

  - You are about to drop the `assessmentdetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `assessmentdetails` DROP FOREIGN KEY `AssessmentDetails_assessment_id_fkey`;

-- DropForeignKey
ALTER TABLE `assessmentdetails` DROP FOREIGN KEY `AssessmentDetails_criteria_id_fkey`;

-- DropForeignKey
ALTER TABLE `assessments` DROP FOREIGN KEY `Assessments_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `assessments` DROP FOREIGN KEY `Assessments_priode_id_fkey`;

-- DropTable
DROP TABLE `assessmentdetails`;

-- CreateTable
CREATE TABLE `assessment_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assessment_id` INTEGER NOT NULL,
    `criteria_id` INTEGER NOT NULL,
    `nilai` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_priode_id_fkey` FOREIGN KEY (`priode_id`) REFERENCES `priodes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessment_details` ADD CONSTRAINT `assessment_details_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessment_details` ADD CONSTRAINT `assessment_details_criteria_id_fkey` FOREIGN KEY (`criteria_id`) REFERENCES `criterias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `assessments_employee_id_priode_id_key` ON `assessments`(`employee_id`, `priode_id`);
DROP INDEX `Assessments_employee_id_priode_id_key` ON `assessments`;
