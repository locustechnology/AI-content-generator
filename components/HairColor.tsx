import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const hairColors = [
  { name: 'Auburn', color: 'bg-red-700' },
  { name: 'Black', color: 'bg-gray-900' },
  { name: 'Blonde', color: 'bg-yellow-300' },
  { name: 'Brown', color: 'bg-yellow-900' },
  { name: 'Gray', color: 'bg-gray-400' },
  { name: 'Red', color: 'bg-red-500' },
  { name: 'White', color: 'bg-gray-100' },
  { name: 'Other', color: 'bg-purple-500' },
  { name: 'Bald', color: 'bg-transparent border-2 border-gray-300' },
];

const HairColorPage: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedColor) {
      router.push('/overview/models/train?step=image-upload');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
      <header className="p-4 md:p-6">
        <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center group">
          <ArrowLeft className="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg font-semibold">Back</span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 text-center">
            What's Your Hair Color?
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            Help us generate the perfect photos for you
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {hairColors.map((color) => (
              <button
                key={color.name}
                className={`p-4 rounded-xl flex items-center justify-between transition-all ${
                  selectedColor === color.name
                    ? 'ring-4 ring-indigo-500 shadow-lg scale-105'
                    : 'hover:shadow-md hover:scale-102'
                }`}
                onClick={() => setSelectedColor(color.name)}
              >
                <span className="font-medium text-gray-700">{color.name}</span>
                <span className={`w-8 h-8 rounded-full ${color.color}`}></span>
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleContinue}
            className={`w-full py-4 rounded-xl text-white text-xl font-bold transition-all text-center block ${
              selectedColor
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-102 active:scale-98 shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!selectedColor}
          >
            Continue
          </button>
        </div>
      </main>

      <footer className="p-4 text-center text-gray-600 text-sm">
        © 2024 Hair Color Selector. All rights reserved.
      </footer>
    </div>
  );
};

export default HairColorPage;