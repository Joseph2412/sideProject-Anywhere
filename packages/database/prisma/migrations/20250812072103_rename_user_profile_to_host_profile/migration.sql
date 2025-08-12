/*
  Warnings:

  - You are about to drop the column `isEnable` on the `ClosingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `close` on the `OpeningHour` table. All the data in the column will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[openingHourId,start,end]` on the table `OpeningPeriod` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `start` on the `OpeningPeriod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end` on the `OpeningPeriod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."UserProfile" DROP CONSTRAINT "UserProfile_coworkingVenueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropIndex
DROP INDEX "public"."OpeningPeriod_openingHourId_start_end_idx";

-- AlterTable
ALTER TABLE "public"."ClosingPeriod" DROP COLUMN "isEnable",
ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."OpeningHour" DROP COLUMN "close";

-- AlterTable
ALTER TABLE "public"."OpeningPeriod" DROP COLUMN "start",
ADD COLUMN     "start" INTEGER NOT NULL,
DROP COLUMN "end",
ADD COLUMN     "end" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."UserProfile";

-- CreateTable
CREATE TABLE "public"."HostProfile" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "preferences" JSONB,
    "coworkingVenueId" INTEGER,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HostProfile_userId_key" ON "public"."HostProfile"("userId");

-- CreateIndex
CREATE INDEX "HostProfile_coworkingVenueId_idx" ON "public"."HostProfile"("coworkingVenueId");

-- CreateIndex
CREATE INDEX "HostProfile_createdAt_idx" ON "public"."HostProfile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OpeningPeriod_openingHourId_start_end_key" ON "public"."OpeningPeriod"("openingHourId", "start", "end");

-- AddForeignKey
ALTER TABLE "public"."HostProfile" ADD CONSTRAINT "HostProfile_coworkingVenueId_fkey" FOREIGN KEY ("coworkingVenueId") REFERENCES "public"."CoworkingVenue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HostProfile" ADD CONSTRAINT "HostProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
