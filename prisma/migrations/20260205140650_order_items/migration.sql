/*
  Warnings:

  - You are about to alter the column `mode` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - Added the required column `customerNome` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerWhats` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `customerEmail` VARCHAR(191) NULL,
    ADD COLUMN `customerNome` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerObs` VARCHAR(191) NULL,
    ADD COLUMN `customerWhats` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentMethod` ENUM('pix', 'cartao', 'boleto', 'whatsapp') NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `mode` ENUM('compra', 'projeto') NOT NULL,
    MODIFY `status` ENUM('enviado', 'pendente', 'concluido') NOT NULL DEFAULT 'enviado',
    MODIFY `total` DECIMAL(10, 2) NOT NULL;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `imagem` VARCHAR(191) NULL,
    `qty` INTEGER NOT NULL,

    INDEX `OrderItem_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Order_createdAt_idx` ON `Order`(`createdAt`);

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
