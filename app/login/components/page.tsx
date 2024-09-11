'use client'

import { FC, useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/app/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import logo from "/public/98.png";
import loginfram from "/public/credits/loginfram.png"

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
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    try {
      // Handle form submission logic here
      toast({
        title: "Email sent",
        description: "Check your inbox for a magic link to sign in.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
        description: "Please try again. If the problem persists, contact support.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Google sign-in failed",
        variant: "destructive",
        description: "Please try again. If the problem persists, contact support.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="w-full lg:w-1/2 relative">
        <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative">
          <Image 
            src={loginfram}
            alt="Login Frame"
            layout="fill"
            objectFit="contain"
            quality={90}
            priority
          />
          {/* Decorative elements */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
          <div className="absolute top-1/3 left-1/4 w-12 h-12 border-4 border-purple-200 rounded-full opacity-30"></div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 h-[600px] flex flex-col justify-between">
          <div>
            <div className="mb-8 flex items-center justify-center">
              <Image src={logo} alt="Studio.ai logo" width={40} height={40} className="rounded-sm" />
              <span className="font-bold text-2xl ml-2">Studio.ai</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Log in / Sign up</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mybiz.com"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-4 rounded-md text-sm"
              >
                {isSubmitting ? 'Sending...' : 'Get code on E-mail →'}
              </Button>
            </form>
            
            <div className="mt-4">
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium py-1 px-4 rounded-md hover:bg-gray-50 text-sm"
              >
                <FcGoogle size={16} />
                Continue with Google
              </Button>
            </div>
            
            <p className="mt-4 text-xs text-center text-gray-500">
              Click the button, you will receive a one time code in your inbox.
            </p>
          </div>
          
          <p className="text-xs text-center text-gray-500 bg-gray-100 p-2 rounded">
            By signing up, you accept our{' '}
            <a href="#" className="text-purple-600 hover:text-purple-500">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-purple-600 hover:text-purple-500">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;