/*
  Warnings:

  - You are about to drop the column `options` on the `Dish` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "options",
ADD COLUMN     "dishOptions" JSONB;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "options",
ADD COLUMN     "orderItemOptions" JSONB;
