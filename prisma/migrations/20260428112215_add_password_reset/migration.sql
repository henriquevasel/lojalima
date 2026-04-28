/*
  Warnings:

  - Added the required column `customerCpf` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `cep` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `customerCpf` VARCHAR(191) NOT NULL,
    ADD COLUMN `neighborhood` VARCHAR(191) NULL,
    ADD COLUMN `number` VARCHAR(191) NULL,
    ADD COLUMN `shippingCents` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `state` VARCHAR(191) NULL,
    ADD COLUMN `street` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `highlight` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `priority` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `emailVerifyExpires` DATETIME(3) NULL,
    ADD COLUMN `emailVerifyToken` VARCHAR(191) NULL,
    ADD COLUMN `passwordResetExpires` DATETIME(3) NULL,
    ADD COLUMN `passwordResetToken` VARCHAR(191) NULL;
