import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json();
    console.log('Received product IDs:', productIds);

    if (!process.env.PADDLE_API_KEY) {
      console.error('PADDLE_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Fetch plans from Supabase
    const { data: plans, error: plansError } = await supabase
      .from('plans')
      .select('*')
      .in('paddle_product_id', productIds);

    if (plansError) {
      console.error('Error fetching plans from Supabase:', plansError);
      return NextResponse.json({ error: 'Failed to fetch plans from database' }, { status: 500 });
    }

    // Fetch prices from Paddle
    const paddlePriceRequests = plans.map(async (plan) => {
      const paddleProductId = plan.paddle_product_id;
      console.log(`Fetching price for product: ${paddleProductId}`);
      try {
        const pricesResponse = await fetch(`https://sandbox-api.paddle.com/prices?product_id=${paddleProductId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (!pricesResponse.ok) {
          const errorBody = await pricesResponse.text();
          console.error(`Error response for ${paddleProductId}:`, errorBody);
          throw new Error(`Failed to fetch prices: ${pricesResponse.status} ${errorBody}`);
        }

        const pricesData = await pricesResponse.json();
        console.log(`Prices data for ${paddleProductId}:`, JSON.stringify(pricesData));

        // Extract the price from the prices data
        const price = pricesData.data[0]; // Assuming the first price is the one we want

        if (!price) {
          throw new Error(`No price found for product ${paddleProductId}`);
        }

        return {
          ...plan,
          price_in_usd: parseFloat(price.unit_price.amount) / 100, // Convert cents to dollars
          currency_code: price.unit_price.currency_code,
          paddle_price_id: price.id
        };
      } catch (error) {
        console.error(`Error fetching data for product ${paddleProductId}:`, error);
        return {
          ...plan,
          price_in_usd: parseFloat(plan.default_price || "0"),
          currency_code: 'USD',
          error: `Failed to fetch price: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    });

    const plansWithPrices = await Promise.all(paddlePriceRequests);

    return NextResponse.json(plansWithPrices);
  } catch (error) {
    console.error('Error in paddle-prices API route:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}