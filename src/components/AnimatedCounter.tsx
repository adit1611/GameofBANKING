"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";

interface AnimatedCounterProps {
  amount?: number;
}

export default function AnimatedCounter({ amount = 0 }: AnimatedCounterProps) {
  const [mounted, setMounted] = useState(false);

  // Fallback to 0 if amount is undefined, null, or NaN
  const safeAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR placeholder matching final format to prevent layout jumps
  if (!mounted) {
    return <span>${safeAmount.toFixed(2)}</span>;
  }

  return (
    <span className="w-full">
      <CountUp
        decimal="."
        decimals={2}
        prefix="$"
        end={safeAmount}
        duration={1.5}
        separator=","
      />
    </span>
  );
}