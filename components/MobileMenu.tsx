"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import NavItems from "./NavItems";
import UserMenu from "./UserMenu";

interface MobileMenuProps {
  user: any;
  credits: number;
}

export default function MobileMenu({ user, credits }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white shadow-md py-2 z-50 overflow-y-auto">
            <div className="flex flex-col space-y-2 px-4">
              <NavItems />
              <UserMenu user={user} credits={credits} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
