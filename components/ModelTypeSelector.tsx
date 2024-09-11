import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import Image from 'next/image';

const ModelTypeSelector = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        <span className="text-purple-500">Studio-quality</span> Headshots with Gostudio.AI
      </h1>
      <p className="text-gray-600 mb-8">
        Get studio quality headshot in no time and enhance your professional journey.
      </p>
      
      <RadioGroup defaultValue="female" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['female', 'male', 'kids'].map((type) => (
          <label
            key={type}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
          >
            <input
              type="radio"
              name="modelType"
              value={type}
              className="sr-only peer"
            />
            <Image
              src={`/placeholder/${type}.jpg`}
              alt={type}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 peer-checked:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            </div>
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white opacity-0 peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-purple-500"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </label>
        ))}
      </RadioGroup>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        By using our AI Tools, you agree to and accept our Terms of Use
      </p>
      
      <button className="w-full sm:w-auto mt-8 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-semibold hover:opacity-90 transition-opacity duration-300">
        Continue →
      </button>
    </div>
  );
};

export default ModelTypeSelector;