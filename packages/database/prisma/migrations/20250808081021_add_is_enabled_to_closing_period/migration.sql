/*
  Warnings:

  - Changed the type of `start` on the `OpeningPeriod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end` on the `OpeningPeriod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."OpeningPeriod" DROP COLUMN "start",
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL,
DROP COLUMN "end",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."ClosingPeriod" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "venueId" INTEGER NOT NULL,
    "isEnable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClosingPeriod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ClosingPeriod" ADD CONSTRAINT "ClosingPeriod_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."CoworkingVenue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
