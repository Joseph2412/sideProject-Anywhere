-- DropIndex
DROP INDEX "public"."PaymentInfo_iban_key";

-- AlterTable
ALTER TABLE "public"."PaymentInfo" ALTER COLUMN "iban" DROP NOT NULL;
