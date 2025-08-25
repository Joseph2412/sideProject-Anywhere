-- DropForeignKey
ALTER TABLE "public"."PackagePlan" DROP CONSTRAINT "PackagePlan_packageId_fkey";

-- AddForeignKey
ALTER TABLE "public"."PackagePlan" ADD CONSTRAINT "PackagePlan_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
