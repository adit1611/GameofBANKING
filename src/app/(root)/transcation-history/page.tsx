import HeaderBox from '@/components/HeaderBox'
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/action/bank.actions';
import { getLoggedInUser } from '@/lib/action/user.action';
import { formatAmount } from '@/lib/utils';
import { format } from 'path';
import React from 'react'

const Trans_paym = async ({ searchParams }: SearchParamProps) => {
  // 1. Unwrap the searchParams Promise
  const { id, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const loggedIN = await getLoggedInUser() || {firstName: 'Dhan',lastName: "F&L", email:"wouldukissme@yahoo.com"};
  const accounts = await getAccounts({
    userId:loggedIN.$id
  })
  if(!accounts) return;
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  const account = await getAccount({appwriteItemId})
  
  const rowsPerPage = 10;
const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

const indexOfLastTransaction = currentPage * rowsPerPage;
const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  
const transactions: Transaction[] = account?.transactions || [];

const currentTransactions = transactions.slice(
  indexOfFirstTransaction,
  indexOfLastTransaction
);

  return (
    <div className='flex max-h-screen w-full flex-col gap-8 overflow-y-scroll bg-gray-25 p-8 xl:py-12'>
      <div className='flex w-full flex-col items-start justify-between gap-8 md:flex-row'>
        <HeaderBox 
          title='Transcation History'
          subtext='See Your Bank Data'
        />

      </div>
      <div className='space-y-6'>
        <div className='flex flex-col justify-between gap-4 rounded-lg border-y bg-blue-600 px-4 py-5 md:flex-row'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-18 font-bold text-gray-400'>
                {account?.data.officialName}
            </h2>
            <p className='text-14 font-semibold tracking-[1.1px] text-white'>
              🫣🫣🫣🫣 🫣🫣🫣🫣 🫣🫣🫣🫣{account?.data.mask} 
            </p>
            </div>
            <div className='flex-center flex-col  gap-2 rounded-md bg-blue-25/20 px-4 py-2 text-white'>
               <p className='text-[14px]'>Current Balance</p>
               <p className='text-2xl text-center font-bold'>
                {formatAmount(account?.data.currentBalance)}
               </p>
            </div>
          </div>
          <section className='flex w-full flex-col gap-6'>
            <TransactionsTable
              transactions={currentTransactions}
            />
             {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={currentPage} />
              </div>
            )}
          </section>
        </div>
      </div>
  )
}

export default Trans_paym;