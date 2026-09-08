import Bankcard from '@/components/Bankingcard';
import HeaderBox from '@/components/HeaderBox';
import { CardContainer } from '@/components/ui/3d-card';
import { getAccounts } from '@/lib/action/bank.actions';
import { getLoggedInUser } from '@/lib/action/user.action';
import React from 'react'

const bank_dets = async() => {
  const loggedIN = await getLoggedInUser() || {firstName: 'Dhan',lastName: "F&L", email:"wouldukissme@yahoo.com"};
    const accounts = await getAccounts({
      userId:loggedIN.$id
    })
    // if(!accounts) return;
  return (
    <section className='flex'>
        <div className=' flex h-screen max-h-screen w-full text-3xl font-medium font-spaceGrotesk flex-col gap-8 bg-gray-25 p-8 xl:py-12'>
          <HeaderBox
            title = "My Bank Accounts"
            subtext = "Effortlessly manage your Banking" 
            />
           <div className="space-y-4">
          <h2 className=" text-lg font-semibold text-gray-900">
            Your cards
          </h2>
          <div className="rounded-[24px]  overflow-hidden flex flex-wrap gap-x-10 gap-y-2 p-4">
          {accounts?.data?.map((a: Account) => (
            <CardContainer key={a.id || a.appwriteItemId} className="flex items-center justify-center shadow-lg shadow-taupe-500">
              <Bankcard
                account={a}
                userName={`${loggedIN?.firstName || ""} ${loggedIN?.lastName || ""}`}
                showBalance={false}
              />
            </CardContainer>
          ))}
        </div>
          </div>
        </div>
    </section>
  )
}

export default bank_dets