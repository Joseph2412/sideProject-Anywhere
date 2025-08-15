/*
  Warnings:

  - A unique constraint covering the columns `[venueId]` on the table `PaymentInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `venueId` to the `PaymentInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PaymentInfo" ADD COLUMN     "venueId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentInfo_venueId_key" ON "public"."PaymentInfo"("venueId");

-- AddForeignKey
ALTER TABLE "public"."PaymentInfo" ADD CONSTRAINT "PaymentInfo_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."CoworkingVenue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
