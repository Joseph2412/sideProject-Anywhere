/*
  Warnings:

  - Added the required column `costumerName` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "costumerEmail" TEXT,
ADD COLUMN     "costumerName" TEXT NOT NULL;
