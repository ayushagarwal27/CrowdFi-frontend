/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `Config` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_configKey_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Config_publicKey_key" ON "Config"("publicKey");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_configKey_fkey" FOREIGN KEY ("configKey") REFERENCES "Config"("publicKey") ON DELETE RESTRICT ON UPDATE CASCADE;
