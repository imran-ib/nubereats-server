/*
  Warnings:

  - The `dishOptions` column on the `Dish` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `orderItemOptions` column on the `OrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "dishOptions",
ADD COLUMN     "dishOptions" JSONB[];

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "orderItemOptions",
ADD COLUMN     "orderItemOptions" JSONB[];
