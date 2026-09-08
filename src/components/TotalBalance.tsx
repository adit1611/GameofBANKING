import React from "react";
import AnimatedCounter from "./AnimatedCounter";
import Dounghtchart from "./ui/Dounghtchart";

interface TotalBalanceBoxProps {
  accounts?: any[];
  totalBanks?: number;
  totalCurrentBalance?: number;
}

const TotalBalance = ({
  accounts = [],
  totalBanks = 0,
  totalCurrentBalance = 0,
}: TotalBalanceBoxProps) => {
  return (
    <section className="flex w-full items-center gap-6 rounded-xl border-4 border-fuchsia-600 p-6 shadow-chart-3 text-lg font-medium font-serif text-orange-400">
      {/* Chart wrapper */}
      <div className="flex size-full max-w-30 items-center">
        <Dounghtchart accounts={accounts} />
      </div>

      {/* Account and Balance Details */}
      <div className="flex flex-col gap-4">
        <h2 className="header-2 text-xl font-bold">
          {totalBanks} 🫣🙃 Bank Account{totalBanks !== 1 ? "s" : ""}
        </h2>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold tracking-wide text-sky-600 font-mono uppercase">
            Total Current Balance
          </p>

          <div className="text-3xl font-bold font-sans text-purple-900 flex items-center">
            <AnimatedCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalance;