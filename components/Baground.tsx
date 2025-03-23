import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Baground from "/public/Baground.png";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Background {
  id: string;
  label: string;
}

const backgrounds: Background[] = [
  { id: 'bg1', label: 'Female' },
  { id: 'bg2', label: 'Female' },
  { id: 'bg3', label: 'Female' },
  { id: 'bg4', label: 'Female' },
  { id: 'bg5', label: 'Female' },
  { id: 'bg6', label: 'Female' },
  { id: 'bg7', label: 'Female' },
  { id: 'bg8', label: 'Female' },
];

interface BackgroundSelectionPageProps {
  onContinue: (nextStep: string) => void;
}

const BackgroundSelectionPage: React.FC<BackgroundSelectionPageProps> = ({ onContinue }) => {
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    setCanContinue(selectedBackgrounds.length >= 3);
  }, [selectedBackgrounds]);

  const toggleSelection = (id: string) => {
    setSelectedBackgrounds(prev => 
      prev.includes(id) ? prev.filter(bgId => bgId !== id) : [...prev, id]
    );
  };

  const insertUserPreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        style_ids: selectedBackgrounds,
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error inserting user preferences:', error);
    } else {
      console.log('User preferences inserted successfully:', data);
    }
  };

  const handleContinue = async () => {
    if (canContinue) {
      console.log("Continuing with selected backgrounds:", selectedBackgrounds);
      
      // Insert user preferences into the database
      await insertUserPreferences();
      
      // Navigate to the next step (eyes-color)
      onContinue('eyes-color');
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          <span className="text-purple-500">Choose styles</span> for your image
        </h1>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Choose Background (select at least 3)</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {backgrounds.map((bg) => (
              <div key={bg.id} className="relative">
                <Image
                  src={Baground}
                  alt={bg.label}
                  width={120}
                  height={120}
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => toggleSelection(bg.id)}
                  className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 ${
                    selectedBackgrounds.includes(bg.id)
                      ? 'bg-purple-500 border-purple-500'
                      : 'border-white'
                  }`}
                >
                  {selectedBackgrounds.includes(bg.id) && (
                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <p className={`mt-1 text-sm text-center ${selectedBackgrounds.includes(bg.id) ? 'text-purple-500' : 'text-gray-400'}`}>
                  {bg.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-gray-500 text-center mb-4">
          By using our AI Tools, you agree to and accept our Terms of Use
        </p>
        
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-2 rounded-full bg-gray-200 text-gray-700">
            Go Back
          </button>
          <button 
            onClick={handleContinue}
            className={`px-6 py-2 rounded-full ${
              canContinue 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canContinue}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelectionPage;