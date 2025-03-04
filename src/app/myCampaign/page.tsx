// @ts-nocheck
"use client";
import { getProvider } from "@/calls/calls";
import { useTransactionToast } from "@/components/ui/ui-layout";
import programInfo from "@/constants/programInfo";
import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    async function getAllCampaigns() {
      // @ts-ignore
      const res = await program.account.campaign.all();
      const myCampaigns = res.filter(
        // @ts-ignore
        (cmp) => cmp.account.admin.toBase58() === wallet.publicKey?.toBase58()
      );
      console.log(myCampaigns);
      setAllCampaigns(myCampaigns);
    }
    getAllCampaigns();
  }, []);

  async function handleCloseCampaign(cmp) {
    try {
      const tx = await program.methods
        .closeCampaign()
        .accountsPartial({
          config: cmp.account.config,
          campaign: cmp.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      transactionToast(tx);
      router.push("/all");
    } catch (err) {
      toast.error(`${err}`);
    }
  }

  async function updateCampaign(cmp) {
    try {
      const tx = await program.methods
        .updateCampaign(description ? description : null, url ? url : null)
        .accountsPartial({
          admin: cmp.account.admin,
          campaign: cmp.publicKey,
        })
        .rpc();
      transactionToast(tx);
      setDescription("");
      setUrl("");
      setUpdateData(null);
      router.push("/all");
    } catch (err) {
      toast.error(`${err}`);
    }
  }

  return (
    <>
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
                    {(
                      cmp?.account.currentAmount / LAMPORTS_PER_SOL
                    )?.toString()}{" "}
                    SOL
                  </span>
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => {
                    handleCloseCampaign(cmp);
                  }}
                  disabled={!!cmp?.account.isCompleted}
                  className="btn w-1/2 mt-auto btn-neutral text-white border-none bg-green-900 cus-btn-disabled"
                >
                  Close
                </button>
                <button
                  disabled={!!cmp?.account.isCompleted}
                  onClick={() => {
                    setUpdateData(cmp);
                    document.getElementById("my_modal_1").showModal();
                  }}
                  className="btn w-1/2 mt-auto btn-neutral text-white border-none bg-green-900 cus-btn-disabled"
                >
                  Update
                </button>
              </div>
            </div>
          );
        })}
        {allCampaign.length === 0 && (
          <p className="text-green-600 text-3xl text-center absolute top-[200px] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            No Campaign Found :(
          </p>
        )}
      </div>
      (
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Campaign!</h3>

          <textarea
            maxLength={200}
            placeholder="Description"
            className="textarea textarea-bordered input-ghost text-gray-400   w-full "
            value={description || updateData?.account?.description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="url"
            maxLength={50}
            placeholder="URL"
            className="input input-bordered input-ghost  text-gray-400    w-full "
            value={url || updateData?.account?.url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="modal-action">
            <button onClick={() => updateCampaign(updateData)} className="btn">
              Update Campaign
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn"
                onClick={() => {
                  setDescription("");
                  setUrl("");
                  setUpdateData(null);
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
      )
    </>
  );
};

export default AllPage;
