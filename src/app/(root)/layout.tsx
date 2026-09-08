import Mobilenav from "@/components/Mobilenav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/action/user.action";

import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();

  if(!loggedIn) redirect('/sign-in')

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />

      <div className="flex size-full flex-col w-5xl ">
        <div className="root-layout lg:hidden">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div className="lg:hidden">
            <Mobilenav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}