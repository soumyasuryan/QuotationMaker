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
        className="sm:ml-5"
          src="/web-logo.png"
          alt="Logo"
          width={80}
          height={80}
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 items-center sm:mr-10">
          <a className="hover:underline text-lg cursor-pointer" href="/">Home</a>
          <a className="hover:underline text-lg cursor-pointer" href="/about">About</a>
          <a className="hover:underline text-lg cursor-pointer" href="contact/">Contact</a>
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
          <a className="hover:underline text-lg">Home</a>
          <a className="hover:underline text-lg">About</a>
          <a className="hover:underline text-lg">Contact</a>
        </ul>
      )}
    </div>
  );
}
