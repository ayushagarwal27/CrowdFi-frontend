"use client";
import React, { useState } from "react";
import { initializeConfig } from "../../calls/calls";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import DatePicker from "@/components/ui/DatePicker";

const CreateCampaign = () => {
  const [selectedDate, setSelectedDate] = useState("");
  return (
    <div className={"h-full w-full mt-[100px]  flex justify-center items-center"}>
      <form
        className={
          "flex bg-white/30  flex-col gap-4 p-[52px] text-center items-center border-[0.3px] border-green-800  text-white rounded-lg w-[650px]"
        }
        // onSubmit={null}
      >
        <p className="text-green-700">Create Campaign</p>
        <input
          type="text"
          maxLength={50}
          placeholder="Title"
          className="input input-bordered input-ghost   w-full "
          // value={title}
          // onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          maxLength={200}
          placeholder="Description"
          className="textarea textarea-bordered input-ghost  w-full "
          // value={description}
          // onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="url"
          maxLength={50}
          placeholder="URL"
          className="input input-bordered input-ghost   w-full "
          // value={title}
          // onChange={(e) => setTitle(e.target.value)}
        />
        <label className={"text-xs self-start -mb-2 text-gray-400"}>
          Target Amount (SOL)
        </label>
        <input
          type="number"
          min={0.1}
          step={0.5}
          max={2000}
          placeholder="Target Amount"
          className="input input-bordered input-ghost  w-full "
          // value={price}
          // onChange={(e) => setPrice(Number(e.target.value))}
        />
        <div className="flex justify-between w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <label className={"text-xs self-start -mb-2  text-gray-400"}>
              Start Time
            </label>
            <input
              type="date"
              placeholder="asc"
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => {
                console.log(e.target.value);
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
              onChange={(e) => {
                console.log(e.target.value);
              }}
            />
          </div>
        </div>
        <button className={"btn bg-green-700 text-white self-stretch"}>
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
