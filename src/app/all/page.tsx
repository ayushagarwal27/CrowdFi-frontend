// @ts-nocheck
"use client";
import { getProvider } from "@/calls/calls";
import programInfo from "@/constants/programInfo";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";

const AllPage = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const anchorProvider = getProvider(connection, wallet);
  const program = new Program(programInfo.idl_object, anchorProvider);

  const [allCampaign, setAllCampaigns] = useState([]);
  useEffect(() => {
    async function getAllCampaigns() {
      // @ts-ignore
      const res = await program.account.campaign.all();
      setAllCampaigns(res);
    }
    getAllCampaigns();
  }, []);

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
            <h2 className="capitalize text-xl text-center text-green-600">
              {cmp?.account.title}
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
                (Number(cmp?.account.currentAmount?.toString()) /
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
                  {cmp?.account.currentAmount?.toString()} SOL
                </span>
              </p>
            </div>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="1 SOL"
                className="input input-bordered w-full max-w-xs bg-green-100"
              />
              <button className="btn mt-auto btn-neutral text-white border-none bg-green-900 cus-btn-disabled">
                Donate
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllPage;
