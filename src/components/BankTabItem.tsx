import { cn, formURLQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const BankTabItem = ({account,appwriteItemId}: BankTabItemProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isActive = appwriteItemId === account?.appwriteItemId;

    const handleBankChange = () =>{
      const newURL = formURLQuery ({
        params: searchParams.toString(),
        key: "id",
        value: account?.appwriteItemId,
      });
      router.push(newURL,{scroll:false});
    };
    
  return (
    <div 
    onClick={handleBankChange}
    className={cn("gap-5 border-b-2 flex px-2 sm:px-4 py-2 transition-all border-sky-500",{"border-blue-600":isActive,})}>
      <p 
      className={cn(`text-16 line-clamp-1 flex-1 font-medium text-gray-500`,{"text-blue-600":isActive})}>
        {account.name}
      </p>
      </div>
  )
}

export default BankTabItem;