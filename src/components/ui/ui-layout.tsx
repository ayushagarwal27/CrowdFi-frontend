"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ReactNode, Suspense, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

import { AccountChecker } from "../account/account-ui";
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from "../cluster/cluster-ui";
import { WalletButton } from "../solana/solana-provider";
import Background from "./Background";
import { useWallet } from "@solana/wallet-adapter-react";

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();
  const wallet = useWallet();

  const isAdmin =
    wallet.publicKey?.toBase58() ===
      "9pbLHc6cjTVAphKAUV8AQM9sdY3EvLKwExJFgpSTQRCf" ||
    wallet.publicKey?.toBase58() ===
      "4gTWiPwC7AHdsu6BtySRd9KvEZVJmhQJRkB9rNH2P1Kj";

  return (
    <div className="h-full flex flex-col ">
      <div className="navbar fixed top-0 left-0 right-0   backdrop-blur-lg z-[10]  mx-auto  text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0 px-[60px]">
        <div className="flex-1 ">
          <Link className="btn btn-ghost normal-case text-xl" href="/">
            <h2 className={"text-green-500 text-2xl"}>CrowdFi</h2>
          </Link>
          <ul className="menu menu-horizontal px-1 space-x-2">
            {links.map(({ label, path }) => {
              if (path === "/config") {
                if (isAdmin) {
                  return (
                    <li key={path}>
                      <Link
                        className={
                          pathname.startsWith(path)
                            ? "active"
                            : "text-green-600"
                        }
                        href={path}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                } else {
                  return null;
                }
              } else {
                return (
                  <li key={path}>
                    <Link
                      className={
                        pathname.startsWith(path) ? "active" : "text-green-600"
                      }
                      href={path}
                    >
                      {label}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <div className="flex-none space-x-2">
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </div>

      <Background>
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </Background>
      {/* 
      <footer className="footer mt-4 pb-8  footer-center p-4  bg-transparent text-base-content">
        <aside>
          <p>
            Created by{" "}
            <a
              className="link hover:text-white"
              href="https://github.com/ayushagarwal27"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ayush
            </a>
          </p>
        </aside>
      </footer> */}
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || "Save"}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === "string" ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === "string" ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + ".." + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={"text-center"}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={"View Transaction"}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}
