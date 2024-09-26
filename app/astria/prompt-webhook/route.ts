// File: route.ts (for image generation)

import { Database } from "@/app/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Environment variables
const astriaApiKey = process.env.ASTRIA_API_KEY;
const astriaTestModeIsOn = process.env.ASTRIA_TEST_MODE === "true";
const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;

if (!appWebhookSecret) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!");
}

if (!astriaApiKey) {
  throw new Error("Missing API Key: Add your Astria API Key to generate headshots");
}

export async function POST(request: Request) {
  // Initialize Supabase client
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Authenticate user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Parse request payload
  const payload = await request.json();
  const { urls: images, type, name } = payload;

  // Validate number of sample images
  if (images?.length < 4) {
    return NextResponse.json({ message: "Upload at least 4 sample images" }, { status: 400 });
  }

  // Check user credits
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('credit_balance')
    .eq('id', user.id)
    .single();

  if (userError) {
    console.error({ userError });
    return NextResponse.json({ message: "Error checking credits" }, { status: 500 });
  }

  if (!userData || typeof userData.credit_balance !== 'number') {
    return NextResponse.json({ message: "Error retrieving user credit balance" }, { status: 500 });
  }

  // Calculate required credits: 50 each for 5 prompts
  const requiredCredits = 5 * 50;
  if (userData.credit_balance < requiredCredits) {
    return NextResponse.json({ message: `Not enough credits. You need ${requiredCredits} credits.` }, { status: 400 });
  }

  try {
    // Existing functionality: Prepare webhook URLs
    const trainWebhook = `https://${process.env.VERCEL_URL}/astria/train-webhook`;
    const trainWebhookWithParams = `${trainWebhook}?user_id=${user.id}&webhook_secret=${appWebhookSecret}`;
    const promptWebhook = `https://${process.env.VERCEL_URL}/astria/prompt-webhook`;
    const promptWebhookWithParams = `${promptWebhook}?user_id=${user.id}&webhook_secret=${appWebhookSecret}`;

    const API_KEY = astriaApiKey;
    const DOMAIN = "https://api.astria.ai";

    // Existing functionality: Prepare request body for Astria API
    const body = {
      tune: {
        title: name,
        name: type,
        callback: trainWebhookWithParams,
        prompt_attributes: {
          callback: promptWebhookWithParams
        },
        image_urls: images,
        branch: astriaTestModeIsOn ? "fast" : "sd15",
      },
    };

    // Existing functionality: Send request to Astria API to create a new tune
    const response = await axios.post(DOMAIN + `/p/260/tunes`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const { status, data: tune } = response;

    // Handle potential errors from Astria API
    if (status !== 201) {
      if (status === 400) {
        return NextResponse.json({ message: "webhookUrl must be a URL address" }, { status: 400 });
      }
      if (status === 402) {
        return NextResponse.json({ message: "Training models is only available on paid plans." }, { status: 402 });
      }
      return NextResponse.json({ message: "Error creating model" }, { status });
    }

    // Existing functionality: Save the new model to the database
    const { error: modelError, data: modelData } = await supabase
      .from("models")
      .insert({
        modelId: tune.id,
        user_id: user.id,
        name,
        type,
      })
      .select("id")
      .single();

    if (modelError) {
      console.error("modelError: ", modelError);
      return NextResponse.json({ message: "Error saving model" }, { status: 500 });
    }

    const modelId = modelData?.id;

    // Existing functionality: Define prompts for image generation
    const prompts = [
      "A professional headshot in a business setting",
      "A casual portrait in natural lighting",
      "An artistic black and white portrait",
      "A cheerful outdoor portrait",
      "A dramatic studio portrait with moody lighting"
    ];

    // Existing functionality: Generate images for each prompt
    for (const prompt of prompts) {
      const promptBody = {
        tune_id: tune.id,
        prompt,
        negative_prompt: "Blurry, low quality, distorted features",
        num_images: 4,
        callback: promptWebhookWithParams
      };

      const promptResponse = await axios.post(DOMAIN + "/api/v2/prompts", promptBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (promptResponse.status !== 201) {
        console.error(`Error generating prompt: ${promptResponse.statusText}`);
      }
    }

    // Calculate new balance
    const newBalance = userData.credit_balance - requiredCredits;

    // Insert credit transaction record
    await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount: -requiredCredits,
      balance_after: newBalance,
      transaction_type: "usage",
      action_type: "image_generation",
      reference_id: modelId?.toString(),
      created_at: new Date().toISOString(),
    });

    // Update user's credit balance
    await supabase
      .from("users")
      .update({
        credit_balance: newBalance,
        last_credit_update: new Date().toISOString(),
      })
      .eq("id", user.id);

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}