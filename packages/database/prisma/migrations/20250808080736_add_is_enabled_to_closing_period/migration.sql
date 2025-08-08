/*
  Warnings:

  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."PlansRate" AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."typeCoworking" AS ENUM ('SALA', 'DESK', 'SALA_MEETING');

-- CreateEnum
CREATE TYPE "public"."WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry";

-- CreateTable
CREATE TABLE "public"."UserProfile" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "preferences" JSONB,
    "coworkingVenueId" INTEGER,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CoworkingVenue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "services" TEXT[],
    "description" VARCHAR(200) NOT NULL,
    "photos" TEXT[],

    CONSTRAINT "CoworkingVenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Package" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(200),
    "squareMetres" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "services" TEXT[],
    "type" "public"."typeCoworking" NOT NULL,
    "photos" TEXT[],
    "coworkingVenueId" INTEGER,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rate" "public"."PlansRate" NOT NULL,
    "price" INTEGER NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpeningHour" (
    "id" SERIAL NOT NULL,
    "day" "public"."WeekDay" NOT NULL,
    "close" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "OpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpeningPeriod" (
    "id" SERIAL NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "openingHourId" INTEGER NOT NULL,

    CONSTRAINT "OpeningPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "public"."UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_coworkingVenueId_fkey" FOREIGN KEY ("coworkingVenueId") REFERENCES "public"."CoworkingVenue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Package" ADD CONSTRAINT "Package_coworkingVenueId_fkey" FOREIGN KEY ("coworkingVenueId") REFERENCES "public"."CoworkingVenue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plan" ADD CONSTRAINT "Plan_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpeningHour" ADD CONSTRAINT "OpeningHour_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."CoworkingVenue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpeningPeriod" ADD CONSTRAINT "OpeningPeriod_openingHourId_fkey" FOREIGN KEY ("openingHourId") REFERENCES "public"."OpeningHour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
