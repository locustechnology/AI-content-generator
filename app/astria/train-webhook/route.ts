// File: route.ts (for model training)

import { Database } from "@/app/types/supabase";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// Environment variables
const resendApiKey = process.env.RESEND_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;

// Check for missing environment variables
if (!resendApiKey) {
  console.warn("Missing RESEND_API_KEY. Email notifications will not be sent.");
}

if (!supabaseUrl || !supabaseServiceRoleKey || !appWebhookSecret) {
  throw new Error("Missing required environment variables");
}

export async function POST(request: Request) {
  // Parse the incoming request data
  const incomingData = await request.json() as { tune: any };
  const { tune } = incomingData;

  // Extract query parameters from the URL
  const urlObj = new URL(request.url);
  const user_id = urlObj.searchParams.get("user_id");
  const webhook_secret = urlObj.searchParams.get("webhook_secret");

  // Validate the webhook secret and user ID
  if (webhook_secret?.toLowerCase() !== appWebhookSecret?.toLowerCase() || !user_id) {
    return NextResponse.json({ message: "Unauthorized or missing user ID" }, { status: 401 });
  }

  // Initialize Supabase client
  const supabase = createClient<Database>(
    supabaseUrl!,
    supabaseServiceRoleKey!,
    {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    }
  );

  // Fetch user data from Supabase
  const { data: { user }, error } = await supabase.auth.admin.getUserById(user_id);

  if (error || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Update model status to finished
    const { error: modelUpdatedError } = await supabase
      .from("models")
      .update({ status: "finished" })
      .eq("modelId", tune.id);

    if (modelUpdatedError) throw modelUpdatedError;

    // Fetch user credit balance and plan data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credit_balance, plan_id')
      .eq('id', user_id)
      .single();

    if (userError) throw userError;

    const { data: planData, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', userData?.plan_id)
      .single();

    if (planError) throw planError;

    // Calculate new credit balance after training cost
    const trainingCost = planData?.training_cost ?? 0;
    const newBalance = (userData?.credit_balance ?? 0) - trainingCost;

    if (newBalance < 0) {
      return NextResponse.json({ message: "Insufficient credits for training" }, { status: 400 });
    }

    // Insert new training record
    const { error: mlModelTrainingError } = await supabase
      .from("ml_model_training")
      .insert({
        user_id: user_id,
        name: tune.name,
        type: "custom",
        status: "completed",
        tuneId: tune.id.toString(),
        version: "1.0",
        meta_data: JSON.stringify(tune),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_used_at: new Date().toISOString(),
      });

    if (mlModelTrainingError) throw mlModelTrainingError;

    // Insert credit transaction record
    const { error: transactionError } = await supabase.from("credit_transactions").insert({
      user_id: user_id,
      amount: -trainingCost,
      balance_after: newBalance,
      transaction_type: "usage",
      action_type: "training",
      reference_id: tune.id.toString(),
      created_at: new Date().toISOString(),
    });

    if (transactionError) throw transactionError;

    // Update user's credit balance
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        credit_balance: newBalance,
        last_credit_update: new Date().toISOString(),
      })
      .eq("id", user_id);

    if (userUpdateError) throw userUpdateError;

    // Send email notification
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "noreply@yourdomain.com",
        to: user.email ?? "",
        subject: "Your model was successfully trained!",
        html: `<h2>Your model training was successful! ${trainingCost} credits have been used from your account.</h2>`,
      });
    }

    return NextResponse.json({ message: "success" }, { status: 200, statusText: "Success" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}