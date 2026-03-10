import React from "react";
import { FiZap, FiShield, FiBarChart2 } from "react-icons/fi";
import { motion } from "framer-motion";

const FeaturesBento = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Everything you need to scale.
        </h2>
        <p className="text-slate-400">
          Powerful APIs and intuitive dashboards.
        </p>
      </div>

      {/* CSS Grid for the Bento Box look */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        {/* Card 1: Spans 2 columns on desktop */}
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-8 md:col-span-2 flex flex-col justify-between group overflow-hidden relative"
        >
          <div className="absolute -right-10 -top-10 text-indigo-500/10 group-hover:text-indigo-500/20 transition duration-500">
            <FiZap size={200} />
          </div>
          <div>
            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <FiZap size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Lightning Fast HLS</h3>
            <p className="text-slate-400 max-w-sm">
              We automatically transcode your MP4s into adaptive bitrate streams
              so your users never see a loading spinner.
            </p>
          </div>
        </motion.div>

        {/* Card 2: Single column */}
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-8 flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <FiShield size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Domain Locking</h3>
            <p className="text-slate-400">
              Lock your videos to specific URLs. Thieves can't embed your
              content elsewhere.
            </p>
          </div>
        </motion.div>

        {/* Card 3: Spans all 3 columns */}
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-8 md:col-span-3 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="max-w-xl mb-6 md:mb-0">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <FiBarChart2 size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Real-Time Telemetry</h3>
            <p className="text-slate-400">
              Track watch time, drop-off rates, and device metrics instantly
              inside your creator dashboard.
            </p>
          </div>
          {/* A fake UI element for visual flair */}
          <div className="w-full md:w-1/3 h-32 rounded-xl bg-slate-900 border border-slate-700 p-4 flex items-end gap-2">
            {[40, 70, 45, 90, 65, 100, 80].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-indigo-500 rounded-t-md opacity-80"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesBento;
