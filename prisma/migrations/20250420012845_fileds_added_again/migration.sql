-- AlterTable
ALTER TABLE `Project` ADD COLUMN `url` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `OpiniaoCowworking` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `opniao` VARCHAR(191) NOT NULL,
    `selo` ENUM('OURO', 'PRATA', 'BRONZE', 'LATAO') NOT NULL,

    UNIQUE INDEX `OpiniaoCowworking_eventId_key`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OpiniaoCowworking` ADD CONSTRAINT `OpiniaoCowworking_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
