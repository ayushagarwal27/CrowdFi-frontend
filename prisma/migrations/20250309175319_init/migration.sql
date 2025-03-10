-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "admin" TEXT NOT NULL,
    "maxDuration" BIGINT NOT NULL,
    "maxAmount" BIGINT NOT NULL,
    "fee" INTEGER NOT NULL,
    "bump" INTEGER NOT NULL,
    "seed" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "admin" TEXT NOT NULL,
    "configKey" TEXT NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "url" VARCHAR(250) NOT NULL,
    "startTimestamp" BIGINT NOT NULL,
    "endTimestamp" BIGINT NOT NULL,
    "targetAmount" BIGINT NOT NULL,
    "currentAmount" BIGINT NOT NULL,
    "bump" INTEGER NOT NULL,
    "vaultBump" INTEGER NOT NULL,
    "rewardMintBump" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_configKey_fkey" FOREIGN KEY ("configKey") REFERENCES "Config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
