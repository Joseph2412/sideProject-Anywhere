-- AlterTable
ALTER TABLE "public"."ClosingPeriod" ADD COLUMN     "singleDate" TIMESTAMP(3),
ALTER COLUMN "start" DROP NOT NULL,
ALTER COLUMN "end" DROP NOT NULL;
