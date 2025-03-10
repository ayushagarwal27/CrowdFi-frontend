/*
  Warnings:

  - You are about to drop the column `bump` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `rewardMintBump` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `vaultBump` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "bump",
DROP COLUMN "rewardMintBump",
DROP COLUMN "vaultBump";
