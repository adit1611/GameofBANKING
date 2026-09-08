"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { UseFormSetValue } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formURLQuery, formatAmount } from "@/lib/utils";

interface Account {
  id: string;
  appwriteItemId: string;
  name: string;
  currentBalance: number;
  mask?: string;
  accountNumber?: string;
}

interface BankDropdownProps {
  accounts: Account[];
  setValue?: UseFormSetValue<any>;
  otherStyles?: string;
}

export const BankBox = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Pick selected bank matching URL param or default to first
  const selectedId = searchParams.get("id");
  const selectedAccount =
    accounts.find(
      (acc) => (acc.appwriteItemId || acc.id) === selectedId
    ) || accounts[0];

  const [selected, setSelected] = useState<Account>(selectedAccount);

  useEffect(() => {
    if (selectedAccount) {
      setSelected(selectedAccount);
    }
  }, [selectedAccount]);

  const handleBankChange = (id: string) => {
    const account = accounts.find(
      (acc) => (acc.appwriteItemId || acc.id) === id
    );
    if (!account) return;

    setSelected(account);

    if (setValue) {
      setValue("senderBank", id);
    }

    const newUrl = formURLQuery({
      params: searchParams.toString(),
      key: "id",
      value: id,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm outline-none focus:ring-2 focus:ring-bankGradient ${otherStyles}`}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/icons/credit-card.svg"
            width={20}
            height={20}
            alt="bank"
          />
          <span className="text-14 font-medium text-gray-700">
            {selected?.name || "Select an Account"}
          </span>
        </div>
        <Image
          src="/icons/arrow-down.svg"
          width={16}
          height={16}
          alt="arrow down"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-75 bg-white p-2">
        <DropdownMenuLabel className="text-12 font-semibold text-gray-500">
          Switch Bank Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup
          value={selected?.appwriteItemId || selected?.id}
          onValueChange={handleBankChange}
        >
          {accounts.map((account) => {
            const accId = account.appwriteItemId || account.id;
            return (
              <DropdownMenuRadioItem
                key={accId}
                value={accId}
                className="cursor-pointer py-2 hover:bg-gray-100"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-14 font-semibold text-gray-900">
                    {account.name}
                  </span>
                  <span className="text-12 font-medium text-blue-600">
                    {formatAmount(account.currentBalance)}
                  </span>
                </div>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

