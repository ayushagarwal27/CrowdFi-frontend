// @ts-nocheck
"use client";
import { getProvider } from "@/calls/calls";
import { useTransactionToast } from "@/components/ui/ui-layout";
import programInfo from "@/constants/programInfo";
import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { toNamespacedPath } from "node:path/win32";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const AllPage = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const anchorProvider = getProvider(connection, wallet);
  const program = new Program(programInfo.idl_object, anchorProvider);
  const [allCampaign, setAllCampaigns] = useState([]);
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [updateData, setUpdateData] = useState(null);
  const transactionToast = useTransactionToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<any>("");

  async function getAllCampaigns() {
    try {
      setIsLoading(true);
      // @ts-ignore
      const res = await fetch(
        "/api/campaigns?id=" + wallet.publicKey?.toString()
      );
      const data = await res.json();
      console.log(data.data);
      setAllCampaigns(data.data);
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (wallet.publicKey) {
      getAllCampaigns();
    }
  }, [wallet.publicKey]);

  async function handleCloseCampaign(cmp) {
    const [campaign, _] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign"),
        Buffer.from(cmp.title),
        new PublicKey(cmp.admin).toBuffer(),
      ],
      program.programId
    );
    try {
      setIsLoadingAction(true);
      const tx = await program.methods
        .closeCampaign()
        .accountsPartial({
          config: new PublicKey(cmp.configKey),
          campaign,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      transactionToast(tx);
      await fetch(`/api/campaign?id=${cmp.id}&action=close`, {
        method: "PATCH",
      });
      getAllCampaigns();
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setIsLoadingAction(false);
    }
  }

  async function updateCampaign(cmp) {
    setIsModalOpen(true);
    const [campaign, _] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign"),
        Buffer.from(cmp.title),
        new PublicKey(cmp.admin).toBuffer(),
      ],
      program.programId
    );
    try {
      setIsLoadingAction(true);
      const tx = await program.methods
        .updateCampaign(description ? description : null, url ? url : null)
        .accountsPartial({
          admin: new PublicKey(cmp.admin),
          campaign,
        })
        .rpc();
      await fetch(`/api/campaign?id=${cmp.id}&action=update`, {
        method: "PATCH",
        body: JSON.stringify({
          url: url || cmp.url,
          description: description || cmp.description,
        }),
      });
      transactionToast(tx);
      setDescription("");
      setUrl("");
      setUpdateData(null);
      getAllCampaigns();
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setIsModalOpen(false);
      setIsLoadingAction(false);
    }
  }

  return (
    <>
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
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => {
                    handleCloseCampaign(cmp);
                  }}
                  disabled={!!cmp?.isCompleted || isLoadingAction}
                  className="btn w-1/2 mt-auto btn-neutral text-white border-none bg-green-900 cus-btn-disabled"
                >
                  {isLoadingAction ? (
                    <span className="loading loading-spinner text-accent"></span>
                  ) : (
                    "Close"
                  )}
                </button>
                <button
                  disabled={!!cmp?.isCompleted || isLoadingAction}
                  onClick={() => {
                    setUpdateData(cmp);
                    setIsModalOpen(true);
                  }}
                  className="btn w-1/2 mt-auto btn-neutral text-white border-none bg-green-900 cus-btn-disabled"
                >
                  {isLoadingAction ? (
                    <span className="loading loading-spinner text-accent"></span>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          );
        })}
        {!isLoading && allCampaign.length === 0 && (
          <p className="text-green-600 text-3xl text-center absolute top-[200px] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            No Campaign Found :(
          </p>
        )}
      </div>
      {/* The button to open modal */}
      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id="my_modal_6"
        className="modal-toggle"
        checked={isModalOpen}
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Campaign!</h3>

          <textarea
            maxLength={200}
            placeholder="Description"
            className="textarea textarea-bordered input-ghost text-gray-400   w-full "
            value={description || updateData?.description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="url"
            maxLength={50}
            placeholder="URL"
            className="input input-bordered input-ghost  text-gray-400    w-full "
            value={url || updateData?.url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="modal-action">
            <button
              onClick={() => updateCampaign(updateData)}
              className="btn"
              disabled={isLoadingAction}
            >
              Update Campaign
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn"
                disabled={isLoadingAction}
                onClick={() => {
                  setDescription("");
                  setUrl("");
                  setUpdateData(null);
                  setIsModalOpen(false);
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPage;
