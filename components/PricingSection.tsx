import React from 'react';
import { ArrowRight, Camera, Clock, Shirt, User } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface PricingTierProps {
  name: string;
  price: number;
  features: Feature[];
  isPopular?: boolean;
  isBestValue?: boolean;
}

const PricingTier: React.FC<PricingTierProps> = ({ name, price, features, isPopular, isBestValue }) => (
  <div className={`bg-white rounded-[2rem] p-8 ${isPopular ? 'shadow-lg' : 'shadow-md'} relative`}>
    {isPopular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
        82% pick this plan
      </div>
    )}
    {isBestValue && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
        Best Value
      </div>
    )}
    <h3 className={`text-xl font-bold text-center mb-4 ${isPopular ? 'text-blue-600' : name === 'PREMIUM' ? 'text-purple-600' : 'text-blue-600'}`}>{name}</h3>
    <div className="text-center mb-2">
      <span className={`text-4xl font-bold ${isPopular ? 'text-blue-600' : name === 'PREMIUM' ? 'text-purple-600' : 'text-gray-900'}`}>${price}</span>
      <span className={`text-lg ${isPopular ? 'text-blue-400' : 'text-gray-500'}`}>/ month</span>
    </div>
    <p className="text-gray-500 text-center mb-6 text-sm">billed monthly</p>
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-700">
          {feature.icon}
          <span className="ml-2">{feature.text}</span>
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-3 px-4 rounded-full flex items-center justify-center ${
        isPopular ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
      }`}
    >
      Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
    </button>
    <p className="text-gray-500 text-center mt-4 text-sm">No credit card required</p>
  </div>
);

const PricingPage: React.FC = () => {
  const tiers: PricingTierProps[] = [
    {
      name: "STARTER",
      price: 35,
      features: [
        { icon: <Camera className="h-5 w-5 text-gray-400" />, text: "20 high-quality headshots" },
        { icon: <Clock className="h-5 w-5 text-gray-400" />, text: "2-hour processing time" },
        { icon: <Shirt className="h-5 w-5 text-gray-400" />, text: "5 outfits and backgrounds" },
        { icon: <User className="h-5 w-5 text-gray-400" />, text: "5 poses" },
      ],
    },
    {
      name: "STANDARD",
      price: 45,
      features: [
        { icon: <Camera className="h-5 w-5 text-blue-400" />, text: "60 high-quality headshots" },
        { icon: <Clock className="h-5 w-5 text-blue-400" />, text: "1-hour processing time" },
        { icon: <Shirt className="h-5 w-5 text-blue-400" />, text: "20 outfits and backgrounds" },
        { icon: <User className="h-5 w-5 text-blue-400" />, text: "20 poses" },
      ],
      isPopular: true,
    },
    {
      name: "PREMIUM",
      price: 75,
      features: [
        { icon: <Camera className="h-5 w-5 text-purple-400" />, text: "100 high-quality headshots" },
        { icon: <Clock className="h-5 w-5 text-purple-400" />, text: "30-min processing time" },
        { icon: <Shirt className="h-5 w-5 text-purple-400" />, text: "40 outfits and backgrounds" },
        { icon: <User className="h-5 w-5 text-purple-400" />, text: "40 poses" },
      ],
      isBestValue: true,
    },
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 rounded-[2rem] my-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Premium quality without <br/> premium pricing.
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Save hundreds compared to a photo shoot. Customize your AI professional headshot <br/>with manual edits or get a redo if the initial uploads were wrong.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;