'use client'
import React, { useState, useCallback, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import Image, { StaticImageData } from 'next/image';
import female from "/public/female.png";
import male from "/public/male.png";
import kid from "/public/kid.png";

// Define types for better type safety
type ModelType = 'female' | 'male' | 'kids';

interface ModelOption {
  value: ModelType;
  label: string;
  src: StaticImageData;
}

const modelTypes: ModelOption[] = [
  { value: 'female', label: 'Female', src: female },
  { value: 'male', label: 'Male', src: male },
  { value: 'kids', label: 'Kids', src: kid },
];

export const ModelTypeSelector: React.FC<{ onSelectModel: (model: string) => void }> = ({ onSelectModel }) => {
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null);

  // Memoize handlers to prevent unnecessary re-renders
  const handleSelectModel = useCallback((value: ModelType) => {
    setSelectedModel(value);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedModel) {
      onSelectModel(selectedModel);
    } else {
      console.error('No model selected');
    }
  }, [selectedModel, onSelectModel]);

  // Memoize the button class to prevent unnecessary recalculations
  const buttonClass = useMemo(() => `
    px-10 py-3 rounded-full text-lg font-semibold transition-all duration-200
    ${selectedModel 
      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600' 
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
  `, [selectedModel]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-12">
      <Link href="/overview" className="text-sm w-fit mb-8 block">
        <Button variant="outline">
          <FaArrowLeft className="mr-2" />
          Go Back
        </Button>
      </Link>
      <div className="text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          <span className="text-purple-500">Studio-quality</span> Headshots with <span className="text-black">Gostudio.AI</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Get studio quality headshot in no time and enhance your professional journey.
        </p>
      </div>

      <RadioGroup 
        value={selectedModel || undefined}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
        onValueChange={handleSelectModel}
      >
        {modelTypes.map((item, index) => (
          <div key={item.value} className="relative">
            <RadioGroupItem value={item.value} id={item.value} className="peer sr-only" />
            <Label
              htmlFor={item.value}
              className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-6 hover:bg-gray-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all duration-200"
            >
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                <div className={`w-full h-full ${index === 0 ? 'scale-150' : 'scale-100'}`}>
                  <Image
                    src={item.src}
                    alt={item.label}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
              <span className="text-xl font-medium text-gray-900">{item.label}</span>
              <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-2 opacity-0 peer-data-[state=checked]:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="text-center space-y-6">
        <Button 
          onClick={handleContinue}
          disabled={!selectedModel}
          className={buttonClass}
          aria-label="Continue to next step"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
        <p className="text-sm text-gray-500">
          By using our AI Tools, you agree to and accept our{' '}
          <Link href="/terms" className="text-purple-500 hover:underline">
            Terms of Use
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ModelTypeSelector;