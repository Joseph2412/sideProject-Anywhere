/*
  Warnings:

  - A unique constraint covering the columns `[venueId,start,end]` on the table `ClosingPeriod` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClosingPeriod_venueId_start_end_key" ON "public"."ClosingPeriod"("venueId", "start", "end");
