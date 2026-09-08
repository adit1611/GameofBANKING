'use client'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Footer from './Footer'
import PlaidLink from './PlaidLink'

const Sidebar = ({user}: SiderbarProps) => {
    const pathname = usePathname();
  return (
    <div className='sticky max-h-fit max-w-2/7 left-0 mt-1 flex flex-col justify-between  p-2 ml-0  max-md:hidden sm:p-4 xl:p-6 2xl:w-88.75 border-r-4 border-r-emerald-300 border-t-2 border-t-emerald-300 rounded-r-lg shadow-[4px_0_24px_0_rgba(0,0,0,0.06)] z-20 bg-mauve-300 to-lime-400'>
    <nav className='p-0 m-0 flex flex-col gap-4 w-full'>
            <Link href="/" className='mb-12 cursor-pointer items-center gap-2'>
            <Image src='/icons/download_bankbit.png' alt='LOGO' width={180}
            height={150} className='size-36 max-xl:size-64'/>
            <h1 className='font-extrabold text-3xl font-stretch-75% font-ibm-plex-serif font-heading text-indigo-400 italic m-0  2xl:text-26 font-ibm-plex-serif text-[26px]  text-black-1 max-xl:hidden'>DhanLaxmi</h1>
            </Link>
            {sidebarLinks.map((item) => {
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`) 
                    return (
 <Link href={item.route} key={item.label} className={cn('flex gap-3 items-center py-3 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start hover:bg-yellow-200',{'bg-linear-330 from-cyan-600 to-slate-400':isActive })}>
                          <div className= "relative-size-6">
                                <Image src={item.imgURL} alt={item.label} width={40} height={40} 
                                 className={cn({
                    'brightness-[3] invert-0': isActive
                        })}
                   />
                            </div> 
                            <p className={cn("text-16 font-semibold text-black-2 max-xl:hidden",{"text-white font-abrilFatface":isActive})}>{item.label}</p> 
                        </Link>
                    )
                }
            )}
            <PlaidLink user={user}/>
    </nav>
    <Footer user={user} />
    </div>
  )
}

export default Sidebar