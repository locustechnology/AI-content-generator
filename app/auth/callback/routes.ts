import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  console.log("Request URL:", request.url);  // Debugging log
  console.log("Extracted next parameter:", next);  // Debugging log
  console.log("Token Hash:", token_hash);  // Debugging log
  console.log("Type:", type);  // Debugging log

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      console.log("OTP verified successfully. Redirecting to:", next);  // Debugging log
      redirect(next);
      return;  // Ensure to stop further execution
    } else {
      console.log("OTP verification failed:", error.message);  // Debugging log
    }
  }

  console.log("Redirecting to error page.");  // Debugging log
  redirect('/error');
}
