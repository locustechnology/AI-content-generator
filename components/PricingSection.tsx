'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Script from 'next/script';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from "@/app/types/supabase";

interface Plan {
  id: string;
  name: string;
  price_in_usd: number;
  total_credits: number;
  max_trainings: number;
  max_generations: number;
  max_edits: number;
  paddle_product_id: string;
  paddle_price_id: string;
}

interface ClientPricingSectionProps {
  initialPlans: Plan[];
  initialUser: User | null;
}

declare global {
  interface Window {
    Paddle: any;
  }
}

const ClientPricingSection: React.FC<ClientPricingSectionProps> = ({ initialPlans, initialUser }) => {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentPriceId, setCurrentPriceId] = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const handleCheckout = async (plan: Plan) => {
    console.log('Attempting checkout for plan:', plan);

    if (!user) {
      setError('Please log in to make a purchase.');
      return;
    }

    if (window.Paddle && paddleLoaded) {
      setCurrentPriceId(plan.paddle_price_id);
      setIsCheckoutOpen(true);
    } else {
      setError('Payment system is not ready. Please try again later.');
    }
  };

  useEffect(() => {
    if (isCheckoutOpen) {
      openCheckout();
    }
  }, [isCheckoutOpen]);

  const openCheckout = () => {
    if (!currentPriceId || !user) return;

    try {
      window.Paddle.Checkout.open({
        settings: {
          displayMode: 'overlay',
          theme: 'light',
        },
        items: [{ priceId: currentPriceId, quantity: 1 }],
        customer: { email: user.email },
        successCallback: handleSuccessfulPurchase,
        closeCallback: handleCloseCheckout,
      });
    } catch (error: any) {
      setError(`Failed to open checkout: ${error.message || 'Unknown error'}`);
      setIsCheckoutOpen(false);
    }
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setCurrentPriceId(null);
  };

  const handleSuccessfulPurchase = async (data: any) => {
    try {
      console.log('Successful purchase data:', data);
      const webhookData = {
        alert_name: 'subscription_created',
        user_id: user?.id,
        subscription_plan_id: data.product.id,
        subscription_id: data.subscription.id,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        paddleUnitAmount: data.checkout.total,
      };
      console.log('Sending webhook data:', webhookData);
      
      const response = await fetch('/astria/paddle-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
      });
  
      console.log('Webhook response status:', response.status);
      const responseData = await response.json();
      console.log('Webhook response data:', responseData);
  
      if (!response.ok) {
        throw new Error(`Failed to process subscription: ${responseData.message}`);
      }
  
      console.log('Subscription processed:', responseData);
  
      handleCloseCheckout();
      router.push('/overview/models/train?step=image-upload');
    } catch (error: any) {
      console.error('Error processing subscription:', error);
      setError('Failed to process subscription. Please contact support.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.Paddle.Environment.set('sandbox');
          window.Paddle.Setup({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN as string,
            eventCallback: function(data: any) {
              console.log('Paddle event:', data);
            }
          });
          setPaddleLoaded(true);
        }}
        onError={(e) => {
          setError('Failed to load payment system. Please try again later.');
        }}
      />
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
        {plans?.map((plan) => (
            <div key={plan.id} className="border rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4">${plan.price_in_usd.toFixed(2)}</p>
              <ul className="text-left mb-6">
                <li>✅ {plan.total_credits} total credits</li>
                <li>✅ {plan.max_trainings} training sessions</li>
                <li>✅ {plan.max_generations} generations</li>
                <li>✅ {plan.max_edits} edits</li>
              </ul>
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => handleCheckout(plan)} 
                disabled={!user || !paddleLoaded}
              >
                {user ? `Choose ${plan.name}` : 'Log in to Purchase'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientPricingSection;