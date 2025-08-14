/*
  Warnings:

  - Changed the type of `countryCode` on the `PaymentInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `currencyCode` on the `PaymentInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "public"."PaymentInfo_countryCode_idx";

-- DropIndex
DROP INDEX "public"."PaymentInfo_currencyCode_idx";

-- AlterTable
ALTER TABLE "public"."PaymentInfo" DROP COLUMN "countryCode",
ADD COLUMN     "countryCode" VARCHAR(2) NOT NULL,
DROP COLUMN "currencyCode",
ADD COLUMN     "currencyCode" VARCHAR(3) NOT NULL;

-- DropEnum
DROP TYPE "public"."CountryCode";

-- DropEnum
DROP TYPE "public"."CurrencyCode";
