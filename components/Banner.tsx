import React from 'react';
import Image from 'next/image';
import Union from '/public/Union.png'

const HeadshotContainer = () => {
  return (
    <div className="flex items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-6xl h-80 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-[2rem] shadow-xl relative overflow-hidden">
        <div className="flex h-full relative">
          {/* Logo */}
          <div className="w-1/3 relative">
            <div className="absolute -left-1 -top-1 -bottom-1 w-[calc(100%+0.25rem)]">
              <Image
                src={Union}
                alt="Go logo"
                layout="fill"
                objectFit="cover"
                objectPosition="left center"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="w-2/3 pl-10 pr-8 py-10 flex flex-col justify-center">
            <div className="relative mb-6">
              
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
              Save 87% on your professional photos.
              <br />
              Whenever, wherever you are.
            </h1>
            <p className="text-lg text-white mb-8">
              Get studio-quality, 4K images in a variety of outfits
              <br />
              & settings in less than an hour.
            </p>
            <button className="bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-800 transition duration-300 self-start flex items-center">
              Get your Headshot Now
              <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadshotContainer;