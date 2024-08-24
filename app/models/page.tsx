"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaImages } from "react-icons/fa";

export const revalidate = 0;

export default function ClientSideModelsList() {
  return (
    <div id="train-model-container" className="w-full flex flex-col gap-4 items-center">
      <FaImages size={64} className="text-gray-500" />
      <h1 className="text-2xl">Get started by training your first model.</h1>
      <div>
        <Link href="/overview/models/train">
          <Button size={"lg"}>Train model</Button>
        </Link>
      </div>
    </div>
  );
}
