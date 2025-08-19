/*
  Warnings:

  - You are about to drop the column `coworkingVenueId` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the `CoworkingVenue` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[venueId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."ClosingPeriod" DROP CONSTRAINT "ClosingPeriod_venueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CoworkingVenue" DROP CONSTRAINT "CoworkingVenue_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OpenDays" DROP CONSTRAINT "OpenDays_venueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Package" DROP CONSTRAINT "Package_coworkingVenueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentInfo" DROP CONSTRAINT "PaymentInfo_venueId_fkey";

-- DropIndex
DROP INDEX "public"."Package_coworkingVenueId_idx";

-- AlterTable
ALTER TABLE "public"."Package" DROP COLUMN "coworkingVenueId",
ADD COLUMN     "venueId" INTEGER;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "venueId" INTEGER;

-- DropTable
DROP TABLE "public"."CoworkingVenue";

-- CreateTable
CREATE TABLE "public"."Venue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "services" TEXT[],
    "description" VARCHAR(200),
    "photos" TEXT[],
    "logoURL" TEXT,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Venue_name_idx" ON "public"."Venue"("name");

-- CreateIndex
CREATE INDEX "Package_venueId_idx" ON "public"."Package"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "User_venueId_key" ON "public"."User"("venueId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpenDays" ADD CONSTRAINT "OpenDays_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Package" ADD CONSTRAINT "Package_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClosingPeriod" ADD CONSTRAINT "ClosingPeriod_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentInfo" ADD CONSTRAINT "PaymentInfo_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
