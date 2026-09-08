import { logoutAccount } from '@/lib/action/user.action';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  const router = useRouter();

  const handleLogOut = async () => {
    const loggedOut = await logoutAccount();

    if(loggedOut) router.push('/sign-in')
  }

  return (
    <footer className=" flex cursor-pointer items-center justify-between gap-2 py-6">
      <div className={type === 'mobile' ? 'size-15 flex cursor-pointer items-center justify-between py-2 mx-2 bg-radial to-55% from-[#31c131] via-25% via-[rgba(90,30,230,0.82)] to-indigo-400 rounded-full box-border border-2 border-x-blue-700 shadow-2xl shadow-rose-500' : '-mx-1 flex size-20 items-center justify-center rounded-full bg-[#b31b85e0] text-5xl shadow-2xs shadow-mauve-700 border border-teal-600 max-xl:hidden'}>
        <p className="text-3xl font-bold text-teal-400 p-0.5 ">
          {user?.firstName[0] || user?.first_dhanuser[0]}
        </p>
      </div>

      <div className={type === 'mobile' ? ' flex flex-1 flex-col justify-center -mx-2 font-bold italic text-shadow-2xs text-shadow-fuchsia-400' : ' flex flex-1 flex-col justify-center max-xl:hidden'}>
          <h1 className="text-xl truncate text-gray-700 font-bold">
            {user?.firstName}
          </h1>
          <p className="text-28 truncate font-normal text-gray-600">
            {user?.email}
          </p>
      </div>

      <div className= "relative size-5 max-xl:w-full max-xl:flex max-xl:justify-center max-xl:items-center" onClick={handleLogOut}>
        <Image src="icons/logout.svg"  alt="jsm" 
            width={50} height={48}
        />
      </div>
    </footer>
  )
}

export default Footer
 
