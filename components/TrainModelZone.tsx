'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { FaUpload, FaChevronDown, FaChevronUp, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import clear from "/public/good/clear.png";
import happy from "/public/good/happy.png";
import pose from "/public/good/pose.png";
import self from "/public/good/self.png";
import girl from "/public/bad/girl.png";
import group from "/public/bad/group.png";
import half from "/public/bad/half.png";
import heros from "/public/bad/heros.png";

interface Requirement {
  text: string;
  img: string;
}

const MAX_PHOTOS = 10;
const MIN_PHOTOS = 6;

interface TrainModelZoneProps {
  onContinue: () => void;
}

export default function TrainModelZone({ onContinue }: TrainModelZoneProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(true);
  const [isRestrictionsOpen, setIsRestrictionsOpen] = useState(true);
  const [error, setError] = useState('');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + uploadedPhotos.length > MAX_PHOTOS) {
      setError(`You can only upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }
    setUploadedPhotos((prevPhotos) => [...prevPhotos, ...files]);
    setError('');
  }, [uploadedPhotos]);

  const removePhoto = useCallback((index: number) => {
    setUploadedPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  }, []);

  const handleContinue = useCallback(() => {
    if (uploadedPhotos.length < MIN_PHOTOS) {
      setError(`Please upload at least ${MIN_PHOTOS} photos before continuing.`);
    } else {
      onContinue();
    }
  }, [uploadedPhotos.length, onContinue]);

  const requirements: Requirement[] = useMemo(() => [
    { text: "Variety: Upload photos with different outfits and backgrounds.", img: happy.src },
    { text: "Recency: Use recent photos that reflect your current appearance.", img: self.src },
    { text: "Clarity: Ensure uploads are well-lit, and you're not too far from the camera.", img: clear.src },
    { text: "Eye Contact: Uploads should show you looking directly at the camera.", img: pose.src },
  ], []);

  const restrictions: Requirement[] = useMemo(() => [
    { text: "No Accessories: Avoid photos in hats, sunglasses, and headwear.", img: girl.src },
    { text: "No Revealing Clothing: No tank tops, bikinis, or shirtless photos.", img: group.src },
    { text: "No Goofy Faces: Exclude silly expressions like duck faces or extreme poses.", img: half.src },
    { text: "No Unnatural Angles: Use front-view, eye-level shots; avoid side or extreme angles.", img: heros.src },
  ], []);

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/overview" className="text-sm w-fit mb-8 block">
          <Button variant="outline">
            <FaArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/5">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3">
              <span className="text-lg font-bold">?</span>
            </div>
            <h2 className="text-2xl font-bold">Upload photos</h2>
          </div>
          <p className="mb-4">Now the fun begins! Select at least {MIN_PHOTOS} of your best photos. Good photos will result in amazing headshots!</p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold py-2 px-4 rounded-full inline-flex items-center">
                <FaUpload className="mr-2" />
                Upload files
              </div>
              <p className="mt-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">PNG, JPG, HEIC up to 120MB</p>
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500">It can take up to 1 minute to upload</p>
        </div>
        
        <div className="w-full md:w-3/5">
          <h3 className="text-xl font-semibold mb-4">Uploaded Images</h3>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span>Progress</span>
              <span>{uploadedPhotos.length} / {MAX_PHOTOS}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{width: `${(uploadedPhotos.length / MAX_PHOTOS) * 100}%`}}></div>
            </div>
          </div>
          
          {uploadedPhotos.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Uploaded photos</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Uploaded photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-white text-purple-500 rounded-full p-1 hover:bg-red-100"
                      aria-label="Remove photo"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <RequirementSection
            title="PHOTO REQUIREMENTS"
            items={requirements}
            isOpen={isRequirementsOpen}
            setIsOpen={setIsRequirementsOpen}
            variant="purple"
          />
          
          <RequirementSection
            title="PHOTO RESTRICTIONS"
            items={restrictions}
            isOpen={isRestrictionsOpen}
            setIsOpen={setIsRestrictionsOpen}
            variant="red"
          />

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4 flex justify-start">
            <button
              onClick={handleContinue}
              className="bg-purple-500 text-white font-bold py-2 px-3 rounded-md text-sm transition duration-300 hover:bg-purple-600"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RequirementSectionProps {
  title: string;
  items: Requirement[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  variant: 'purple' | 'red';
}

const RequirementSection: React.FC<RequirementSectionProps> = ({
  title,
  items,
  isOpen,
  setIsOpen,
  variant
}) => (
  <div className="mb-6">
    <button
      className={`flex items-center justify-between w-full p-4 ${
        variant === 'purple' ? 'bg-purple-100' : 'bg-red-100'
      } rounded-lg text-left`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className={`font-semibold ${
        variant === 'purple' ? 'text-purple-700' : 'text-red-700'
      }`}>
        {variant === 'purple' ? '✓' : '✕'} {title}
      </span>
      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
    </button>
    {isOpen && (
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <Image src={item.img} alt={`${title} ${index + 1}`} width={96} height={96} className="object-cover rounded-lg" />
            <p className="text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);