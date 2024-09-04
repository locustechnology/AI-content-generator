// pages/index.tsx (or a page component)

// Import client-side components
import PaddlePricingTable from "@/components/stripe/StripeTable";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Mark this component as dynamic to allow both client-side and server-side rendering
export const dynamic = "force-dynamic";

// This component runs on the server and fetches user data
export default async function Index() {
  // Initialize the Supabase client using cookies for session management
  const supabase = createServerComponentClient({ cookies });

  // Fetch the user data from Supabase
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  // If no user is authenticated, redirect to the login page
  if (!user) {
    return redirect("/login");
  }

  // Return the client-side PaddlePricingTable component and pass the user as a prop
  return (
    <div>
      {/* Pass the user prop to the PaddlePricingTable client component */}
      <PaddlePricingTable user={user} />
    </div>
  );
}




// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import StripePricingTable from "@/components/stripe/StripeTable";
// import PaddlePricingTable from "@/components/stripe/StripeTable";

// export const dynamic = "force-dynamic";

// export default async function Index() {
//   const supabase = createServerComponentClient({ cookies });

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return redirect("/login");
//   }

//   return (
//     <PaddlePricingTable user={user} />
//   );
// }


