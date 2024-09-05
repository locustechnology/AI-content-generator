'use client'
import { useState, useEffect } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';

const CheckoutPage = dynamic(() => import('./CheckoutPage'), { 
  ssr: false,
  loading: () => <p>Loading checkout...</p>
});

interface PaddleWindow extends Window {
  Paddle?: any;
}

declare const window: PaddleWindow;

const PaddlePricing = () => {
  const [prices, setPrices] = useState<Record<string, string>>({
    pri_01j6w1gr39da9p41rymadfde5q: '',
    pri_01j6wfjbgevsc47sv22ja6qq60: '',
    pri_01j6wfs9rsv8xcbgcz9jwtx146: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paddleInitialized, setPaddleInitialized] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ priceId: string; name: string } | null>(null);

  const initializePaddle = () => {
    console.log('Initializing Paddle...');
    if (window.Paddle) {
      try {
        window.Paddle.Environment.set('sandbox');
        window.Paddle.Setup({ token: 'test_92774b2a8bc4298034a84cb3f42' });
        console.log('Paddle initialized successfully');
        setPaddleInitialized(true);
        getPrices();
      } catch (error) {
        console.error('Error initializing Paddle:', error);
        setError(`Failed to initialize Paddle SDK: ${(error as Error).message}`);
      }
    } else {
      console.error('Paddle SDK not found');
      setError('Paddle SDK not found after loading. Please check your Paddle account and SDK URL.');
    }
  };

  const getPrices = async () => {
    console.log('Fetching prices...');
    if (!window.Paddle) {
      console.error('Paddle not available');
      setError('Paddle not available');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const items = [
      { priceId: 'pri_01j6w1gr39da9p41rymadfde5q', quantity: 1 },
      { priceId: 'pri_01j6wfjbgevsc47sv22ja6qq60', quantity: 1 },
      { priceId: 'pri_01j6wfs9rsv8xcbgcz9jwtx146', quantity: 1 },
    ];

    try {
      const result = await window.Paddle.PricePreview({ items });

      console.log('Price preview result:', result);

      if (result.data && result.data.details && result.data.details.lineItems) {
        const newPrices: Record<string, string> = {};
        result.data.details.lineItems.forEach((item: any) => {
          newPrices[item.price.id] = item.formattedTotals.total;
        });
        console.log('New prices:', newPrices);
        setPrices(newPrices);
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (priceId: string, name: string) => {
    console.log(`Selected plan: ${name} (${priceId})`);
    setSelectedPlan({ priceId, name });
  };

  const handleCloseCheckout = () => {
    console.log('Closing checkout');
    setSelectedPlan(null);
  };

  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={initializePaddle}
        onError={(e) => {
          console.error('Failed to load Paddle SDK:', e);
          setError(`Failed to load Paddle SDK: ${(e as Error).message}`);
        }}
        strategy="afterInteractive"
      />
      <div className="container mx-auto p-4">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {selectedPlan ? (
          <CheckoutPage
            priceId={selectedPlan.priceId}
            price={prices[selectedPlan.priceId]}
            productName={selectedPlan.name}
            onClose={handleCloseCheckout}
          />
        ) : isLoading ? (
          <p className="text-center">Loading prices...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Package */}
            <div className="border rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <p className="text-gray-500 line-through mb-1">$59</p>
              <p className="text-4xl font-bold mb-4">{prices['pri_01j6w1gr39da9p41rymadfde5q'] || 'Loading...'}</p>
              <ul className="text-left space-y-2 mb-4">
                <li>📸 20 high-quality headshots</li>
                <li>⏱ 2-hour processing time</li>
                <li>👚 5 outfits and backgrounds</li>
                <li>🕺 5 poses</li>
              </ul>
              <button 
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                onClick={() => handleSelectPlan('pri_01j6w1gr39da9p41rymadfde5q', 'Starter')}
                disabled={!paddleInitialized || !prices['pri_01j6w1gr39da9p41rymadfde5q']}
              >
                {paddleInitialized && prices['pri_01j6w1gr39da9p41rymadfde5q'] ? 'Select Starter' : 'Loading...'}
              </button>
            </div>

            {/* Basic Package */}
            <div className="border rounded-lg p-6 text-center relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-400 text-white px-3 py-1 rounded-full text-sm">
                82% pick this plan
              </div>
              <h3 className="text-xl font-semibold mb-2">Basic</h3>
              <p className="text-gray-500 line-through mb-1">$79</p>
              <p className="text-4xl font-bold text-orange-400 mb-4">{prices['pri_01j6wfjbgevsc47sv22ja6qq60'] || 'Loading...'}</p>
              <ul className="text-left space-y-2 mb-4">
                <li>📸 60 high-quality headshots</li>
                <li>⏱ 1-hour processing time</li>
                <li>👚 20 outfits and backgrounds</li>
                <li>🕺 20 poses</li>
              </ul>
              <button 
                className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-500 transition"
                onClick={() => handleSelectPlan('pri_01j6wfjbgevsc47sv22ja6qq60', 'Basic')}
                disabled={!paddleInitialized || !prices['pri_01j6wfjbgevsc47sv22ja6qq60']}
              >
                {paddleInitialized && prices['pri_01j6wfjbgevsc47sv22ja6qq60'] ? 'Select Basic' : 'Loading...'}
              </button>
            </div>

            {/* Premium Package */}
            <div className="border rounded-lg p-6 text-center relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-tl-lg rounded-br-lg text-sm">
                Best Value
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium</h3>
              <p className="text-gray-500 line-through mb-1">$129</p>
              <p className="text-4xl font-bold mb-4">{prices['pri_01j6wfs9rsv8xcbgcz9jwtx146'] || 'Loading...'}</p>
              <ul className="text-left space-y-2 mb-4">
                <li>📸 100 high-quality headshots</li>
                <li>⏱ 30-min processing time</li>
                <li>👚 40 outfits and backgrounds</li>
                <li>🕺 40 poses</li>
              </ul>
              <button 
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                onClick={() => handleSelectPlan('pri_01j6wfs9rsv8xcbgcz9jwtx146', 'Premium')}
                disabled={!paddleInitialized || !prices['pri_01j6wfs9rsv8xcbgcz9jwtx146']}
              >
                {paddleInitialized && prices['pri_01j6wfs9rsv8xcbgcz9jwtx146'] ? 'Select Premium' : 'Loading...'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PaddlePricing;