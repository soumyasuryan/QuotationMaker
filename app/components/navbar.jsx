"use client";
import { useState } from "react";
import Image from "next/image";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-black text-white w-full p-4">
      <div className="flex justify-between items-center">
        
        {/* Logo */}
        <Image
          src="/web-logo.png"
          alt="Logo"
          width={80}
          height={80}
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 items-center">
          <li className="hover:underline text-lg cursor-pointer">Home</li>
          <li className="hover:underline text-lg cursor-pointer">About</li>
          <li className="hover:underline text-lg cursor-pointer">Contact</li>
        </ul>

        {/* Hamburger (Mobile Only) */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Image
            src="hamburger.svg"   // <-- your SVG in public/
            alt="Menu"
            width={32}
            height={32}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="md:hidden mt-4 flex flex-col gap-4 text-center">
          <li className="hover:underline text-lg">Home</li>
          <li className="hover:underline text-lg">About</li>
          <li className="hover:underline text-lg">Contact</li>
        </ul>
      )}
    </div>
  );
}
