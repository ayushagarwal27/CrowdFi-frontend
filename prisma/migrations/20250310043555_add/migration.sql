/*
  Warnings:

  - A unique constraint covering the columns `[seed]` on the table `Config` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Config_seed_key" ON "Config"("seed");
