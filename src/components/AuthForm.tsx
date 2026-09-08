// src/components/Auth.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "./ui/form";
import { authFormSchema } from "@/lib/utils";
import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/action/user.action";
import PlaidLink from "./PlaidLink";
import { CloudShader } from "./ui/cloud-shader";
import { BackgroundRippleEffect } from "./ui/background-ripple-effect";

const Auth = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      address1: "",
      city: "",
      state: "",
      Postalcode: "",
      dateOfBirth: "",
      ssn: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.Postalcode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        };

        const newUser = await signUp(userData);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) {
          router.push("/");
          router.refresh();
        }
      }

      toast.success("Success!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen w-190 bg-indigo-500">
      <div className="flex w-200 max-w-xl flex-col gap-6 sm:max-w-lg sm:gap-8 bg-none">
        <CloudShader className="w-200 -ml-4 " >
        {/* Header with Background Shader */}
        <div className="relative top-2  w-150 rounded-2xl border border-white/20  p-6 shadow-2xl shadow-fuchsia-500 bg-none">
          <header className="flex flex-col gap-6  ">
            {/* Logo and Brand */}
            
            <Link href="/" className="flex items-center gap-8 text-9xl font-semibold text-gray-900 dark:text-white sm:text-6xl font-blackOpsOne text-shadow-lg text-shadow-teal-400 bg-none ">
              <Image
                src="/icons/logo.svg"
                width={200}
                height={200}
                alt="Bank Logo"
                className=""
                priority
              />
              <h1 className="">
                DHANLAXMI
              </h1>
            </Link>
            {/* Title & Subtitle */}
            
          </header> 
        </div>
        </CloudShader>
        
        <div className="flex flex-col gap-1 justify-center items-end font-mono italic underline bg-radial from-75% from-[#2d68dfc4] via-20% via-[#cd3737]  to-10% to-teal-600 h-60 max-w-full ml-28">
              <h2 className="text-4xl xs:text-xl font-semibold text-stone-900  text- dark:text-white ">
                {user
                  ? "Link Account"
                  : type === "sign-in"
                  ? "Sign In"
                  : "Sign Up"}
              </h2>
              <p className="text-lg text-black dark:text-pink-400 sm:text-sm">
                {user
                  ? "Link your account to get started"
                  : "Please enter your details to continue"}
              </p>
            </div>
        {/* Form or PlaidLink */}
        {user ? (
          <div className="flex flex-col gap-4 ">
            <PlaidLink user={user} variant="primary" />
          </div>
        ) : (
          <div className="w-150 rounded-2xl border border-gray-200/80 bg-mist-200 p-2 shadow-lg backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 sm:p-8 z-50 ml-20">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
              >
                {type === "sign-up" && (
                  <>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <CustomInput
                          control={form.control}
                          name="firstName"
                          label="First Name"
                          placeholder="Ex: John"
                        />
                      </div>
                      <div className="w-full sm:w-1/2">
                        <CustomInput
                          control={form.control}
                          name="lastName"
                          label="Last Name"
                          placeholder="Ex: Doe"
                        />
                      </div>
                    </div>

                    <CustomInput
                      control={form.control}
                      name="address1"
                      label="Address"
                      placeholder="Enter your street address"
                    />

                    <CustomInput
                      control={form.control}
                      name="city"
                      label="City"
                      placeholder="Enter your city"
                    />

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <CustomInput
                          control={form.control}
                          name="state"
                          label="State"
                          placeholder="Ex: NY"
                        />
                      </div>
                      <div className="w-full sm:w-1/2">
                        <CustomInput
                          control={form.control}
                          name="Postalcode"
                          label="Postal Code"
                          placeholder="Ex: 11101"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <CustomInput
                          control={form.control}
                          name="dateOfBirth"
                          label="Date of Birth"
                          placeholder="YYYY-MM-DD"
                        />
                      </div>
                      <div className="w-full sm:w-1/2">
                        <CustomInput
                          control={form.control}
                          name="ssn"
                          label="SSN"
                          placeholder="Ex: 1234"
                        />
                      </div>
                    </div>
                  </>
                )}

                <CustomInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                />

                <CustomInput
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full rounded-xl bg-pink-600 text-base font-semibold text-white transition-all hover:bg-pink-700 active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Loading...
                    </span>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer Navigation */}
            <footer className="mt-6 flex items-center justify-center gap-1.5 text-xs sm:text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                {type === "sign-in"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <Link
                href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                className="font-semibold text-pink-600 transition-colors hover:text-pink-700 hover:underline"
              >
                {type === "sign-in" ? "Sign up" : "Sign in"}
              </Link>
            </footer>
          </div>
        )}
        <BackgroundRippleEffect rows={40} cols={100} cellSize={25}  />
      </div>
    </section>
  );
};

export default Auth;