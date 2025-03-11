"use client";
import React, { FormEvent, useState } from "react";
import { initializeConfig } from "../../calls/calls";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { useTransactionToast } from "@/components/ui/ui-layout";
import { useRouter } from "next/navigation";

const CreateCampaign = () => {
  const router = useRouter();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [maxAmount, setMaxAmount] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const transactionToast = useTransactionToast();
  const [isLoading, setIsLoading] = useState(false);

  async function createConfig(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    if (!maxAmount || !maxDuration) {
      return;
    }
    try {
      const { tx, seed, maxDurationS, maxAmountS, fee, bump, configKey } =
        await initializeConfig(connection, wallet, maxDuration, maxAmount);
      transactionToast(tx);
      await fetch("/api/config", {
        method: "POST",
        body: JSON.stringify({
          publicKey: configKey.toString(),
          admin: wallet.publicKey?.toString(),
          seed,
          maxDuration: maxDurationS,
          maxAmount: maxAmountS,
          fee,
          bump,
        }),
      });
      router.push("/all");
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={"h-full w-full   flex justify-center items-center"}>
      <form
        className={
          "flex bg-white/30  flex-col gap-4 p-[52px] text-center items-center border-[0.3px] border-green-800  text-white rounded-lg w-[650px]"
        }
        onSubmit={createConfig}
      >
        <p className="text-green-700">Create Config</p>

        <label className={"text-xs self-start -mb-2 text-gray-400"}>
          Max Duration (Days)
        </label>
        <input
          type="number"
          min={1}
          step={1}
          max={1000}
          placeholder="Target Amount"
          className="input input-bordered input-ghost  w-full text-gray-400"
          value={maxDuration}
          onChange={(e) => setMaxDuration(Number(e.target.value))}
        />
        <label className={"text-xs self-start -mb-2 text-gray-400"}>
          Max Amount (SOL)
        </label>
        <input
          type="number"
          min={1}
          max={2000}
          placeholder="Target Amount"
          className="input input-bordered input-ghost  w-full text-gray-400"
          value={maxAmount}
          onChange={(e) => setMaxAmount(Number(e.target.value))}
        />

        <button
          className={"btn bg-green-700 text-white self-stretch"}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner text-accent"></span>
          ) : (
            "Create"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
