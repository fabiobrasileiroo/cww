-- AlterTable
ALTER TABLE `Event` ADD COLUMN `urlEvento` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `habilidades` VARCHAR(191) NULL,
    ADD COLUMN `midiasSocias` VARCHAR(191) NULL;
