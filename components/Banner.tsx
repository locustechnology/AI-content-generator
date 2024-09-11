import React from 'react';
import Image from 'next/image';
import Union from "/public/Union.png"

const Banner = () => {
  return (
    <div className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-500 text-white rounded-3xl overflow-hidden relative min-h-[16rem] md:h-64">
      <div className="absolute left-0 top-0 bottom-0 w-full md:w-1/2 h-40 md:h-auto">
        <Image 
          src={Union} 
          alt="go" 
          layout="fill"
          objectFit="contain"
          objectPosition="left"
          priority
        />
      </div>
      <div className="pt-40 md:pt-0 md:ml-[40%] p-6 md:py-8 md:pr-8 h-full flex flex-col justify-center">
        <div className="relative mb-2">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            Save 87%
              {/* <span className="absolute -top-6 -right-1 bg-white text-blue-500 text-xs px-3 py-1 rounded-full whitespace-nowrap transform -rotate-6">
                on average
                <svg className="absolute -bottom-2 left-1/2 transform -translate-x-1/2" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10L0.669872 0L9.33013 0L5 10Z" fill="white"/>
                </svg>
              </span> */}
             your professional photos.
          </h2>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
          Whenever, wherever you are.
        </h2>
        <p className="text-sm md:text-base mb-4">
          Get studio-quality, 4K images in a variety of outfits<br className="hidden md:inline" /> & settings in less than an hour.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 text-sm md:text-base w-fit flex items-center">
          Get your Headshot Now
          <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Banner;