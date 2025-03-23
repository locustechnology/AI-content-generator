'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import ClientPricingSection from '../PricingSection';
import { Database } from "@/app/types/supabase";

interface Plan {
  id: string;
  name: string;
  description: string;
  total_credits: number;
  max_trainings: number;
  max_generations: number;
  max_edits: number;
  paddle_product_id: string;
  paddle_price_id: string;
  duration: number | null;
  billing_cycle: string;
  is_active: boolean;
  meta_data: string;
  price_in_usd: number;
}

const PaddlePricing: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error(`Failed to fetch user session: ${sessionError.message}`);
          throw sessionError;
        }

        // Log and set the user session
        console.log('Initial user session:', session);
        if (session && session.user) {
          setUser(session.user);
        } else {
          console.warn('No active session found. User is not authenticated.');
          // You might want to redirect to login page here
          // window.location.href = '/login';
          return;
        }

        // Fetch plans from Supabase
        const { data: plansData, error: plansError } = await supabase
          .from('plans')
          .select('*')
          .eq('is_active', true);

        if (plansError) {
          throw new Error(`Failed to fetch plans from Supabase: ${plansError.message}`);
        }

        if (!plansData || plansData.length === 0) {
          throw new Error('No active plans found in Supabase');
        }

        // Fetch Paddle prices
        const response = await fetch('/api/paddle-prices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productIds: plansData.map(plan => plan.paddle_product_id) }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Paddle prices: ${response.statusText}`);
        }

        const paddlePrices = await response.json();

        // Map Paddle prices to plans
        const plansWithPrices: Plan[] = plansData.map(plan => {
          const paddlePrice = paddlePrices.find((price: any) => price.paddle_product_id === plan.paddle_product_id);
          return {
            ...plan,
            price_in_usd: paddlePrice ? paddlePrice.price_in_usd : 0,
            paddle_price_id: paddlePrice ? paddlePrice.paddle_price_id : '',
          };
        });

        setPlans(plansWithPrices);
        console.log('Fetched plans with prices:', plansWithPrices);

      } catch (err: any) {
        console.error('Error in fetchData:', err);
        setError(`Error loading pricing data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Handle auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed. Current user session:', session);
      if (session && session.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <ClientPricingSection initialPlans={plans} initialUser={user} />
  );
};

export default PaddlePricing;