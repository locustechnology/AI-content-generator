import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { Database } from "@/app/types/supabase";
import NavItems from "./NavItems";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import logo from "/public/98.png";
import ClientSideCredits from "./realtime/ClientSideCredits";

export const dynamic = "force-dynamic";

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
export const revalidate = 0;

export default async function Navbar() {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  
  const {
    data: credits,
  } = await supabase.from("credits").select("*").eq("user_id", user?.id ?? '').single()


  return (
    <nav className="bg-white-100 shadow-sm rounded-full mx-4 my-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <div className="bg-purple-600 rounded-lg p-1 mr-2">
              <Image src={logo} alt="Studio.ai logo" width={20} height={20} className="rounded-sm" />
            </div>
            <span className="font-bold py-2 rounded">Studio.ai</span>
          </Link>
          
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-4">
              <NavItems />
              <UserMenu user={user} credits={credits?.credits ?? 0} />
              </div>
            <MobileMenu user={user} credits={credits?.credits ?? 0} />
              </>
          ) : (
            <Link href="/login">
              <button className="  font-bold py-2 px-4 rounded">
                Login / Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
