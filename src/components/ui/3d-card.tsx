"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

// 1. Extend the globally declared CreditCardProps
export interface CreditProps extends CreditCardProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

// 2. Destructure props directly inside your component
export const CardContainer = ({
  children,
  className,
  containerClassName,
  account,
  userName,
  showBalance = true,
}: CreditProps)=> {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };
  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn(
          "py-20 flex items-center justify-center",
          containerClassName
        )}
        style={{
          perspective: "1000px",
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}, {account,userName,showBalance = true}:CreditCardProps) => {
  return (
    <div
      className={cn(
        "h-96 w-96  transform-3d  &>*[transform-style:preserve-3d]",
        className
      )}
    >
     {children ?? (
        <Link href="/" className="bank-card">
          <div className="bank-card_content">
            <div>
              <h1 className="text-16 font-semibold text-rose-700">
                {account?.name || userName}
              </h1>
            </div>
              <article className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <h1 className="text12 font-semibold text-white">
                    {userName}
                  </h1>
                  <h2 className="text-12 font-semibold text-white">
                    **/**
                  </h2>
                </div>
                <p className="text-14 font-semibold tracking-[1,1px] text-white">
                  **** **** **** <span className="text-16">${account?.data.mask}</span>
                </p>
              </article>
          </div>
          <div className="bnk-card_icon">
              <Image src= "/icon/Paypass.svg" 
                width={20}
                height={24}
                alt="pay"/>
              <Image src="/icon/mastercard.svg"
                height={32}
                width={45}
                alt="mastercard"/>
              <Image src="/icon/mastercard.svg"
                height={32}
                width={45}
                alt="mastercard2"/>
          </div>
        </Link>
      )}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };

  return (
    <Tag
      ref={ref}
      className={cn("w-fit transition duration-200 ease-linear", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Create a hook to use the context
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
