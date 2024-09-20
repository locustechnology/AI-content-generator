'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import female from "/public/female.png";
import male from "/public/male.png";
import kid from "/public/kid.png";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type ModelType = 'female' | 'male' | 'kids';

interface ModelOption {
  value: ModelType;
  label: string;
  src: any;  // Using 'any' to avoid potential StaticImageData issues
}

const modelTypes: ModelOption[] = [
  { value: 'female', label: 'Female', src: female },
  { value: 'male', label: 'Male', src: male },
  { value: 'kids', label: 'Kids', src: kid },
];

interface ModelTypeSelectorProps {
  onSelectModel: () => void;
}

export const ModelTypeSelector: React.FC<ModelTypeSelectorProps> = ({ onSelectModel }) => {
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const supabase = isClient ? createClientComponentClient() : null;

  const handleSelectModel = useCallback((value: ModelType) => {
    setSelectedModel(value);
    setError(null); // Clear any previous errors when a new selection is made
  }, []);

  const handleContinue = useCallback(async () => {
    if (selectedModel && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('User not authenticated. Please log in.');
          return;
        }

        // Insert a new record into the models table
        const { data, error } = await supabase
          .from('models')
          .insert({
            name: `${user.id}_${selectedModel}`, // Unique name combining user ID and model type
            type: selectedModel,
            user_id: user.id,
            status: 'processing', // Assuming initial status is 'processing'
            meta_data: JSON.stringify({ selectedVia: 'ModelTypeSelector' }) // Optional: Add any additional metadata
          });

        if (error) throw error;
        console.log('New model inserted:', data);

        onSelectModel(); // Call the prop function to navigate to the next step
      } catch (error) {
        console.error('Error saving model:', error);
        setError('Failed to save your selection. Please try again.');
      }
    } else if (!supabase) {
      setError('Failed to initialize the application. Please refresh the page.');
    } else {
      setError('Please select a model type before continuing.');
    }
  }, [selectedModel, supabase, onSelectModel]);

  const buttonClass = useMemo(() => `
    px-10 py-3 rounded-full text-lg font-semibold transition-all duration-200
    ${selectedModel 
      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600' 
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
  `, [selectedModel]);

  if (!isClient) {
    return <div>Loading...</div>; // Show a loading indicator
  }

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
        {modelTypes.map((item) => (
          <div key={item.value} className="relative">
            <RadioGroupItem value={item.value} id={item.value} className="peer sr-only" />
            <Label
              htmlFor={item.value}
              className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-6 hover:bg-gray-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all duration-200"
            >
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={item.src}
                  alt={item.label}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <span className="text-xl font-medium text-gray-900">{item.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="text-center space-y-6">
        {error && <p className="text-red-500">{error}</p>}
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