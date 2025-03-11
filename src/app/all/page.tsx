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
import toast from "react-hot-toast";

const AllPage = () => {
  const [donateAmount, setDonateAmount] = useState(0);
  const [allCampaign, setAllCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();

  const anchorProvider = getProvider(connection, wallet);
  const program = new Program(programInfo.idl_object, anchorProvider);

  const transactionToast = useTransactionToast();

  async function getAllCampaigns() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      console.log(data);

      setAllCampaigns(data.data);
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getAllCampaigns();
  }, []);

  async function handleDonate(cmp) {
    const [campaign, campaign_bump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign"),
        Buffer.from(cmp.title),
        new PublicKey(cmp.admin).toBuffer(),
      ],
      program.programId
    );
    const [campaign_vault, config_bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("campaign_vault"), campaign.toBuffer()],
      programInfo.programID
    );
    const [campaign_mint, mint_bump_aas] = PublicKey.findProgramAddressSync(
      [Buffer.from("reward_mint"), campaign.toBuffer()],
      programInfo.programID
    );
    const [donation_info, mint_bump_as] = PublicKey.findProgramAddressSync(
      [Buffer.from("donation"), campaign.toBuffer()],
      programInfo.programID
    );
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      const configs = data.data;
      // console.log(configs, cmp);

      const adminConfig = configs.filter(
        (cm) => cm.publicKey === cmp.configKey
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
          campaign,
          config: new PublicKey(cmp.configKey),
          campaignAdmin: new PublicKey(cmp.admin),
          admin: new PublicKey(adminConfig.admin),
          vault: campaign_vault,
          rewardMint: campaign_mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc();
      transactionToast(tx);
      await fetch(`/api/campaign/donate?id=${cmp.id}&amount=${donateAmount}`, {
        method: "PATCH",
      });
      getAllCampaigns();
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
      {isLoading && (
        <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loading loading-spinner text-success size-24"></span>
      )}
      {allCampaign.map((cmp, i) => {
        return (
          <div
            key={i}
            className={
              "p-4 bg-white/40  flex gap-4 flex-col min-w-[300px] rounded-lg border-2 border-green-600 hover:shadow-2xl hover:-translate-y-[2px] duration-200 hover:shadow-green-300"
            }
          >
            <h2 className="capitalize text-xl text-center text-green-600 relative">
              {cmp?.title}
              <div
                className={`absolute text-green-100  rotate-45 right-[-45px] top-[-20px] badge ${
                  !cmp.isCompleted ? "badge-success" : "badge-error"
                }`}
              >
                {!cmp.isCompleted ? "Active" : "Closed"}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                onClick={() => {
                  window.open(cmp?.url, "_blank", "noopener,noreferrer");
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
              {cmp?.description}
            </p>
            <progress
              className="progress progress-success w-full"
              value={
                (Number(cmp?.currentAmount) / Number(cmp?.targetAmount)) * 100
              }
              max="100"
            ></progress>
            <div className={" mt-[-12px] flex justify-between"}>
              <p className={"font-semibold text-xs text-green-600"}>
                Target:{" "}
                <span className={"text-green-600 text-xs font-normal"}>
                  {cmp?.targetAmount} SOL
                </span>
              </p>
              <p className={"font-semibold text-xs text-green-600"}>
                Raised:{" "}
                <span className={"text-green-600 text-xs font-normal"}>
                  {cmp?.currentAmount} SOL
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
                disabled={cmp.isCompleted}
                value={donateAmount}
                className="input input-bordered w-full max-w-xs bg-green-100"
                onChange={(e) => setDonateAmount(Number(e.target.value))}
              />
              <button
                disabled={cmp.isCompleted}
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
