-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "startTimestamp" SET DATA TYPE TEXT,
ALTER COLUMN "endTimestamp" SET DATA TYPE TEXT,
ALTER COLUMN "targetAmount" SET DATA TYPE TEXT,
ALTER COLUMN "currentAmount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Config" ALTER COLUMN "maxDuration" SET DATA TYPE TEXT,
ALTER COLUMN "maxAmount" SET DATA TYPE TEXT,
ALTER COLUMN "seed" SET DATA TYPE TEXT;
