import Image from 'next/image';
import { Button } from "@/components/ui/button";
import heroo from "/public/heroo.png";
import plus from "/public/plus.png";
import star from "/public/star.png";
import watch from "/public/watch.png";
import correct from "/public/correct.png";
import dell from "/public/dell.png";
import shopify from "/public/shopify.png";
import ebay from "/public/ebay.png";
import box from "/public/box.png";

const HeroSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-4 sm:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col justify-between lg:w-1/2 w-full">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Professional Headshots<br/> done with AI at your Home
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Transform your photos into high-quality, professional<br className="hidden sm:inline" /> headshots effortlessly.
          </p>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
            {[
              { icon: star, text: "Pick from 150+ styles" },
              { icon: watch, text: "Done in less than 1 hour" },
              { icon: plus, text: "Strict data protection" },
              { icon: correct, text: "Guaranteed results" },
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <Image src={item.icon} alt="" width={24} height={24} />
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-base font-semibold">
              Get Started For Free →
            </Button>
            <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-base font-semibold">
              Watch Video Demo
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2 font-semibold">
            Trusted by 2100 happy customers globally
          </p>
          <div className="flex items-center space-x-4">
            <Image src={dell} alt="Dell" width={70} height={28} className="h-5 w-auto" />
            <Image src={shopify} alt="Shopify" width={70} height={28} className="h-5 w-auto" />
            <Image src={ebay} alt="eBay" width={70} height={28} className="h-5 w-auto" />
            <Image src={box} alt="Box" width={70} height={28} className="h-5 w-auto" />
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 w-full flex items-center justify-center">
        <div className="relative">
          <Image
            src={heroo}
            alt="AI Headshot Illustration"
            width={600}
            height={600}
            className="rounded-lg shadow-lg w-full h-auto"
          />
          
        </div>
      </div>
    </div>
  );
};

export default HeroSection;