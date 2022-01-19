/*
  Warnings:

  - The `dishOptions` column on the `Dish` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "dishOptions",
ADD COLUMN     "dishOptions" JSONB[];
