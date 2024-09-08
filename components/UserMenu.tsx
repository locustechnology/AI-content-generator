"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import ClientSideCredits from "./realtime/ClientSideCredits";

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

interface UserMenuProps {
  user: {
    email?: string;
  };
  credits: number;
}

export default function UserMenu({ user, credits }: UserMenuProps) {
  return user ? (
    <>
      {stripeIsConfigured && <ClientSideCredits creditsRow={{ credits }} />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-full text-sm h-8 w-8">
            {user.email?.charAt(0).toUpperCase()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <form action="/auth/sign-out" method="post">
            <Button type="submit" variant="ghost" className="w-full text-left">
              Log out
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : (
    <Link href="/login">
      <Button variant="outline" className="text-sm">Login / Signup</Button>
    </Link>
  );
}
