import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('Webhook handler started');

  try {
    const webhookData = await req.json();
    console.log('Received webhook data:', webhookData);

    const { 
      alert_name, 
      user_id, 
      subscription_plan_id, 
      subscription_id, 
      start_date, 
      end_date, 
      paddleUnitAmount 
    } = webhookData;

    if (alert_name !== 'subscription_created') {
      console.log('Not a subscription_created event, skipping');
      return NextResponse.json({ message: 'Webhook received, but not processed' }, { status: 200 });
    }

    console.log('Creating Supabase client');
    const supabase = createRouteHandlerClient({ cookies });

    console.log('Inserting subscription data');
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        id: subscription_id,
        user_id: user_id,
        plan_id: subscription_plan_id,
        start_date: start_date,
        end_date: end_date,
        is_active: true,
        auto_renew: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        paddle_unit_amount: paddleUnitAmount
      })
      .select();

    if (error) {
      console.error('Error inserting subscription:', error);
      throw error;
    }

    console.log('Subscription inserted successfully:', data);

    console.log('Fetching plan data');
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .select('total_credits')
      .eq('id', subscription_plan_id)
      .single();

    if (planError) {
      console.error('Error fetching plan data:', planError);
      throw planError;
    }

    console.log('Updating user credits');
    const { error: updateError } = await supabase
      .from('user_credits')
      .upsert({
        user_id: user_id,
        credit_balance: planData.total_credits,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (updateError) {
      console.error('Error updating user credits:', updateError);
      throw updateError;
    }

    console.log('User credits updated successfully');

    return NextResponse.json({ message: 'Subscription processed successfully', data }, { status: 200 });
  } catch (error: any) {
    console.error('Error in webhook handler:', error);
    return NextResponse.json({ message: 'Error processing subscription', error: error.message }, { status: 500 });
  }
}