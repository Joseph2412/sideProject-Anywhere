-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'HOST');

-- CreateEnum
CREATE TYPE "public"."PlansRate" AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."typeCoworking" AS ENUM ('SALA', 'DESK');

-- CreateEnum
CREATE TYPE "public"."WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "public"."CountryCode" AS ENUM ('AD', 'AL', 'AM', 'AT', 'AZ', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'GE', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'RU', 'SE', 'SI', 'SK', 'SM', 'TR', 'UA', 'VA');

-- CreateEnum
CREATE TYPE "public"."CurrencyCode" AS ENUM ('EUR', 'ALL', 'AMD', 'AZN', 'BAM', 'BGN', 'BYN', 'CHF', 'CZK', 'DKK', 'GEL', 'GBP', 'HUF', 'ISK', 'MDL', 'MKD', 'NOK', 'PLN', 'RON', 'RUB', 'RSD', 'SEK', 'TRY', 'UAH');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HostProfile" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "preferences" JSONB,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CoworkingVenue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "services" TEXT[],
    "description" VARCHAR(200),
    "photos" TEXT[],
    "hostProfileId" INTEGER NOT NULL,
    "avatarURL" TEXT,

    CONSTRAINT "CoworkingVenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpenDays" (
    "id" SERIAL NOT NULL,
    "day" "public"."WeekDay" NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "OpenDays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpeningPeriod" (
    "id" SERIAL NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "openingDaysId" INTEGER NOT NULL,

    CONSTRAINT "OpeningPeriod_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "public"."ClosingPeriod" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "venueId" INTEGER NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClosingPeriod_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "HostProfile_userId_key" ON "public"."HostProfile"("userId");

-- CreateIndex
CREATE INDEX "HostProfile_createdAt_idx" ON "public"."HostProfile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CoworkingVenue_hostProfileId_key" ON "public"."CoworkingVenue"("hostProfileId");

-- CreateIndex
CREATE INDEX "CoworkingVenue_name_idx" ON "public"."CoworkingVenue"("name");

-- CreateIndex
CREATE INDEX "OpenDays_venueId_idx" ON "public"."OpenDays"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "OpenDays_venueId_day_key" ON "public"."OpenDays"("venueId", "day");

-- CreateIndex
CREATE INDEX "OpeningPeriod_openingDaysId_idx" ON "public"."OpeningPeriod"("openingDaysId");

-- CreateIndex
CREATE UNIQUE INDEX "OpeningPeriod_openingDaysId_start_end_key" ON "public"."OpeningPeriod"("openingDaysId", "start", "end");

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
CREATE INDEX "ClosingPeriod_venueId_idx" ON "public"."ClosingPeriod"("venueId");

-- CreateIndex
CREATE INDEX "ClosingPeriod_venueId_start_end_idx" ON "public"."ClosingPeriod"("venueId", "start", "end");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentInfo_iban_key" ON "public"."PaymentInfo"("iban");

-- CreateIndex
CREATE INDEX "PaymentInfo_currencyCode_idx" ON "public"."PaymentInfo"("currencyCode");

-- CreateIndex
CREATE INDEX "PaymentInfo_countryCode_idx" ON "public"."PaymentInfo"("countryCode");

-- AddForeignKey
ALTER TABLE "public"."HostProfile" ADD CONSTRAINT "HostProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoworkingVenue" ADD CONSTRAINT "CoworkingVenue_hostProfileId_fkey" FOREIGN KEY ("hostProfileId") REFERENCES "public"."HostProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpenDays" ADD CONSTRAINT "OpenDays_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."CoworkingVenue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpeningPeriod" ADD CONSTRAINT "OpeningPeriod_openingDaysId_fkey" FOREIGN KEY ("openingDaysId") REFERENCES "public"."OpenDays"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Package" ADD CONSTRAINT "Package_coworkingVenueId_fkey" FOREIGN KEY ("coworkingVenueId") REFERENCES "public"."CoworkingVenue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plan" ADD CONSTRAINT "Plan_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClosingPeriod" ADD CONSTRAINT "ClosingPeriod_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."CoworkingVenue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
