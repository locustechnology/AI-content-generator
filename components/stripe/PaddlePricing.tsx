"use client"

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

const PaddlePricing = () => {
  const router = useRouter();
  const [paddleReady, setPaddleReady] = useState(false);
  const [prices, setPrices] = useState({
    starter: '',
    basic: '',
    premium: ''
  });

  const items = [
    { priceId: 'pri_01j6w1gr39da9p41rymadfde5q', quantity: 1 }, // Starter
    { priceId: 'pri_01j6wfjbgevsc47sv22ja6qq60', quantity: 1 }, // Basic
    { priceId: 'pri_01j6wfs9rsv8xcbgcz9jwtx146', quantity: 1 }  // Premium
  ];

  useEffect(() => {
    const initializePaddle = () => {
      if (window.Paddle) {
        try {
          window.Paddle.Environment.set('sandbox');
          window.Paddle.Setup({ token: 'test_92774b2a8bc4298034a84cb3f42' });
          
          if (window.Paddle.Checkout) {
            console.log('Paddle is ready');
            setPaddleReady(true);
          } else {
            window.Paddle.on('ready', () => {
              console.log('Paddle is ready');
              setPaddleReady(true);
            });
          }
        } catch (error) {
          console.error('Error initializing Paddle:', error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      if (window.Paddle) {
        initializePaddle();
      } else {
        document.addEventListener('paddle:loaded', initializePaddle);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('paddle:loaded', initializePaddle);
      }
    };
  }, []);

  useEffect(() => {
    if (paddleReady) {
      getPrices();
    }
  }, [paddleReady]);

  const getPrices = () => {
    const request = {
      items: items
    };

    window.Paddle.PricePreview(request)
      .then((result: any) => {
        console.log(result);
        const lineItems = result.data.details.lineItems;
        const newPrices = { ...prices };
        lineItems.forEach((item: any) => {
          if (item.price.id === 'pri_01j6w1gr39da9p41rymadfde5q') newPrices.starter = item.formattedTotals.total;
          if (item.price.id === 'pri_01j6wfjbgevsc47sv22ja6qq60') newPrices.basic = item.formattedTotals.total;
          if (item.price.id === 'pri_01j6wfs9rsv8xcbgcz9jwtx146') newPrices.premium = item.formattedTotals.total;
        });
        setPrices(newPrices);
      })
      .catch((error: any) => {
        console.error('Error fetching prices:', error);
      });
  };

  const handleCheckout = (priceId: string) => {
    if (window.Paddle && paddleReady) {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        successCallback: (data: any) => {
          console.log('Payment successful:', data);
          router.push('/overview/models/train?step=image-upload');
        },
        closeCallback: (reason: any) => {
          console.log('Checkout closed. Reason:', reason);
        }
      });
    } else {
      console.error('Paddle is not ready');
    }
  };

  return (
    <>
      <Script 
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="lazyOnload"
      />
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Starter Plan</h3>
            <p className="text-3xl font-bold mb-4">
              {prices.starter || 'Loading...'}
            </p>
            <ul className="text-left mb-6">
              <li>✅ 20 high-quality headshots</li>
              <li>✅ 2-hour processing time</li>
              <li>✅ 5 outfits and backgrounds</li>
            </ul>
            <button 
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => handleCheckout('pri_01j6w1gr39da9p41rymadfde5q')}
              disabled={!paddleReady}
            >
              {paddleReady ? 'Choose Starter' : 'Loading...'}
            </button>
          </div>

          {/* Basic Plan */}
          <div className="border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Basic Plan</h3>
            <p className="text-3xl font-bold mb-4">
              {prices.basic || 'Loading...'}
            </p>
            <ul className="text-left mb-6">
              <li>✅ 60 high-quality headshots</li>
              <li>✅ 1-hour processing time</li>
              <li>✅ 20 outfits and backgrounds</li>
            </ul>
            <button 
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => handleCheckout('pri_01j6wfjbgevsc47sv22ja6qq60')}
              disabled={!paddleReady}
            >
              {paddleReady ? 'Choose Basic' : 'Loading...'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Premium Plan</h3>
            <p className="text-3xl font-bold mb-4">
              {prices.premium || 'Loading...'}
            </p>
            <ul className="text-left mb-6">
              <li>✅ 100 high-quality headshots</li>
              <li>✅ 30-min processing time</li>
              <li>✅ 40 outfits and backgrounds</li>
            </ul>
            <button 
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => handleCheckout('pri_01j6wfs9rsv8xcbgcz9jwtx146')}
              disabled={!paddleReady}
            >
              {paddleReady ? 'Choose Premium' : 'Loading...'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaddlePricing;