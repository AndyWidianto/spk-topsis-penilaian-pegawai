/*
  Warnings:

  - You are about to drop the `AsessmentDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Asessments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AsessmentDetails` DROP FOREIGN KEY `AsessmentDetails_asessment_id_fkey`;

-- DropForeignKey
ALTER TABLE `AsessmentDetails` DROP FOREIGN KEY `AsessmentDetails_criteria_id_fkey`;

-- DropForeignKey
ALTER TABLE `Asessments` DROP FOREIGN KEY `Asessments_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `Asessments` DROP FOREIGN KEY `Asessments_priode_id_fkey`;

-- DropTable
DROP TABLE `AsessmentDetails`;

-- DropTable
DROP TABLE `Asessments`;

-- CreateTable
CREATE TABLE `Assessments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `priode_id` INTEGER NOT NULL,
    `total_value` INTEGER NOT NULL,
    `ranking` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Assessments_employee_id_priode_id_key`(`employee_id`, `priode_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssessmentDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asessment_id` INTEGER NOT NULL,
    `criteria_id` INTEGER NOT NULL,
    `nilai` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Assessments` ADD CONSTRAINT `Assessments_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assessments` ADD CONSTRAINT `Assessments_priode_id_fkey` FOREIGN KEY (`priode_id`) REFERENCES `Priodes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentDetails` ADD CONSTRAINT `AssessmentDetails_asessment_id_fkey` FOREIGN KEY (`asessment_id`) REFERENCES `Assessments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentDetails` ADD CONSTRAINT `AssessmentDetails_criteria_id_fkey` FOREIGN KEY (`criteria_id`) REFERENCES `Criterias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
