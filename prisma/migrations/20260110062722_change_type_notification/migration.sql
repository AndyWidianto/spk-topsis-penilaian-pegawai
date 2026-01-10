-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `type` ENUM('super_private', 'private', 'public') NOT NULL DEFAULT 'public';
