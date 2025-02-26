import React from "react";

const AllPage = () => {
  return (
    <div
      className={
        "grid md:grid-cols-2 lg:grid-cols-3 mt-[60px] max-w-7xl mx-auto flex-wrap  gap-4 w-full"
      }
    >
      <div
        className={
          "p-4 flex gap-4 flex-col min-w-[300px] rounded-lg border-2 border-green-600 hover:shadow-2xl hover:-translate-y-[2px] duration-200 hover:shadow-green-300 bg-white/40"
        }
      >
        <h2 className="capitalize text-xl text-center text-green-600">
          Campaign Name
        </h2>
        <p className={" py-4 px-1 mt-auto rounded text-green-800 text-md"}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat cum
          quia odit quibusdam ut provident unde maiores impedit porro natus?
        </p>
        <progress
          className="progress progress-success w-full"
          value="70"
          max="100"
        ></progress>
        <div className={" mt-[-12px] flex justify-between"}>
          <p className={"font-semibold text-xs text-green-600"}>
            Target:{" "}
            <span className={"text-green-600 text-xs font-normal"}>10 SOL</span>
          </p>
          <p className={"font-semibold text-xs text-green-600"}>
            Raised:{" "}
            <span className={"text-green-600 text-xs font-normal"}>6 SOL</span>
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <button className="btn w-1/2 mt-auto btn-neutral text-white border-none bg-green-900 cus-btn-disabled">
            Close
          </button>
          <button className="btn w-1/2 mt-auto btn-neutral text-white border-none bg-green-900 cus-btn-disabled">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllPage;
