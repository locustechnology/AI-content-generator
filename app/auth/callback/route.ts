import { Database } from "@/app/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { isAuthApiError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const next = requestUrl.searchParams.get("next") || "/";
  const error_description = requestUrl.searchParams.get("error_description");

  if (error) {
    console.log("error: ", { error, error_description, code });
  }

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    try {
      const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) throw exchangeError;

      if (!session) {
        console.error("[login] [session] [500] No session after code exchange");
        return NextResponse.redirect(`${requestUrl.origin}/login/failed?err=NoSession`);
      }

      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("[login] [session] [500] Error getting user: ", userError);
        return NextResponse.redirect(`${requestUrl.origin}/login/failed?err=500`);
      }

      // Save user data to Supabase
      const { error: insertError } = await supabase
        .from('users')
        .upsert({
          id: user.user.id,
          email: user.user.email,
          last_sign_in: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (insertError) {
        console.error("[login] [database] [500] Error saving user data: ", insertError);
      }

      console.log("Code exchanged for session successfully");
      console.log("User data:", user);
      console.log("Session data:", session);

      // Set a cookie with the session token
      cookies().set('sb-access-token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    } catch (error) {
      if (isAuthApiError(error)) {
        console.error("[login] [session] [500] Error exchanging code for session: ", error);
        return NextResponse.redirect(`${requestUrl.origin}/login/failed?err=AuthApiError`);
      } else {
        console.error("[login] [session] [500] Something wrong: ", error);
        return NextResponse.redirect(`${requestUrl.origin}/login/failed?err=500`);
      }
    }
  }

  return NextResponse.redirect(new URL(next, req.url));
}