"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { slideInFromTop } from "@/lib/motion";

export const Encryption = () => {
  return (
    <div id="about-me" className="relative isolate flex w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[#100c08] px-5 py-14 text-center sm:gap-8 sm:py-20">
      <div className="relative max-w-3xl">
        <motion.h2
          variants={slideInFromTop}
          className="text-balance text-3xl font-medium leading-[1.17] text-gray-200 sm:text-[40px]"
        >
          {" "}
          <span className="text-transparent bg-clip-text brand-gold">
            BookYourTurf
          </span>{" "}
          <span className="block">with Nottam InfoTech.</span>
        </motion.h2>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 relative">
        <div className="flex flex-col items-center group cursor-pointer w-auto h-auto">
          <Image
            src="/nottam-logo.jpeg"
            alt="Nottam InfoTech crest"
            width={140}
            height={140}
            className="transition-transform duration-200 group-hover:-translate-y-1"
          />
        </div>

        <div className="Welcome-box px-[15px] py-[4px] z-[20] border border-[#d2a04d80] opacity-[0.9]">
          <span className="Welcome-text text-[12px]">About Nottam InfoTech</span>
        </div>
      </div>

      <div className="relative w-full max-w-[38rem]">
        <p className="text-pretty text-lg leading-[1.8] text-stone-100 sm:text-xl sm:leading-[1.75]">
          Nottam InfoTech owns and operates{" "}
          <a
            href="https://bookyourturf.net/"
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-4"
          >
            BookYourTurf
          </a>
          , a digital platform for turf management and player bookings, with
          real-time availability, payments, and booking automation.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-50">
        <video
          loop
          muted
          autoPlay
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        >
          <source src="/videos/encryption-bg.webm" type="video/webm" />
        </video>
      </div>
    </div>
  );
};
