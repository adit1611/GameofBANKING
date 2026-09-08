"use client"

import React from 'react'
import { cn, formatAmount, formURLQuery, getAccountTypeColors } from '@/lib/utils';
import Image from 'next/image';
import { useSearchParams, useRouter } from "next/navigation";



const BankInfo = ({account,appwriteItemId,type}: BankInfoProps) => {
      const router = useRouter();
  const searchParams = useSearchParams();
    const isActive = appwriteItemId === account?.appwriteItemId;
     
  const handleBankChange = () => {
    const newUrl = formURLQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId,
    });
    router.push(newUrl, { scroll: false });
  };

  const colors = getAccountTypeColors(account?.type as AccountTypes);


  return (
    <div 
     onClick={handleBankChange}
        className={cn(`gap-4.5 flex p-4 transition-all border bg-blue-25 border-transparent ${colors.bg}`,{"shadow-sm border-blue-600": type==="card" &&isActive,
        "rounded-xl":type === "card", "hover:shadow-sm cursor-pointer": type === "card",
        })}>
            <figure className= {`flex-center h-fit rounded-full bg-blue-100 ${colors.lightBg}`}
            >
                <Image
                 src = "/icons/connect-bank.svg" 
                 width={20}
                 height={20}
                 alt='connect'/>

            </figure>
              <div className="flex w-full flex-1 flex-col justify-center gap-1">
        <div className="flex flex-1 items-center justify-between gap-3 overflow-hidden">
          <h2
            className={`text-16 line-clamp-1 flex-1 font-bold text-blue-900 ${colors.title}`}
          >
            {account.name}
          </h2>
          {type === "full" && (
            <p
              className={`text-12 rounded-full px-3 py-1 font-medium text-blue-700 ${colors.subText} ${colors.lightBg}`}
            >
              {account.subtype}
            </p>
          )}
        </div>

        <p className={`text-16 font-medium text-blue-700 ${colors.subText}`}>
          {formatAmount(account.currentBalance)}
        </p>
      </div>
    </div>
  )
}

export default BankInfo