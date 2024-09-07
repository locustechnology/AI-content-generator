'use client'
import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/app/types/supabase"; 
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import disposableDomains from "disposable-email-domains";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineGoogle } from "react-icons/ai";
import { WaitingForMagicLink } from "./WaitingForMagicLink";

type Inputs = {
  email: string;
};

interface LoginPageProps {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };

}
const LoginPage: FC<LoginPageProps> = ({ searchParams }) => {



  const supabase = createClientComponentClient<Database>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<Inputs>();

  const protocol = host?.includes("localhost") ? "http" : "https";
  const redirectUrl = `${protocol}://${host}/auth/callback?next=${searchParams?.next || "/overview"}`;

  console.log({ redirectUrl });

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.log(`Error: ${error.message}`);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.log(`Error: ${error.message}`);
      toast({
        title: "Google sign-in failed",
        variant: "destructive",
        description:
          "Please try again, if the problem persists, contact us at gostudio@tryleap.ai",
        duration: 5000,
      });
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    try {
      await signInWithMagicLink(data.email);
      setTimeout(() => {
        setIsSubmitting(false);
        toast({
          title: "Email sent",
          description: "Check your inbox for a magic link to sign in.",
          duration: 5000,
        });
        setIsMagicLinkSent(true);
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Something went wrong",
        variant: "destructive",
        description:
          "Please try again, if the problem persists, contact us at gostudio@tryleap.ai",
        duration: 5000,
      });
    }
  };

  if (isMagicLinkSent) {
    return (
      <WaitingForMagicLink toggleState={() => setIsMagicLinkSent(false)} />
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 p-4 rounded-xl max-w-sm w-full">
        <h1 className="text-xl">Welcome</h1>
        <p className="text-xs opacity-60">
          Sign in or create an account to get started.
        </p>
        <Button
          onClick={signInWithGoogle}
          variant="outline"
          className="font-semibold flex items-center justify-center gap-2"
        >
          <AiOutlineGoogle size={20} />
          Continue with Google
        </Button>
        <OR />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    emailIsValid: (value: string) =>
                      /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
                      "Please enter a valid email",
                    emailDoesntHavePlus: (value: string) =>
                      !/\+/.test(value) || "Email addresses with a '+' are not allowed",
                    emailIsntDisposable: (value: string) =>
                      !disposableDomains.includes(value.split("@")[1]) ||
                      "Please use a permanent email address",
                  },
                })}
              />
              {isSubmitted && errors.email && (
                <span className="text-xs text-red-400">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <Button
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant="outline"
            className="w-full"
            type="submit"
          >
            Continue with Email
          </Button>
        </form>
      </div>
    </div>
  );
};

const OR = () => {
  return (
    <div className="flex items-center my-1">
      <div className="border-b flex-grow mr-2 opacity-50" />
      <span className="text-sm opacity-50">OR</span>
      <div className="border-b flex-grow ml-2 opacity-50" />
    </div>
  );
};

export default LoginPage;