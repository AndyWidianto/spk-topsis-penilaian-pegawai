-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_user_id_fkey`;

-- DropIndex
DROP INDEX `notifications_user_id_fkey` ON `notifications`;

-- AlterTable
ALTER TABLE `notifications` MODIFY `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
