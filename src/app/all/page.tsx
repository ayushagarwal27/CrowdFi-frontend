// @ts-nocheck
"use client";
import { getProvider } from "@/calls/calls";
import { useTransactionToast } from "@/components/ui/ui-layout";
import programInfo from "@/constants/programInfo";
import { Program, web3 } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import React, { useEffect, useState } from "react";

const AllPage = () => {
  const [donateAmount, setDonateAmount] = useState(0);
  const [allCampaign, setAllCampaigns] = useState([]);

  const wallet = useWallet();
  const { connection } = useConnection();

  const anchorProvider = getProvider(connection, wallet);
  const program = new Program(programInfo.idl_object, anchorProvider);

  const transactionToast = useTransactionToast();

  useEffect(() => {
    async function getAllCampaigns() {
      // @ts-ignore
      const res = await program.account.campaign.all();
      console.log(res);

      setAllCampaigns(res);
    }
    getAllCampaigns();
  }, []);

  async function handleDonate(cmp) {
    console.log(cmp);
    const [campaign_vault, config_bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("campaign_vault"), cmp.publicKey.toBuffer()],
      programInfo.programID
    );
    const [campaign_mint, mint_bump_aas] = PublicKey.findProgramAddressSync(
      [Buffer.from("reward_mint"), cmp.publicKey.toBuffer()],
      programInfo.programID
    );
    const [donation_info, mint_bump_as] = PublicKey.findProgramAddressSync(
      [Buffer.from("donation"), cmp.publicKey.toBuffer()],
      programInfo.programID
    );
    try {
      const configs = await program.account.config.all();
      console.log(cmp);

      const adminConfig = configs.filter(
        (cm) => cm.publicKey.toBase58() === cmp.account.config.toBase58()
      )[0];
      const userRewardAtaB = await getAssociatedTokenAddress(
        campaign_mint,
        wallet.publicKey
      );
      const tx = await program.methods
        .donate(
          new BN(donateAmount * web3.LAMPORTS_PER_SOL) // Donating the amount plus the an offset
        )
        .accountsPartial({
          campaign: cmp.publicKey,
          config: cmp.account.config,
          campaignAdmin: cmp.account.admin,
          admin: adminConfig.account.admin,
          vault: campaign_vault,
          rewardMint: campaign_mint,
          // userRewardAta: userRewardAtaB,
          // donationInfo: donation_info,
          // tokenProgram: TOKEN_2022_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc();
      transactionToast(tx);
    } catch (err) {
      toast.error(`${err}`);
    }
  }

  return (
    <div
      className={
        "grid md:grid-cols-2 lg:grid-cols-3 mt-[60px] max-w-7xl mx-auto flex-wrap  gap-4 w-full"
      }
    >
      {allCampaign.map((cmp, i) => {
        return (
          <div
            key={i}
            className={
              "p-4 bg-white/40  flex gap-4 flex-col min-w-[300px] rounded-lg border-2 border-green-600 hover:shadow-2xl hover:-translate-y-[2px] duration-200 hover:shadow-green-300"
            }
          >
            <h2 className="capitalize text-xl text-center text-green-600 relative">
              {cmp?.account.title}
              <div
                className={`absolute text-green-100  rotate-45 right-[-45px] top-[-20px] badge ${
                  !cmp.account.isCompleted ? "badge-success" : "badge-error"
                }`}
              >
                {!cmp.account.isCompleted ? "Active" : "Closed"}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                onClick={() => {
                  window.open(
                    cmp?.account.url,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="size-6 absolute right-2 top-0 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            </h2>

            <p
              className={
                " py-4 px-1 mt-auto rounded text-green-800 text-md capitalize"
              }
            >
              {cmp?.account.description}
            </p>
            <progress
              className="progress progress-success w-full"
              value={
                (Number(cmp?.account.currentAmount / LAMPORTS_PER_SOL) /
                  Number(cmp?.account.targetAmount?.toString())) *
                100
              }
              max="100"
            ></progress>
            <div className={" mt-[-12px] flex justify-between"}>
              <p className={"font-semibold text-xs text-green-600"}>
                Target:{" "}
                <span className={"text-green-600 text-xs font-normal"}>
                  {cmp?.account.targetAmount?.toString()} SOL
                </span>
              </p>
              <p className={"font-semibold text-xs text-green-600"}>
                Raised:{" "}
                <span className={"text-green-600 text-xs font-normal"}>
                  {(cmp?.account.currentAmount / LAMPORTS_PER_SOL).toString()}{" "}
                  SOL
                </span>
              </p>
            </div>
            <form
              className="flex gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleDonate(cmp);
              }}
            >
              <input
                type="number"
                placeholder="1 SOL"
                min={1}
                disabled={cmp.account.isCompleted}
                value={donateAmount}
                className="input input-bordered w-full max-w-xs bg-green-100"
                onChange={(e) => setDonateAmount(Number(e.target.value))}
              />
              <button
                disabled={cmp.account.isCompleted}
                className="btn mt-auto btn-neutral text-white border-none bg-green-900 cus-btn-disabled"
              >
                Donate
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
};

export default AllPage;
