/*
  Warnings:

  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Plan" DROP CONSTRAINT "Plan_packageId_fkey";

-- AlterTable
ALTER TABLE "public"."Package" ADD COLUMN     "seats" INTEGER,
ALTER COLUMN "squareMetres" DROP NOT NULL,
ALTER COLUMN "capacity" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Plan";

-- CreateTable
CREATE TABLE "public"."PackagePlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rate" "public"."PlansRate" NOT NULL,
    "price" INTEGER NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "PackagePlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PackagePlan_packageId_isEnabled_idx" ON "public"."PackagePlan"("packageId", "isEnabled");

-- CreateIndex
CREATE INDEX "PackagePlan_packageId_idx" ON "public"."PackagePlan"("packageId");

-- CreateIndex
CREATE INDEX "PackagePlan_price_idx" ON "public"."PackagePlan"("price");

-- CreateIndex
CREATE UNIQUE INDEX "PackagePlan_packageId_name_rate_key" ON "public"."PackagePlan"("packageId", "name", "rate");

-- AddForeignKey
ALTER TABLE "public"."PackagePlan" ADD CONSTRAINT "PackagePlan_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
