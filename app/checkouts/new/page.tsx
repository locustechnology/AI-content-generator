// Necessary for Next.js client-side rendering
'use client'

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

// Define interfaces for type safety
interface ProductDetails {
  name: string;
  price: string;
  description: string;
}

interface CheckoutPageProps {
  searchParams: { id: string };
}

// Extend the Window interface to include Paddle
declare global {
  interface Window {
    Paddle: any;
  }
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ searchParams }) => {
  const { id } = searchParams;
  const router = useRouter();
  const [paddleReady, setPaddleReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details when the component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/product-details?priceId=${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductDetails(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to fetch product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
  }, [id]);

  // Initialize Paddle payment system
  const initializePaddle = () => {
    if (window.Paddle) {
      try {
        window.Paddle.Environment.set('sandbox');
        window.Paddle.Setup({ 
          vendor: 22432, // Replace with your actual Paddle vendor ID
          eventCallback: function(eventData: any) {
            if (eventData.name === 'checkout.completed') {
              console.log('Checkout completed:', eventData);
              handleCheckoutSuccess(eventData);
            }
          }
        });
        
        console.log('Paddle initialized successfully');
        setPaddleReady(true);
      } catch (error) {
        console.error('Error initializing Paddle:', error);
        setError('Failed to initialize payment system. Please try again later.');
      }
    }
  };

  // Set up Paddle when the component mounts
  useEffect(() => {
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

  // Handle successful checkout
  const handleCheckoutSuccess = async (eventData: any) => {
    console.log('Order completed successfully!', eventData);
    
    try {
      const response = await fetch('/api/order-completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to process order completion');
      }

      const result = await response.json();
      console.log('Order processed:', result);

      // Update UI to show a thank you message
      const checkoutElement = document.getElementById('paddle-checkout');
      if (checkoutElement) {
        checkoutElement.innerHTML = '<h2 class="text-2xl font-bold text-green-600">Thank you for your order!</h2>';
      }

      // Redirect to overview page after a short delay
      setTimeout(() => {
        router.push('/overview');
      }, 3000);
    } catch (error) {
      console.error('Error processing order completion:', error);
      setError('There was an issue processing your order. Please contact support.');
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!paddleReady || !id) {
      setError('Payment system not ready or product ID missing. Please try again.');
      return;
    }

    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const country = (form.elements.namedItem('country') as HTMLSelectElement).value;
    const postcode = (form.elements.namedItem('zipcode') as HTMLInputElement).value;

    try {
      console.log('Initiating Paddle checkout with:', { id, email, country, postcode });
      const checkout = await window.Paddle.Checkout.open({
        items: [{ priceId: id }],
        customer: {
          email: email,
          country: country,
          postcode: postcode,
        },
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'en',
          successUrl: `${window.location.origin}/checkout/success`,
        },
      });

      console.log('Checkout created:', checkout);
    } catch (error) {
      console.error('Detailed error in creating checkout:', error);
      setError(`Checkout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <Script 
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={() => {
          console.log('Paddle script loaded');
          if (window.Paddle) {
            initializePaddle();
          }
        }}
      />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Complete your purchase</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">Email address</label>
                <input type="email" id="email" name="email" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="country" className="block mb-2 font-medium">Country</label>
                <select id="country" name="country" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required>
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
              <div>
                <label htmlFor="zipcode" className="block mb-2 font-medium">ZIP/Postcode</label>
                <input type="text" id="zipcode" name="zipcode" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required />
              </div>
              <button 
                type="submit" 
                className={`bg-blue-500 text-white px-6 py-3 rounded font-semibold transition duration-300 ease-in-out ${!paddleReady && 'opacity-50 cursor-not-allowed'} hover:bg-blue-600`}
                disabled={!paddleReady}
              >
                {paddleReady ? 'Continue to Payment' : 'Loading Payment System...'}
              </button>
            </form>
            {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
          </div>
          <div className="w-full md:w-1/3">
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {loading ? (
                <p className="text-gray-600">Loading product details...</p>
              ) : productDetails ? (
                <div>
                  <h3 className="font-semibold text-lg">{productDetails.name}</h3>
                  <p className="text-gray-600 mt-2">{productDetails.description}</p>
                  <p className="font-bold mt-4 text-xl">{productDetails.price}</p>
                </div>
              ) : (
                <p className="text-gray-600">No product details available</p>
              )}
            </div>
          </div>
        </div>
        <div id="paddle-checkout" className="mt-8 w-full h-[416px]"></div>
        <p className="mt-4 text-sm text-gray-600">
          Note: This is a demo checkout. In a production environment, you would typically implement user authentication before allowing purchases.
        </p>
      </div>
    </>
  );
};

export default CheckoutPage;