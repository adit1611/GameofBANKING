import React from 'react'

declare interface HeaderBoxProps{
    type?: "title" | "greeting";
    title: string;
    subtext:string;
    user?:string;
}

const HeaderBox = ({type ="title", title,subtext,user}:HeaderBoxProps) => {
  return (
    <div className='flex flex-col gap-1'>
        <h1 className="text-indigo-600 font-permanentMarker text-5xl font-bold">
            {title}
            {type === 'greeting' && (
                <span className='text-sky-400 font-blackOpsOne text-5xl font-bold'>&nbsp;&nbsp;{user}</span>
            )}
        </h1>
        <p className=' text-16 lg:text-20 font-normal text-gray-600 underline-offset-4'>{subtext}</p>
    </div>
  )
}

export default HeaderBox