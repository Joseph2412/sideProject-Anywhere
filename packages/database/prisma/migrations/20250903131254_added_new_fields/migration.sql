/*
  Warnings:

  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_venueId_fkey";

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "reviewComfort" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reviewOverall" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewQuiet" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reviewStaff" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reviewWifi" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "public"."Review";
