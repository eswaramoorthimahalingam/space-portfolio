"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const SkillText = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center">
      <motion.div
        variants={slideInFromTop}
        className="Welcome-box py-[8px] px-[7px] border border-[#d2a04d80] opacity-[0.9]"
      >
        <SparklesIcon className="text-[#f5d47d] mr-[10px] h-5 w-5" />
        <p className="Welcome-text text-[13px]">
          Nottam InfoTech capabilities
        </p>
      </motion.div>

      <motion.h2
        variants={slideInFromLeft(0.5)}
        className="text-[30px] text-white font-medium mt-[10px] text-center mb-[15px]"
      >
        Practical technology for everyday business.
      </motion.h2>

      <motion.div
        variants={slideInFromRight(0.5)}
        className="max-w-2xl px-5 text-lg leading-relaxed text-gray-200 mb-10 mt-[10px] text-center"
      >
        From web development to the systems behind it, we help turn business
        needs into reliable digital tools.
      </motion.div>
    </div>
  );
};
