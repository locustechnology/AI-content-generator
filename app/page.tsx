import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ExplainerSection from "@/components/ExplainerSection";
import PricingSection from "@/components/PricingSection";
import heroo from "/public/heroo.png";
import plus from "/public/plus.png";
import star from "/public/star.png";
import watch from "/public/watch.png";
import correct from "/public/correct.png";
import dell from "/public/dell.png";
import shopify from "/public/shopify.png";
import ebay from "/public/ebay.png";
import box from "/public/box.png";
import Container from "@/components/container";
import HeroSection from "@/components/Hero";
import Questions from "@/components/Questions"
import Footer from "@/components/Footer";
import Banner from "@/components/Banner"
import ReviewPage from "@/components/ReviewPage";
import MoneyBackGuarantee from "@/components/moneysection";
export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/overview");
  }

  return (
    
      <div className="w-full max-w-6xl  p-8 bg-gray-50 rounded-lg space-y-1 flex flex-col ">
      
      <HeroSection />
      <ExplainerSection />
      <ReviewPage/>
      <MoneyBackGuarantee/>
      <PricingSection />
      <Container />
      <Questions/>
      <Banner />
      <Footer />
    </div>
  );
}