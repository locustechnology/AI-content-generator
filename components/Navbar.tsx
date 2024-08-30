import { AvatarIcon } from "@radix-ui/react-icons";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import React from "react";
import { Database } from "@/app/types/supabase"; 
import ClientSideCredits from "./realtime/ClientSideCredits";

export const dynamic = "force-dynamic";

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

export const revalidate = 0;

export default async function Navbar() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the user's credits from the database
  let { data: credits, error } = await supabase
    .from("credits")
    .select("credits")
    .eq("user_id", user?.id ?? '')
    .single();

  // If there's an error or no credits, fallback to 10 credits (for display purposes)
  if (error || !credits) {
    credits = { credits: 10 };
  }

  return (
    <div className="flex w-full px-4 lg:px-40 py-4 items-center border-b text-center gap-8 justify-between">
      <div className="flex gap-2 h-full">
        <Link href="/">
          <h2 className="font-bold">Headshots AI</h2>
        </Link>
      </div>
      {user && (
        <div className="hidden lg:flex flex-row gap-2">
          <Link href="/overview">
            <Button variant={"ghost"}>Home</Button>
          </Link>
          {stripeIsConfigured && (
            <Link href="/get-credits">
              <Button variant={"ghost"}>Get Credits</Button>
            </Link>
          )}
        </div>
      )}
      <div className="flex gap-4 lg:ml-auto">
        {!user && (
          <Link href="/login">
            <Button variant={"ghost"}>Login / Signup</Button>
          </Link>
        )}
        {user && (
          <div className="flex flex-row gap-4 text-center align-middle justify-center">
            {stripeIsConfigured && (
              <ClientSideCredits creditsRow={credits} />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <AvatarIcon height={24} width={24} className="text-primary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="text-primary text-center overflow-hidden text-ellipsis">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <form action="/auth/sign-out" method="post">
                  <Button
                    type="submit"
                    className="w-full text-left"
                    variant={"ghost"}
                    >
                    Log out
                  </Button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
