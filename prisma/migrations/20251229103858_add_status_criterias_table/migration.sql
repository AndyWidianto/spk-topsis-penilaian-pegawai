-- AlterTable
ALTER TABLE `criterias` ADD COLUMN `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
