/*
  Warnings:

  - The `options` column on the `Dish` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "options",
ADD COLUMN     "options" JSONB;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "options" DROP NOT NULL;
