/*
  Warnings:

  - You are about to drop the `OpeningPeriod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."OpeningPeriod" DROP CONSTRAINT "OpeningPeriod_openingDaysId_fkey";

-- AlterTable
ALTER TABLE "public"."OpenDays" ADD COLUMN     "periods" TEXT[];

-- DropTable
DROP TABLE "public"."OpeningPeriod";
