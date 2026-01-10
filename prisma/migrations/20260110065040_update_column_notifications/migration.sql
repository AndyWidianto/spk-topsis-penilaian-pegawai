/*
  Warnings:

  - You are about to alter the column `type` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `Enum(EnumId(5))`.
  - Added the required column `action_url` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `action_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `target_role` ENUM('super_admin', 'admin', 'all') NOT NULL DEFAULT 'all',
    MODIFY `type` ENUM('info', 'success', 'warning', 'error') NOT NULL DEFAULT 'success';
