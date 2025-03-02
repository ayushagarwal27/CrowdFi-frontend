"use client";
import React, { FormEvent, useState } from "react";
import { initializeConfig } from "../../calls/calls";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const CreateCampaign = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [maxAmount, setMaxAmount] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);

  async function createConfig(e: FormEvent) {
    e.preventDefault();
    if (!maxAmount || !maxDuration) {
      return;
    }
    const res = await initializeConfig(
      connection,
      wallet,
      maxDuration,
      maxAmount
    );
    console.log(res);
  }
  return (
    <div
      className={"h-full w-full mt-[100px]  flex justify-center items-center"}
    >
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
          className="input input-bordered input-ghost  w-full "
          value={maxDuration}
          onChange={(e) => setMaxDuration(Number(e.target.value))}
        />
        <label className={"text-xs self-start -mb-2 text-gray-400"}>
          Max Amount (SOL)
        </label>
        <input
          type="number"
          min={0.1}
          //   step={0.5}
          max={2000}
          placeholder="Target Amount"
          className="input input-bordered input-ghost  w-full "
          value={maxAmount}
          onChange={(e) => setMaxAmount(Number(e.target.value))}
        />

        <button className={"btn bg-green-700 text-white self-stretch"}>
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
