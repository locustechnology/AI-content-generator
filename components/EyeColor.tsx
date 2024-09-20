import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EyeColor {
  id: string;
  color: string;
  label: string;
}

const eyeColors: EyeColor[] = [
  { id: 'brown', color: '#8B4513', label: 'Brown' },
  { id: 'blue', color: '#4169E1', label: 'Blue' },
  { id: 'green', color: '#228B22', label: 'Green' },
  { id: 'hazel', color: '#D2691E', label: 'Hazel' },
  { id: 'gray', color: '#708090', label: 'Gray' },
  { id: 'amber', color: '#FFA500', label: 'Amber' },
  { id: 'black', color: '#000000', label: 'Black' },
  { id: 'violet', color: '#8A2BE2', label: 'Violet' },
];

interface EyeColorPageProps {
  onContinue: (nextStep: string) => void;
}

const EyeColorPage: React.FC<EyeColorPageProps> = ({ onContinue }) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedColors(prev => 
      prev.includes(id) ? prev.filter(colorId => colorId !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedColors.length > 0) {
      console.log("Continuing with selected eye colors:", selectedColors);
      onContinue('hair-color');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Choose eye colors</span> for your model
        </h1>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select one or more eye colors:</h2>
          <p className="text-sm text-gray-500 mb-4">Selected: {selectedColors.length} / {eyeColors.length}</p>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {eyeColors.map((eyeColor) => (
              <motion.div 
                key={eyeColor.id} 
                className={`relative group cursor-pointer rounded-lg overflow-hidden shadow-md
                  ${selectedColors.includes(eyeColor.id) ? 'ring-4 ring-purple-500' : ''}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSelection(eyeColor.id)}
              >
                <div 
                  className="w-full h-24 sm:h-32"
                  style={{ backgroundColor: eyeColor.color }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-white" style={{ backgroundColor: eyeColor.color }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 p-2">
                  <p className="text-center font-medium">{eyeColor.label}</p>
                </div>
                {selectedColors.includes(eyeColor.id) && (
                  <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <p className="text-sm text-gray-500 text-center mb-6">
          Your selection will influence the AI-generated images
        </p>
        
        <div className="flex justify-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
          >
            Go Back
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className={`px-6 py-2 rounded-full transition-all duration-200 ${
              selectedColors.length > 0
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-pointer hover:from-blue-600 hover:to-purple-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={selectedColors.length === 0}
          >
            Continue →
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default EyeColorPage;