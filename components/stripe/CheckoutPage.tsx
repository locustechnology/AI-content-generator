import React, { useEffect, useState } from 'react';

interface CheckoutPageProps {
  priceId: string;
  price: string;
  productName: string;
  onClose: () => void;
}

interface PaddleWindow extends Window {
  Paddle?: any;
}

declare const window: PaddleWindow;

const CheckoutPage: React.FC<CheckoutPageProps> = ({ priceId, price, productName, onClose }) => {
  const [total, setTotal] = useState(price);
  const [error, setError] = useState<string | null>(null);
  const [isInlineCheckoutFailed, setIsInlineCheckoutFailed] = useState(false);
  const checkoutContainerId = 'paddle-checkout-container';

  const updateCheckoutInfo = (event: any) => {
    if (event.eventName === 'checkout.loaded' || event.eventName === 'checkout.updated') {
      if (event.data && event.data.checkout && event.data.checkout.prices) {
        setTotal(event.data.checkout.prices.total);
      }
    }
  };

  const openCheckout = () => {
    if (typeof window === 'undefined' || !window.Paddle) {
      setError('Paddle SDK is not available. Please try again later.');
      return;
    }

    const container = document.getElementById(checkoutContainerId);
    if (!container) {
      setError('Checkout container not found.');
      return;
    }

    try {
      window.Paddle.Checkout.open({
        settings: {
          displayMode: "inline",
          frameTarget: checkoutContainerId,
          frameInitialHeight: 416,
          frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;",
        },
        items: [{ priceId, quantity: 1 }],
        eventCallback: updateCheckoutInfo,
      });
      console.log('Checkout opened successfully');
    } catch (error) {
      console.error('Failed to open inline checkout:', error);
      setIsInlineCheckoutFailed(true);
      setError(`Failed to open inline checkout. Falling back to overlay checkout.`);
    }
  };

  const openOverlayCheckout = () => {
    if (typeof window === 'undefined' || !window.Paddle) {
      setError('Paddle SDK is not available. Please try again later.');
      return;
    }

    try {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        eventCallback: updateCheckoutInfo,
      });
      console.log('Overlay checkout opened successfully');
    } catch (error) {
      console.error('Failed to open overlay checkout:', error);
      setError(`Failed to open checkout: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Paddle) {
      const timer = setTimeout(() => {
        openCheckout();
      }, 500); // Ensure the container exists
      return () => clearTimeout(timer);
    } else {
      setError('Paddle SDK is not available. Please try again later.');
    }
  }, [priceId, price, productName]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2">
        <button onClick={onClose} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
          Back to Pricing
        </button>
        <h2 className="text-2xl font-bold mb-4">{productName}</h2>
        <div className="mb-4">
          <p className="text-xl">Total: {total}</p>
        </div>
        <div id={checkoutContainerId}></div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {isInlineCheckoutFailed && (
          <button onClick={openOverlayCheckout} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            Proceed to Checkout
          </button>
        )}
      </div>
      <div className="w-full md:w-1/2">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        <div className="border-t border-b py-4 mb-4">
          <p><strong>{productName}</strong></p>
          <p>Price: {price}</p>
        </div>
        <p className="text-xl font-bold">Total: {total}</p>
      </div>
    </div>
  );
};

export default CheckoutPage;