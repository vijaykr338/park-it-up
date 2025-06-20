"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
// import testimonials from "@/components/utils/testimonials";
// import TestimonialCard from "@/components/ui/TestimonialCard";

interface MarqueeProps {
  children: ReactNode;
}

const Marquee: React.FC<MarqueeProps> = ({ children }) => {
  return (
    <div className="container mx-auto overflow-hidden">
      <div className="flex mx-auto">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex flex-shrink-0 gap-8 pl-8"
        >
          {children}
        </motion.div>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex flex-shrink-0 gap-8 pl-8"
        >
          {children}
        </motion.div>
        
      </div>
    </div>
  );
};

export default Marquee;
