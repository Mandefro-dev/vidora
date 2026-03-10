import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlayCircle } from "react-icons/fi";

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Version Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card px-4 py-2 mb-8 text-indigo-400 text-sm font-semibold flex items-center gap-2 cursor-pointer hover:bg-slate-800/60 transition"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        Vidora v1.0 is Live
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
      >
        Video Infrastructure <br />
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          for the Next Generation.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10"
      >
        Upload once. Stream anywhere. Vidora provides lightning-fast HLS
        encoding, global CDN delivery, and enterprise-grade domain locking.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition transform hover:scale-105">
          Start Building Free <FiArrowRight />
        </button>
        <button className="glass-card px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800/80 transition">
          <FiPlayCircle /> View Demo
        </button>
      </motion.div>
    </div>
  );
};

export default Hero;
