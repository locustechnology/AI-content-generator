'use client'
import { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    Paddle: any; // Declare Paddle in the global window object
  }
}

type Props = {
  user: User;
}

const PaddlePricingTable = ({ user }: Props) => {
  const [basicPrice, setBasicPrice] = useState('$35.00');
  const [starterPrice, setStarterPrice] = useState('$45.00');
  const [premiumPrice, setPremiumPrice] = useState('$75.00');
  const [paddleLoaded, setPaddleLoaded] = useState(false);

  useEffect(() => {
    // Ensure Paddle script is loaded only on the client side
    if (typeof window !== 'undefined') {
      // Load Paddle.js script
      const script = document.createElement('script');
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      script.crossOrigin = 'anonymous'; // Ensures cross-origin safety

      document.body.appendChild(script);

      script.onload = () => {
        // Initialize Paddle
        window.Paddle.Environment.set("sandbox"); // Use 'sandbox' for testing, switch to 'live' when going live
        window.Paddle.Initialize({
          token: "test_92774b2a8bc4298034a84cb3f42" // Your sandbox client-side token
        });
        setPaddleLoaded(true); // Set paddleLoaded to true once Paddle is initialized
      };

      // Clean up the script when the component is unmounted
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const openCheckout = (productId: string) => {
    if (paddleLoaded) { // Check if Paddle is loaded before calling Checkout
      window.Paddle.Checkout.open({
        product: productId,
        email: user.email,
        successCallback: (data: any) => {
          console.log('Checkout successful:', data);
        },
        closeCallback: () => {
          console.log('Checkout closed');
        }
      });
    } else {
      console.error('Paddle is not loaded yet.');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center py-12 bg-white'>
      <div className="flex justify-center space-x-8">
        {/* Basic Plan */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center w-80">
          <h3 className="text-gray-500 font-medium">Basic</h3>
          <div className="relative">
            <span className="text-4xl font-bold text-orange-500">{basicPrice}</span>
          </div>
          <ul className="text-left space-y-2 text-gray-600 mt-4">
            <li>📷 60 high-quality headshots</li>
            <li>⏱ 1-hour processing time</li>
            <li>👗 20 outfits and backgrounds</li>
            <li>🕺 20 poses</li>
          </ul>
          <button onClick={() => openCheckout('pri_01j6wfjbgevsc47sv22ja6qq60')}
            className="mt-6 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400">
            Pay Now
          </button>
        </div>

        {/* Starter Plan */}
        <div className="p-6 bg-white border-2 border-orange-500 rounded-lg text-center w-80 shadow-lg">
          <h3 className="text-gray-500 font-medium">Starter</h3>
          <div className="relative">
            <span className="text-4xl font-bold text-black">{starterPrice}</span>
          </div>
          <ul className="text-left space-y-2 text-gray-600 mt-4">
            <li>📷 20 high-quality headshots</li>
            <li>⏱ 2-hour processing time</li>
            <li>👗 5 outfits and backgrounds</li>
            <li>🕺 5 poses</li>
          </ul>
          <button onClick={() => openCheckout('pri_01j6w1gr39da9p41rymadfde5q')}
            className="mt-6 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            Pay Now
          </button>
        </div>

        {/* Premium Plan */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center w-80">
          <h3 className="text-gray-500 font-medium">Premium</h3>
          <div className="relative">
            <span className="text-4xl font-bold text-black">{premiumPrice}</span>
          </div>
          <ul className="text-left space-y-2 text-gray-600 mt-4">
            <li>📷 100 high-quality headshots</li>
            <li>⏱ 30-min processing time</li>
            <li>👗 40 outfits and backgrounds</li>
            <li>🕺 40 poses</li>
          </ul>
          <button onClick={() => openCheckout('pri_01j6wfs9rsv8xcbgcz9jwtx146')}
            className="mt-6 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaddlePricingTable;
