import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'
import { BankBox } from './BankBox'
import Bankcard from './Bankingcard'

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
  const categories: CategoryCount[] = countTransactionCategories(transactions);

  return (
    <aside className="scrollbar-none hidden right-0 -top-40 -mr-40 mt-2 h-screen max-h-screen flex-col border-4 border-l-emerald-600 border-b-emerald-400 border-t-emerald-400 rounded-4xl xl:flex w-96  xl:overflow-y-scroll bg-linear-60 bg-no-repeat from-slate-300 via-45% via-red-300 to-mauve-500 !important">
      <section className="flex flex-col -top-56">
        <div className="h-64 w-full bg-radial-[at_40%_20%_40%] from-slate-400 via-purple-600 to-orange-400 bg-no-repeat" />
        <div className="relative flex px-6 max-xl:justify-center">
          <div className="absolute flex items-center justify-center -top-60 size-32 rounded-full bg-indigo-700 border-4 border-cyan-200 p-2.5 shadow-xl shadow-accent-foreground/20 ">
            <span className="text-5xl font-bold text-blue-500">{user?.firstName?.[0] || user?.first_dhanuser?.[0] || "U"}</span>
          </div>

          <div className="flex flex-col -mt-20 h-40 w-full gap-4">
            <h1 className='text-4xl text-red-500 text-shadow-2xs text-shadow-fuchsia-700 font-bold md:font-light md:italic @max-xs:font-extrabold -top-96'>
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-2xl font-normal font-caveat border-4 rounded-lg border-b-pink-600 border-t-amber-200 border-orange-400">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-between gap-8 px-6 py-8">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Banks</h2>
          <Link href="/" className="flex gap-2">
            <Image 
               src="/icons/plus.svg"
              width={20}
              height={20}
              alt="plus"
            />
            <h2 className="text-14 font-semibold text-gray-600">
              Add Bank
            </h2>
          </Link>
        </div>

        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative flex h-48 w-full max-w-[320px] items-center justify-center rounded-[20px] overflow-hidden">
              <Bankcard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <Bankcard 
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="header-2">Top categories</h2>

          <div className='space-y-5'>
            {categories.map((category, index) => (
              <Category key={category.name} category={category} />
            ))}
          </div>
        </div>
      </section>
    </aside>
  )
}

export default RightSidebar