# CrowdFi Dapp

A crowd funding dApp. Program is deployed on devnet.

User can :
  - create campaign, 
  - donate to other campaigns
  - close their campaign
  - update their campaign
  - users who donate get campaign tokens, minted to their public address

Admin can :
  - create config for campaign

## Run the App

1. `pnpm install`
2.  create `.env`
3. add postgressql `DATABASE_URL` in `.env`
4. `pnpm run dev`

## Tech Stack

 - Next.js
 - TailwindCSS
 - Solana Adapter
 - Prisma
 - PostgreSQL
 - Zod
 - Daisy UI
