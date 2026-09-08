import HeaderBox from '@/components/HeaderBox';
import RecentTrans from '@/components/RecentTrans';
import Rightsidebar from '@/components/Rightsidebar';
import TotalBalance from '@/components/TotalBalance';
import { CardContainer } from '@/components/ui/3d-card';
import Globe3D from '@/components/ui/3d-globe';
import { getAccount, getAccounts } from '@/lib/action/bank.actions';
import { getLoggedInUser } from '@/lib/action/user.action';
import React from 'react';

const Home = async({ searchParams  }: SearchParamProps) => {

  // 1. Unwrap the searchParams Promise

  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams?.id as string;
  const page = resolvedSearchParams?.page as string;
  const currentPage = Number(page as string) || 1;
  const loggedIN = await getLoggedInUser() ;

  const accounts = await getAccounts({ 
  userId: loggedIN?.$id 
});

  console.log("Accounts fetched:", accounts);

  if(!accounts) return;
  const accountsData = accounts?.data || [];
  const totalBanks = accounts.totalBanks || 0;
  const totalCurrentBalance = accounts.totalCurrentBalance || 0;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  const account = await getAccount({appwriteItemId});

  return (
    <section className='scrollbar-none flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll'>
        <div className='scrollbar-none flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll'>
          <header className='flex flex-col justify-between gap-8 text-3xl font-bold font-bangers backdrop-blur-md backdrop-brightness-95 backdrop-grayscale-75 backdrop-opacity-20 to-background via-lime-600 from-indigo-500 text-[#f756f766]'>
             <span className='flex flex-1'> Welcome to &nbsp;<strong className='text-[#7c3dd3ec] text-3xl underline decoration-2 decoration-sky-300 '>DhanLaxmi Bank</strong></span>
              <HeaderBox
                type = "greeting"
                title = "Welcome"
                user= {loggedIN?.firstName || 'Guest'}
                subtext= "Acces and manage your account and trasaction effiency."
              />
              <TotalBalance
                accounts={accountsData}
                totalBanks={totalBanks}
                totalCurrentBalance={totalCurrentBalance}
              />
          </header>

            <RecentTrans 
              key={appwriteItemId}
              accounts = {accountsData}
              transactions={account?.transactions}
              appwriteItemId = {appwriteItemId}
              page = {currentPage}
            />
           
          <section className='update'>
              <CardContainer className='bg-rose-400 h-fit w-72'>
                RECENT TRANSACTION
                complex security matrix is a common challenge for larger
                nations. The very tools that allow us to render more
                effective services can also help to secure our people better.
                As with more orthodox external threats, conducting
                security policy in an informationized environment is the
                task for which
              </CardContainer>
          </section>
          <div>
               <Globe3D/>
           </div>
        </div>
          <Rightsidebar 
            user={loggedIN}
             transactions = {[]}
            banks={accountsData?.slice(0,2)}/>
            
    </section>
  )
}

export default Home;

{/*
 export default async function Home({ searchParams }: SearchParamProps) {
  // 1. Unwrap the searchParams Promise
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams?.id as string;
  const page = resolvedSearchParams?.page as string;
  const currentPage = Number(page) || 1;

  // 2. Auth check: Fetch logged-in user & redirect if unauthenticated
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) {
    redirect("/sign-in");
  }
//|| {firstName: 'Dhan',lastName: "F&L", email:"wouldukissme@yahoo.com"};
  // 3. Fetch linked bank accounts
  const accounts = await getAccounts({
    userId: loggedIn.$id,
  });

  if (!accounts || accounts.data.length === 0) {
    return (
      <section className="home">
        <div className="home-content">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />
          <p className="no-banks">No bank accounts linked yet.</p>
        </div>
        <RightSidebar user={loggedIn} transactions={[]} banks={[]} />
      </section>
    );
  }

  const accountsData = accounts.data;
  const appwriteItemId = id || accountsData[0]?.appwriteItemId;

  // 4. Fetch the selected bank account details
  const account = await getAccount({ appwriteItemId });

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts.totalBanks}
            totalCurrentBalance={accounts.totalCurrentBalance}
          />
        </header>

        <RecentTransaKey Next.js 15 Changes in this File
// Type Definition: searchParams: Promise<{ [key: string]: string | string[] | undefined }> correctly types the async prop.  

// Awaiting Props: const resolvedSearchParams = await searchParams; resolves the Promise before accessing .id or .page.  

// Safe Fallbacks: Added checks to redirect unauthenticated users to /sign-in and safely handle empty account arrays before calling getAccount.ctions
          accounts={accountsData}
          transactions={account?.transactions || []}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={account?.transactions || []}
        banks={accountsData.slice(0, 2)}
      />
    </section>
  );
}
// 
  
  */}