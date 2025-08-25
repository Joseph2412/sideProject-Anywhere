/*
  Warnings:

  - You are about to drop the column `title` on the `Package` table. All the data in the column will be lost.
  - Added the required column `name` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Package" DROP COLUMN "title",
ADD COLUMN     "name" VARCHAR(200) NOT NULL;
