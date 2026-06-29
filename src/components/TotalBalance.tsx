import React from 'react'
import { formatAmount } from "@/lib/utils";

declare interface TotalBalanceProps {
    accounts : string[]
    totalBanks: number
    totalCurrentBalance: number
}
const TotalBalance = ({accounts=[], totalBanks,totalCurrentBalance}: TotalBalanceProps) => {
  return (
    <section className='total-balnce'>
        <div className='total-balance-chart'>
            {/* Doughnut chart */}
        </div>
        <div className='flex flex-col gap-6'>
            <h2 className='header-2'>
                {totalBanks} 🫣🙃Bank Accounts
            </h2>
            <div className='flex flex-col gap-2'>
                <p className='total-balance-label'>
                    Total Curr Balance 
                </p>
                <p className='total-balance-amount flex-center gap-2'>
                    {formatAmount(totalCurrentBalance)}
                </p>
            </div>
        </div>
    </section>
  )
}

export default TotalBalance