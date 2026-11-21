'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { NAV_LINKS } from "@/constants";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setIsMobileMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <div className="w-full h-[65px] fixed top-0 bg-transparent z-50">
      {/* Navbar Container */}
      <div className="w-full h-full flex items-center justify-between mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Logo + Name */}
        <Link
          href="#home"
          className="flex items-center"
        >
          <Image
            src="/nottam-logo.jpeg"
            alt="Nottam InfoTech logo"
            width={48}
            height={48}
            draggable={false}
            className="cursor-pointer"
          />
          <div className="whitespace-nowrap text-sm sm:text-base font-semibold ml-[10px] text-gray-300">Nottam InfoTech</div>
        </Link>

        {/* Web Navbar */}
        <div className="hidden md:flex w-[500px] h-full flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full h-auto bg-transparent px-[20px] py-[10px] text-gray-200">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                className="cursor-pointer hover:text-[rgb(255,217,128)] transition"
              >
                {link.title}
              </Link>
            ))}

            {/* BookYourTurf */}
            <Link
              href="https://bookyourturf.net/"
              target="_blank"
              rel="noreferrer noopener"
              className="cursor-pointer hover:text-[rgb(255,217,128)] transition"
            >
              BookYourTurf
            </Link>
          </div>
        </div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-white rounded p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5bc60] text-4xl"
          aria-label="Navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-controls="mobile-navigation"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-navigation" className="absolute top-[65px] left-0 w-full bg-transparent p-5 flex flex-col items-center text-gray-300 md:hidden">
          {/* Links */}
          <div className="flex flex-col items-center gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                className="cursor-pointer hover:text-[rgb(255,217,128)] transition text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            <Link
              href="https://bookyourturf.net/"
              target="_blank"
              rel="noreferrer noopener"
              className="cursor-pointer hover:text-[rgb(255,217,128)] transition text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              BookYourTurf
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};
