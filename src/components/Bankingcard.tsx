// src/components/BankCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatAmount } from "@/lib/utils";
import Copydata from "./Copydata";

interface BankCardProps {
  account: any;
  userName: string;
  showBalance?: boolean;
}

const BankCard = ({
  account,
  userName,
  showBalance = true,
}: BankCardProps) => {
  return (
    <div className="flex flex-col">
      <Link
        href={`/transcation-history/?id=${account.appwriteItemId || account.id}`}
       className="relative flex h-72 w-full max-w-110 justify-between rounded-[20px] border border-white/20 bg-bank-gradient shadow-creditCard backdrop-blur-[6px] overflow-hidden"
      >
       <div className="relative flex  w-5/7 flex-col justify-between rounded-l-xl border border-white/20 shadow-creditCard transition-all duration-300  bg-pink-600 p-6">
          <div className="">
            <h1 className="text-6 font-bold text-white">
              {account.name || userName}
            </h1>
            <p className="font-ibm-plex-serif font-black text-white text-lg">
              {formatAmount(account.currentBalance)}
            </p>
          </div>

          <article className="flex flex-col gap-2 h-80">
            <div className="flex justify-between">
              <h1 className="text-10 font-bold text-white">{userName}</h1>
              <h2 className="text-12 font-bold text-white">●● / ●●</h2>
            </div>
            <p className="text-14 font-semibold tracking-tighter text-white">
              🫣🫣🫣🫣 🫣🫣🫣🫣 🫣🫣🫣🫣 <span className="text-16">{account.mask || "1234"}</span>
            </p>
          </article>
        </div>

        <div className="aspect-[1.586/1] w-2/7  border border-white/20 p-4 shadow-creditCard sm:max-w-90 sm:p-5 flex size-full flex-1 flex-col items-end justify-between rounded-r-[20px] bg-radial from-45% from-[#33ce83] via-15% via-[#7c24c0] to-[#5ab52c] bg-cover bg-center bg-no-repeat py-1 ">
          <Image
            src="/icons/Paypass.svg"
            width={20}
            height={24}
            alt="pay"
          />
          <Image
            src="/icons/mastercard.svg"
            width={45}
            height={32}
            alt="mastercard"
            className="ml-5"
          />
        </div>

         <Image 
          src="/icons/lines.png"
          width={316}
          height={190}
          alt="lines"
          className="absolute top-0 left-0"
        />
      </Link>

      
    </div>
  );
};

export default BankCard;