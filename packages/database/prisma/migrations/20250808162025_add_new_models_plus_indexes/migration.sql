/*
  Warnings:

  - The values [SALA_MEETING] on the enum `typeCoworking` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(8)`.
  - A unique constraint covering the columns `[venueId,day]` on the table `OpeningHour` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[packageId,name,rate]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."CountryCode" AS ENUM ('AD', 'AL', 'AM', 'AT', 'AZ', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'GE', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'RU', 'SE', 'SI', 'SK', 'SM', 'TR', 'UA', 'VA');

-- CreateEnum
CREATE TYPE "public"."CurrencyCode" AS ENUM ('EUR', 'ALL', 'AMD', 'AZN', 'BAM', 'BGN', 'BYN', 'CHF', 'CZK', 'DKK', 'GEL', 'GBP', 'HUF', 'ISK', 'MDL', 'MKD', 'NOK', 'PLN', 'RON', 'RUB', 'RSD', 'SEK', 'TRY', 'UAH');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."typeCoworking_new" AS ENUM ('SALA', 'DESK');
ALTER TABLE "public"."Package" ALTER COLUMN "type" TYPE "public"."typeCoworking_new" USING ("type"::text::"public"."typeCoworking_new");
ALTER TYPE "public"."typeCoworking" RENAME TO "typeCoworking_old";
ALTER TYPE "public"."typeCoworking_new" RENAME TO "typeCoworking";
DROP TYPE "public"."typeCoworking_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" SET DATA TYPE VARCHAR(8);

-- CreateTable
CREATE TABLE "public"."PaymentInfo" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "iban" VARCHAR(34) NOT NULL,
    "bicSwift" VARCHAR(11) NOT NULL,
    "countryCode" "public"."CountryCode" NOT NULL,
    "currencyCode" "public"."CurrencyCode" NOT NULL,

    CONSTRAINT "PaymentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentInfo_iban_key" ON "public"."PaymentInfo"("iban");

-- CreateIndex
CREATE INDEX "PaymentInfo_currencyCode_idx" ON "public"."PaymentInfo"("currencyCode");

-- CreateIndex
CREATE INDEX "PaymentInfo_countryCode_idx" ON "public"."PaymentInfo"("countryCode");

-- CreateIndex
CREATE INDEX "ClosingPeriod_venueId_idx" ON "public"."ClosingPeriod"("venueId");

-- CreateIndex
CREATE INDEX "ClosingPeriod_venueId_start_end_idx" ON "public"."ClosingPeriod"("venueId", "start", "end");

-- CreateIndex
CREATE INDEX "CoworkingVenue_name_idx" ON "public"."CoworkingVenue"("name");

-- CreateIndex
CREATE INDEX "OpeningHour_venueId_idx" ON "public"."OpeningHour"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "OpeningHour_venueId_day_key" ON "public"."OpeningHour"("venueId", "day");

-- CreateIndex
CREATE INDEX "OpeningPeriod_openingHourId_idx" ON "public"."OpeningPeriod"("openingHourId");

-- CreateIndex
CREATE INDEX "OpeningPeriod_openingHourId_start_end_idx" ON "public"."OpeningPeriod"("openingHourId", "start", "end");

-- CreateIndex
CREATE INDEX "Package_coworkingVenueId_idx" ON "public"."Package"("coworkingVenueId");

-- CreateIndex
CREATE INDEX "Package_type_idx" ON "public"."Package"("type");

-- CreateIndex
CREATE INDEX "Package_capacity_idx" ON "public"."Package"("capacity");

-- CreateIndex
CREATE INDEX "Plan_packageId_isEnabled_idx" ON "public"."Plan"("packageId", "isEnabled");

-- CreateIndex
CREATE INDEX "Plan_packageId_idx" ON "public"."Plan"("packageId");

-- CreateIndex
CREATE INDEX "Plan_price_idx" ON "public"."Plan"("price");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_packageId_name_rate_key" ON "public"."Plan"("packageId", "name", "rate");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "UserProfile_coworkingVenueId_idx" ON "public"."UserProfile"("coworkingVenueId");

-- CreateIndex
CREATE INDEX "UserProfile_createdAt_idx" ON "public"."UserProfile"("createdAt");
