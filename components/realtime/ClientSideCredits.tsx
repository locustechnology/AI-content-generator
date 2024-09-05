"use client";

import { Database } from "@/app/types/supabase"; 
import { creditsRow } from "@/app/types/utils"; 
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import Image from 'next/image';

export const revalidate = 0;

type ClientSideCreditsProps = {
  creditsRow: creditsRow | null;
};

export default function ClientSideCredits({
  creditsRow,
}: ClientSideCreditsProps) {

  if (!creditsRow) return (
    <p>Credits: 0</p>
  )

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  const [credits, setCredits] = useState<creditsRow>(creditsRow);

  useEffect(() => {
    const channel = supabase
      .channel("realtime credits")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "credits" },
        (payload: { new: creditsRow }) => {
          setCredits(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, credits, setCredits]);

  if (!credits) return null;

  return (
    <div>
      <Image src="/path/to/image.jpg" alt="Credits" width={100} height={100} />
      <p>Credits: {credits.credits}</p>
    </div>
  );
}
