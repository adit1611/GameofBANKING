'use client'
import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { sidebarLinks } from '@/constants'
import Footer from './Footer'

const Mobilenav = ({user} : MobileNavProps) => {
  const pathname = usePathname();
  return (
    <section className=''>
        <Sheet >
        <SheetTrigger className= "max-w-20 border-4 border-r-emerald-400 bg-[#31d465] flex items-center justify-center">
            <Image 
                src = "/icons/hamburger.svg"
                alt='hamburger'
                height={30}
                width={30}
                />
        </SheetTrigger>
        <SheetContent side='left' className="w-[110vw] max-w-[110vw] border-4 border-mist-400 bg-amber-300 @max-xs:w-[99vw]">
            <Link href="/" className='cursor-pointer items-center gap-1 px-4'>
            <Image src="/icons/logo.svg" alt='LOGO' width={34}
            height={34} className='size-6 max-xl:size-14'/>
            <h1 className='text-5xl font-mono font-ibm-plex-serif font-bold text-black-1 text-sky-950 text-shadow-lg text-shadow-rose-400 ...'>DhanLaxmi</h1>
            </Link>
            <div className='flex h-[calc(100vh-72px)]  w-full flex-col justify-between overflow-y-auto'>
            <SheetClose>
              <nav className="flex h-full w-full flex-col gap-2 pt-20  text-white bg-[#2d1e6fbf]">
              {sidebarLinks.map((item) => {
  const isActive =
    pathname === item.route || pathname.startsWith(`${item.route}/`);

  return (
    <SheetClose
      key={item.route}
      nativeButton={false} // 👈 Add this line to fix the error
      className="gap-x-10 text-lg"
      render={
        <Link
          href={item.route}
          className={cn(
            "flex items-center rounded-lg w-full max-w-96 max-h-40 p-10 border-b-4 border-b-olive-700 bg-fuchsia-700 text-lg font-semibold font-serif hover:bg-green-300",
            {
              "bg-pink-400": isActive,
            }
          )}
        />
      }
    >
      <Image
        src={item.imgURL}
        alt={item.label}
        width={30}
        height={30}
        className={cn({ "brightness-[3] invert-0": isActive })}
      />
      <p
        className={cn("text-16 font-semibold text-slate-500", {
          "text-white": isActive,
        })}
      >
        {item.label}
      </p>
    </SheetClose>
  );
})}
  {/* User details section placed safely inside nav, outside of close triggers */}
  </nav>
  </SheetClose>

            <Footer user={user} type="mobile" />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default Mobilenav