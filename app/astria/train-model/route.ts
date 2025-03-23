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
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

if (!appWebhookSecret) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!");
}

export async function POST(request: Request) {
  const payload = await request.json();
  const images = payload.urls;
  const type = payload.type;
  const name = payload.name;

  // Hardcoded pack id 260 for corporate headshots from the gallery
  const galleryPackId = Number(process.env.ASTRIA_GALLERY_PACK_ID) || 260;
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!astriaApiKey) {
    throw new Error("Missing API Key: Add your Astria API Key to generate headshots");
  }

  // Validate number of sample images
  if (images?.length < 4) {
    return NextResponse.json({ message: "Upload at least 4 sample images" }, { status: 400 });
  }

  // Fetch user credit balance
  const { data: userCreditBalance, error: userDataError } = await supabase
    .rpc('get_user_credit_balance', { user_id: user.id });

  if (userDataError) {
    console.error({ userDataError });
    return NextResponse.json({ message: "Error checking credits" }, { status: 500 });
  }

  if (typeof userCreditBalance !== 'number') {
    return NextResponse.json({ message: "Error retrieving user credit balance" }, { status: 500 });
  }

  // Calculate required credits: 50 each for 5 prompts
  const requiredCredits = 5 * 50;
  if (userCreditBalance < requiredCredits) {
    return NextResponse.json({ message: `Not enough credits. You need ${requiredCredits} credits, but you have ${userCreditBalance}.` }, { status: 400 });
  }

  try {
    // Prepare webhook URLs
    const trainWebhook = `https://${process.env.VERCEL_URL}/astria/train-webhook`;
    const trainWebhookWithParams = `${trainWebhook}?user_id=${user.id}&webhook_secret=${appWebhookSecret}`;
    const promptWebhook = `https://${process.env.VERCEL_URL}/astria/prompt-webhook`;
    const promptWebhookWithParams = `${promptWebhook}?user_id=${user.id}&webhook_secret=${appWebhookSecret}`;

    const API_KEY = astriaApiKey;
    const DOMAIN = "https://api.astria.ai";

    // Prepare request body for Astria API
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

    // Send request to Astria API to create a new tune
    console.log("ASTRIA_TRAIN_MODEL_REQUEST_BODY:", {
      body: {
        tune: {
          ...body.tune,
          image_urls: body.tune.image_urls.length,
          prompt_attributes: JSON.stringify(body.tune.prompt_attributes, null, 2)
        }
      }
    });

    const response = await axios.post(DOMAIN + `/p/${galleryPackId}/tunes`, body, {
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

    // Save the new model to the database
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
    const { error: samplesError } = await supabase.from("samples").insert(
      images.map((sample: string) => ({
        model_id: modelId,
        uri: sample,
      }))
    );
    if (samplesError) {
      console.error("samplesError: ", samplesError);
      return NextResponse.json(
        {
          message: "Something went wrong!",
        },
        { status: 500 }
      );
    }

    // Define prompts for image generation
    const prompts = [
      "A professional headshot in a business setting",
      "A casual portrait in natural lighting",
      "An artistic black and white portrait",
      "A cheerful outdoor portrait",
      "A dramatic studio portrait with moody lighting"
    ];

    // Generate images for each prompt
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

    // Update user's credit balance using the update_user_credits function
    const { data: updateData, error: updateError } = await supabase
      .rpc('update_user_credits', { 
        user_id: user.id, 
        credit_amount: -requiredCredits 
      });

    if (updateError) {
      console.error("Update Error: ", updateError);
      return NextResponse.json({ message: "Error updating user credits" }, { status: 500 });
    }

    // Insert credit transaction record
    const { error: transactionError } = await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount: -requiredCredits,
      balance_after: userCreditBalance - requiredCredits,
      transaction_type: "usage",
      entity_type: "model_training",
      entity_reference_id: modelId?.toString(),
    });

    if (transactionError) {
      console.error("Transaction Error: ", transactionError);
      return NextResponse.json({ message: "Error recording transaction" }, { status: 500 });
    }

    return NextResponse.json({ message: "success", modelId: modelId }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}