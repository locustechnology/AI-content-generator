import { NextResponse } from 'next/server';

interface ProductDetails {
  name: string;
  price: string;
  description: string;
}

interface ProductDatabase {
  [key: string]: ProductDetails;
}

const productDatabase: ProductDatabase = {
  'pri_01j6w1gr39da9p41rymadfde5q': {
    name: "Starter Plan",
    price: "$35.00",
    description: "20 high-quality headshots, 2-hour processing time, 5 outfits and backgrounds"
  },
  'pri_01j6wfjbgevsc47sv22ja6qq60': {
    name: "Basic Plan",
    price: "$45.00",
    description: "60 high-quality headshots, 1-hour processing time, 20 outfits and backgrounds"
  },
  'pri_01j6wfs9rsv8xcbgcz9jwtx146': {
    name: "Premium Plan",
    price: "$75.00",
    description: "100 high-quality headshots, 30-min processing time, 40 outfits and backgrounds"
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const priceId = searchParams.get('priceId');

  console.log('Received request for priceId:', priceId);

  if (!priceId || !(priceId in productDatabase)) {
    return NextResponse.json({ error: 'Invalid or missing priceId' }, { status: 400 });
  }

  const productDetails = productDatabase[priceId as keyof typeof productDatabase];

  console.log('Returning product details:', productDetails);

  return NextResponse.json(productDetails);
}