import React from 'react';
import { Shield, Users, Headphones, Lock } from 'lucide-react';

interface SecurityFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SecurityFeature: React.FC<SecurityFeatureProps> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <div className="p-3 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full">
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-300">{description}</p>
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
            icon={<Shield className="h-6 w-6 text-white" />}
            title="Data Protection"
            description="We never share your data with third parties without your explicit consent."
          />
          <SecurityFeature
            icon={<Users className="h-6 w-6 text-white" />}
            title="User Control"
            description="You have full control over how your data is used and processed."
          />
          <SecurityFeature
            icon={<Headphones className="h-6 w-6 text-white" />}
            title="24/7 Support"
            description="Our customer support team is always available to assist you."
          />
          <SecurityFeature
            icon={<Lock className="h-6 w-6 text-white" />}
            title="Advanced Encryption"
            description="We use state-of-the-art encryption to protect all sensitive information."
          />
        </div>
        
        <div className="text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-full hover:from-indigo-600 hover:to-cyan-600 transition duration-300">
            Create Your Headshot
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSecuritySection;