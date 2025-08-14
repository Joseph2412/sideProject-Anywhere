/*
  Warnings:

  - You are about to drop the column `isClosed` on the `ClosingPeriod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ClosingPeriod" DROP COLUMN "isClosed";
