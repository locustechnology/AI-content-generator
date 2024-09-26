// File: subscription-and-credit-management.ts

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

// Function to handle user subscription
export async function handleSubscription(req: Request) {
  const { userId, planId, paddleSubscriptionId } = await req.json()

  if (!userId || !planId || !paddleSubscriptionId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError) throw planError

    // Start a Supabase transaction
    const { data, error } = await supabase.rpc('handle_subscription', {
      p_user_id: userId,
      p_plan_id: planId,
      p_paddle_subscription_id: paddleSubscriptionId,
      p_total_credits: plan.total_credits
    })

    if (error) throw error

    // Insert into users table
    await supabase.from('users').upsert({
      id: userId,
      credit_balance: plan.total_credits,
      last_credit_update: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // Insert into user_subscriptions table
    await supabase.from('user_subscriptions').insert({
      user_id: userId,
      plan_id: planId,
      start_date: new Date().toISOString(),
      is_active: true,
      auto_renew: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // Insert into credit_transactions table
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: plan.total_credits,
      balance_after: plan.total_credits,
      transaction_type: 'purchase',
      action_type: 'subscription',
      reference_id: paddleSubscriptionId,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ message: 'Subscription processed successfully', data })
  } catch (error: any) {
    console.error('Error processing subscription:', error)
    return NextResponse.json({ message: 'Error processing subscription', error: error.message }, { status: 500 })
  }
}

// Function to handle model training
export async function handleModelTraining(req: Request) {
  const { userId, modelName, tuneId, trainingCost } = await req.json()

  try {
    // Update user's credit balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credit_balance')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    const newBalance = userData.credit_balance - trainingCost

    if (newBalance < 0) {
      return NextResponse.json({ message: 'Insufficient credits for training' }, { status: 400 })
    }

    // Update user's credit balance
    await supabase
      .from('users')
      .update({
        credit_balance: newBalance,
        last_credit_update: new Date().toISOString()
      })
      .eq('id', userId)

    // Insert into ml_model_training table
    await supabase.from('ml_model_training').insert({
      user_id: userId,
      name: modelName,
      type: 'custom',
      status: 'completed',
      tuneId: tuneId,
      version: '1.0',
      meta_data: JSON.stringify({}),  // Add relevant meta data
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_used_at: new Date().toISOString()
    })

    // Insert into credit_transactions table
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -trainingCost,
      balance_after: newBalance,
      transaction_type: 'usage',
      action_type: 'training',
      reference_id: tuneId,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ message: 'Model training processed successfully' })
  } catch (error: any) {
    console.error('Error processing model training:', error)
    return NextResponse.json({ message: 'Error processing model training', error: error.message }, { status: 500 })
  }
}

// Function to handle image generation
export async function handleImageGeneration(req: Request) {
  const { userId, modelId, prompts, creditsPerPrompt } = await req.json()

  try {
    // Calculate total credits needed
    const totalCredits = prompts.length * creditsPerPrompt

    // Update user's credit balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credit_balance')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    const newBalance = userData.credit_balance - totalCredits

    if (newBalance < 0) {
      return NextResponse.json({ message: 'Insufficient credits for image generation' }, { status: 400 })
    }

    // Update user's credit balance
    await supabase
      .from('users')
      .update({
        credit_balance: newBalance,
        last_credit_update: new Date().toISOString()
      })
      .eq('id', userId)

    // Generate images for each prompt
    for (const prompt of prompts) {
      // Here you would call your image generation API
      // For this example, we'll assume it returns a URI
      const imageUri = 'https://example.com/generated-image.jpg'

      // Insert into images table
      await supabase.from('images').insert({
        user_id: userId,
        model_id: modelId,
        prompt: prompt,
        uri: imageUri,
        type: 'generated',
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Insert into credit_transactions table
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -totalCredits,
      balance_after: newBalance,
      transaction_type: 'usage',
      action_type: 'image_generation',
      reference_id: modelId,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ message: 'Image generation processed successfully' })
  } catch (error: any) {
    console.error('Error processing image generation:', error)
    return NextResponse.json({ message: 'Error processing image generation', error: error.message }, { status: 500 })
  }
}

// Example usage in your route handlers:
export async function POST(request: Request) {
  const { action } = await request.json()

  switch (action) {
    case 'subscribe':
      return handleSubscription(request)
    case 'train':
      return handleModelTraining(request)
    case 'generate':
      return handleImageGeneration(request)
    default:
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
  }
}