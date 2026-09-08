import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <main className="flex min-h-screen w-full items-stretch">
  {children}

  <div className="relative hidden w-1/2 lg:block bg-sky-600">
    <Image
      src="/icons/auth-image.svg"
      alt="Auth illustration"
      fill
      className="rounded-l-xl object-cover"
    />
  </div>
</main>
  );
}