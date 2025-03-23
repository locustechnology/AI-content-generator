import React from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import Borderone from "/public/Borderone.png";
import Bordertwo from "/public/Bordertwo.png";
import Borderthird from "/public/Borderthird.png";
import Borderfour from "/public/Borderfour.png";

interface SecurityFeatureProps {
  imageSrc: string | StaticImageData;
  title: string;
  description: string;
}

const SecurityFeature: React.FC<SecurityFeatureProps> = ({ imageSrc, title, description }) => (
  <div className="flex items-center space-x-4">
    <div className="flex-shrink-0">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center overflow-hidden">
        <Image src={imageSrc} alt={title} width={40} height={40} className="object-cover" />
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  </div>
);

const DataSecuritySection: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text">
          We prioritize your data security
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Trusted by the professionals of CXO and Leadership teams<br/>
          of Fortune 500 companies and other reputed enterprise professionals
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <SecurityFeature
            imageSrc={Borderone}
            title="WE NEVER SELL YOUR DATA."
            description="GoStudio.ai will never sell your data to any third party."
          />
          <SecurityFeature
            imageSrc={Bordertwo}
            title="YOU'RE IN CONTROL"
            description="We will never use your photos to train new AI models without your permission"
          />
          <SecurityFeature
            imageSrc={Borderthird}
            title="LIVE SUPPORT"
            description="Contact us anytime from to receive assistance from our live customer support."
          />
          <SecurityFeature
            imageSrc={Borderfour}
            title="ADVANCED ENCRYPTION"
            description="Your data deserves the best protection. We encrypt all sensitive user data."
          />
        </div>
        
        <div className="text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-full hover:from-indigo-600 hover:to-cyan-600 transition duration-300">
            Create Your Headshot →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSecuritySection;
