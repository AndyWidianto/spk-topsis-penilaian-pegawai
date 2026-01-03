-- AlterTable
ALTER TABLE `users` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `refresh_token` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('super_admin', 'admin', 'user') NOT NULL DEFAULT 'user';
