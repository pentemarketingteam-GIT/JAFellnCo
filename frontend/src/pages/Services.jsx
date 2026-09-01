import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { SERVICES, IMAGES } from "@/data/firm";
import ServiceIcon from "@/components/ServiceIcon";

export default function Services() {
  const navigate = useNavigate();
  return (
    <div className="pt-28">
      <section className="relative py-16">
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.desk} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 to-navy-900" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">Our services</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 leading-tight">
            Everything you need, from <span className="gold-text italic">first invoice to exit</span>
          </h1>
          <p className="text-slate-300 mt-6 text-lg">Modern, cloud-first accountancy delivered by a Chartered team that genuinely cares about your growth.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              data-testid={`service-detail-${s.id}`}
              className="grid md:grid-cols-12 gap-8 p-8 rounded-2xl bg-navy-700/60 border border-gold/15 hover:border-gold/40 transition-colors"
            >
              <div className="md:col-span-4">
                <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-5">
                  <ServiceIcon name={s.icon} size={26} className="text-gold" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-white">{s.title}</h2>
                <p className="text-gold/70 text-sm mt-1">{s.tagline}</p>
                <p className="text-slate-400 text-sm mt-4 leading-relaxed">{s.summary}</p>
                <p className="text-xs text-slate-500 mt-4 italic">Ideal for: {s.ideal}</p>
              </div>
              <div className="md:col-span-8 md:border-l md:border-gold/15 md:pl-8">
                <h3 className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium mb-4">What's included</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {s.features.map((f) => (
                    <div key={f} className="flex items-start gap-3 text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center mt-0.5 shrink-0">
                        <Check size={12} className="text-gold" />
                      </span>
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 mt-14 text-center">
          <button onClick={() => navigate("/ai")} className="gold-btn px-7 py-3.5 rounded-full font-semibold inline-flex items-center gap-2">
            <Sparkles size={18} /> Ask the AI Advisor which service fits <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
