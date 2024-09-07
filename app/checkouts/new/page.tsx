'use client'
import React, { useEffect, useState } from 'react';
import Script from 'next/script';

interface ProductDetails {
  name: string;
  price: string;
  description: string;
}

interface CheckoutPageProps {
  searchParams: { id: string };
}

declare global {
  interface Window {
    Paddle: any;
  }
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ searchParams }) => {
  const { id } = searchParams;
  const [paddleReady, setPaddleReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const initializePaddle = () => {
      if (window.Paddle) {
        try {
          window.Paddle.Environment.set('sandbox');
          window.Paddle.Setup({ token: 'test_92774b2a8bc4298034a84cb3f42' });
          
          // Check if Paddle is already ready
          if (window.Paddle.Checkout) {
            console.log('Paddle is ready');
            setPaddleReady(true);
          } else {
            // If not ready, set up a listener for the 'ready' event
            window.Paddle.on('ready', () => {
              console.log('Paddle is ready');
              setPaddleReady(true);
            });
          }
        } catch (error) {
          console.error('Error initializing Paddle:', error);
          setError('Failed to initialize payment system. Please try again later.');
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!paddleReady || !id) {
      setError('Paddle not loaded or product ID missing. Please try again.');
      return;
    }

    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const country = (form.elements.namedItem('country') as HTMLSelectElement).value;
    const postcode = (form.elements.namedItem('zipcode') as HTMLInputElement).value;

    try {
      console.log('Initiating Paddle checkout with:', { id, email, country, postcode });
      const checkout = await window.Paddle.Checkout.open({
        settings: {
          frameTarget: 'paddle-checkout',
          frameInitialHeight: 416
        },
        items: [{ priceId: id, quantity: 1 }],
        customer: {
          email: email,
          address: {
            countryCode: country,
            postalCode: postcode,
          },
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
        strategy="lazyOnload"
      />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Complete your purchase</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">Email address</label>
                <input type="email" id="email" name="email" className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label htmlFor="country" className="block mb-2">Country</label>
                <select id="country" name="country" className="w-full p-2 border rounded" required>
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="zipcode" className="block mb-2">ZIP/Postcode</label>
                <input type="text" id="zipcode" name="zipcode" className="w-full p-2 border rounded" required />
              </div>
              <button 
                type="submit" 
                className={`bg-blue-500 text-white px-4 py-2 rounded ${!paddleReady && 'opacity-50 cursor-not-allowed'}`}
                disabled={!paddleReady}
              >
                {paddleReady ? 'Continue to Payment' : 'Loading Paddle...'}
              </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <div className="w-full md:w-1/3">
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {loading ? (
                <p>Loading product details...</p>
              ) : productDetails ? (
                <div>
                  <h3 className="font-semibold">{productDetails.name}</h3>
                  <p className="text-gray-600">{productDetails.description}</p>
                  <p className="font-bold mt-2">{productDetails.price}</p>
                </div>
              ) : (
                <p>No product details available</p>
              )}
            </div>
          </div>
        </div>
        <div id="paddle-checkout" style={{width: '100%', height: '416px', marginTop: '20px'}}></div>
      </div>
    </>
  );
};

export default CheckoutPage;