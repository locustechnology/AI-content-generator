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
    <div className="flex flex-col items-center w-full bg-gray-50">
      {/* <div className="flex flex-col lg:flex-row items-stretch gap-8 p-4 sm:p-8 max-w-7xl w-full">
        <div className="flex flex-col justify-between space-y-4 lg:w-1/2 w-full">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Professional Headshots<br className="hidden sm:inline" /> done with AI at your Home
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">
              Transform your photos into high-quality, professional<br/> headshots effortlessly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { icon: star, text: "Pick from 150+ styles" },
                { icon: watch, text: "Done in less than 1 hour" },
                { icon: plus, text: "Strict data protection" },
                { icon: correct, text: "Guaranteed results" },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Image src={item.icon} alt="" width={20} height={20} />
                  </div>
                  <span className="text-sm sm:text-base">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full w-full sm:w-1/2">
                Get Started For Free →
              </Button>
              <Button variant="outline" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-full w-full sm:w-1/2">
                Watch Video Demo
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-700 mb-1 font-bold">
              Trusted by 2100 happy customers globally
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Image src={dell} alt="Dell" width={70} height={28} className="h-4 w-auto" />
              <Image src={shopify} alt="Shopify" width={70} height={28} className="h-4 w-auto" />
              <Image src={ebay} alt="eBay" width={70} height={28} className="h-4 w-auto" />
              <Image src={box} alt="Box" width={70} height={28} className="h-4 w-auto" />
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 w-full flex items-center justify-center">
          <Image
            src={heroo.src}
            alt="AI Headshot Illustration"
            width={600}
            height={600}
            className="rounded-lg object-cover w-full h-auto max-h-[600px]"
          />
        </div>
      </div> */}
      <HeroSection />
      <ExplainerSection />
      <PricingSection />
      <Container />
    </div>
  );
}