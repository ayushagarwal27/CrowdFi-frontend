"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { getProvider, initializeConfig } from "../../calls/calls";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import programInfo from "@/constants/programInfo";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useTransactionToast } from "@/components/ui/ui-layout";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CreateCampaign = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const anchorProvider = getProvider(connection, wallet);
  const program = new Program(programInfo.idl_object, anchorProvider);

  const transactionToast = useTransactionToast();
  const router = useRouter();

  useEffect(() => {
    async function getAllConfigAccounts() {
      // @ts-ignore
      const res = await fetch("/api/config", { cache: "no-cache" });
      const data = await res.json();
      setConfigs(data.data);
    }
    getAllConfigAccounts();
  }, []);

  console.log(selectedConfig);

  async function createCampaign(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    if (
      (!title || !description || !url || !targetAmount || !selectedConfig) &&
      startDate >= endDate
    ) {
      return;
    }

    const config = configs.find(
      // @ts-ignore
      (cf) => cf.seed === selectedConfig
      // @ts-ignore
    );
    const startTimeSamp = new Date(startDate).getMilliseconds();
    const endTimeSamp = new Date(endDate).getMilliseconds();

    try {
      const tx = await program.methods
        .createCampaign(
          title,
          description,
          url,
          new BN(targetAmount),
          new BN(startTimeSamp),
          new BN(endTimeSamp)
        )
        .accountsPartial({
          // @ts-ignore
          config: new PublicKey(config.publicKey),
          // @ts-ignore
          admin: new PublicKey(config.admin),
          // tokenProgram: TOKEN_2022_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      transactionToast(tx);
      await fetch("/api/campaign", {
        method: "POST",
        body: JSON.stringify({
          // @ts-ignore
          admin: config.admin,
          // @ts-ignore
          configKey: config.publicKey,
          title,
          description,
          url,
          startTimestamp: startTimeSamp.toString(),
          endTimestamp: endTimeSamp.toString(),
          targetAmount: targetAmount.toString(),
          currentAmount: "0",
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
    <div
      className={"h-full w-full mt-[60px]  flex justify-center items-center"}
    >
      <form
        className={
          "flex bg-white/30  flex-col gap-4 p-[52px] text-center items-center border-[0.3px] border-green-800  text-white rounded-lg w-[650px]"
        }
        onSubmit={createCampaign}
      >
        <p className="text-green-700">Create Campaign</p>

        <input
          type="text"
          maxLength={50}
          placeholder="Title"
          className="input input-bordered input-ghost text-gray-400   w-full "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          maxLength={200}
          placeholder="Description"
          className="textarea textarea-bordered input-ghost text-gray-400   w-full "
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="url"
          maxLength={50}
          placeholder="URL"
          className="input input-bordered input-ghost  text-gray-400    w-full "
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <label className={"text-xs self-start -mb-2 text-gray-400"}>
          Target Amount (SOL)
        </label>
        <input
          type="number"
          min={1}
          placeholder="Target Amount"
          className="input input-bordered input-ghost  w-full text-gray-400 "
          value={targetAmount}
          onChange={(e) => setTargetAmount(Number(e.target.value))}
        />
        <select
          className="select select-ghost w-full  text-gray-400"
          value={selectedConfig}
          onChange={(e) => {
            setSelectedConfig(e.target.value);
          }}
        >
          <option disabled selected>
            Select Config
          </option>
          {configs?.map((config, i) => {
            return (
              <option
                key={i}
                //@ts-ignore
                value={config.seed}
                //@ts-ignore
              >{`Max Duration: ${config.maxDuration} | Max Amount: ${config.maxDuration}`}</option>
            );
          })}
        </select>
        <div className="flex justify-between w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <label className={"text-xs self-start -mb-2  text-gray-400"}>
              Start Time
            </label>
            <input
              type="date"
              placeholder="asc"
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
          </div>
          <div className="w-full flex flex-col gap-3">
            <label className={"text-xs self-start -mb-2 text-gray-400"}>
              End Time
            </label>
            <input
              type="date"
              placeholder="asc"
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
          </div>
        </div>
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
