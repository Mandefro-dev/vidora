import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, BarChart3, Play, Check, ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          VIDORA
        </div>
        <div className="space-x-8 hidden md:flex text-slate-400">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#pricing" className="hover:text-white transition">
            Pricing
          </a>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full font-medium transition shadow-lg shadow-indigo-500/20">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium"
          >
            v2.0 is now live 🚀
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight"
          >
            Video Infrastructure <br />
            <span className="text-slate-500">for the Next Generation.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
          >
            Stream high-definition HLS video with built-in domain protection,
            real-time analytics, and a world-class player.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-white text-black px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition">
              Start Building Free <ArrowRight size={20} />
            </button>
            <button className="bg-slate-800 border border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition">
              View Documentation
            </button>
          </motion.div>
        </div>

        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="text-yellow-400" />}
            title="Lightning HLS"
            desc="Automatic adaptive bitrate streaming ensures your videos play smoothly on any connection."
          />
          <FeatureCard
            icon={<Shield className="text-green-400" />}
            title="Domain Locking"
            desc="Prevent unauthorized embedding. Your content only plays where you say it can."
          />
          <FeatureCard
            icon={<BarChart3 className="text-indigo-400" />}
            title="Deep Analytics"
            desc="Track watch time, drop-off rates, and geographic data in real-time."
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Simple, Scalable Pricing
            </h2>
            <p className="text-slate-400">No hidden fees. Scale as you grow.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PriceCard
              tier="Free"
              price="$0"
              features={["5 Videos", "Standard Player", "Basic Analytics"]}
            />
            <PriceCard
              tier="Pro"
              price="$29"
              popular={true}
              features={[
                "Unlimited Videos",
                "Custom Branding",
                "Domain Locking",
                "Priority Support",
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700 hover:border-indigo-500/50 transition group">
    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const PriceCard = ({ tier, price, features, popular }) => (
  <div
    className={`p-10 rounded-3xl border ${popular ? "border-indigo-500 bg-indigo-500/5 relative" : "border-slate-700 bg-slate-800/30"}`}
  >
    {popular && (
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-xs font-bold px-3 py-1 rounded-full">
        MOST POPULAR
      </span>
    )}
    <h3 className="text-2xl font-bold mb-2">{tier}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-bold">{price}</span>
      <span className="text-slate-400">/month</span>
    </div>
    <ul className="space-y-4 mb-8">
      {features.map((f) => (
        <li key={f} className="flex items-center gap-3 text-slate-300">
          <Check size={18} className="text-indigo-400" /> {f}
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-3 rounded-xl font-bold transition ${popular ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-700 hover:bg-slate-600"}`}
    >
      Choose {tier}
    </button>
  </div>
);

export default LandingPage;
