"use client";

import { motion } from "framer-motion";
import { HeroCrest } from "./hero-crest";

import {
  slideInFromLeft,
  slideInFromRight,
} from "@/lib/motion";

export const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pb-8 pt-[calc(65px+2rem)] sm:px-8 md:min-h-[100svh] md:grid-cols-[1.2fr_1fr] md:gap-12 md:pb-12 md:pt-[calc(65px+3rem)] lg:px-12"
    >
      <div className="flex min-w-0 flex-col gap-5 lg:gap-6 text-start">
        <div aria-hidden="true" className="h-[38px]" />

        <motion.h1
          variants={slideInFromLeft(0.5)}
          className="text-balance max-w-[19ch] text-[clamp(2.4rem,4.7vw,4rem)] font-medium leading-[1.06] tracking-tight text-white"
        >
          <span>
            Products and software for{" "}
            <span className="text-transparent bg-clip-text brand-gold">
              your business.
            </span>
          </span>
        </motion.h1>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="max-w-[48ch] text-pretty text-base leading-relaxed text-gray-300 sm:text-lg"
        >
          We create our own digital products, including BookYourTurf, and build
          websites and custom software for growing businesses.
        </motion.p>

        <motion.a
          href="#projects"
          variants={slideInFromLeft(1)}
          className="py-2 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px]"
        >
          Explore our product
        </motion.a>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="flex min-w-0 justify-center"
      >
        <HeroCrest />
      </motion.div>
    </motion.div>
  );
};
