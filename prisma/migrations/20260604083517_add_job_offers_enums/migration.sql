/*
  Warnings:

  - The values [PENDING,ACCEPTED,DECLINED] on the enum `OfferStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OfferStatus_new" AS ENUM ('DRAFT', 'SEND_FAILED', 'SENT', 'CANDIDATE_ACCEPTED', 'CANDIDATE_DECLINED', 'EXPIRED', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."JobOffer" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "JobOffer" ALTER COLUMN "status" TYPE "OfferStatus_new" USING ("status"::text::"OfferStatus_new");
ALTER TYPE "OfferStatus" RENAME TO "OfferStatus_old";
ALTER TYPE "OfferStatus_new" RENAME TO "OfferStatus";
DROP TYPE "public"."OfferStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "JobOffer" ALTER COLUMN "status" DROP DEFAULT;
