import Link from "next/link";
import { Button } from "./ui/button";
import React from "react";

export default function Navbar() {
  return (
    <div className="flex w-full px-4 lg:px-40 py-4 items-center border-b text-center gap-8 justify-between">
      <div className="flex gap-2 h-full">
        <Link href="/">
          <h2 className="font-bold">Headshots AI</h2>
        </Link>
      </div>
      <div>
        <Link href="/login">
          <Button variant={"ghost"}>Login / Signup</Button>
        </Link>
      </div>
    </div>
  );
}
