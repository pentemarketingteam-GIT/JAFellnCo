import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Award, MapPin, HeartHandshake } from "lucide-react";
import { FIRM, TEAM, IMAGES, STATS } from "@/data/firm";

const values = [
  { icon: HeartHandshake, title: "Relationship-first", text: "You get a named advisor who knows your name, your numbers and your ambitions." },
  { icon: ShieldCheck, title: "Rigorous & compliant", text: "ICAEW-regulated Chartered Accountants you can trust with the details." },
  { icon: Award, title: "Proactive advice", text: "We spot opportunities and risks early — not twelve months too late." },
  { icon: MapPin, title: "Proudly Southport", text: "Rooted on Hoghton Street, serving the North West and the wider UK." },
];

export default function About() {
  return (
    <div className="pt-28">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">Our story</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-4 leading-tight">
              A modern firm, rooted on <span className="gold-text italic">Hoghton Street</span>
            </h1>
            <p className="text-slate-300 mt-6 leading-relaxed">
              J A Fell &amp; Co is a modern firm of Chartered Accountants, blending traditional values with forward-thinking strategies. Based in Southport in the North West and working with clients across the UK, we focus on simplifying your finances, saving you time and delivering real insight.
            </p>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Our clients juggle multiple roles, so we prioritise efficiency, clarity and growth-focused advice — and we work hand-in-hand with financial advisers who need an accountant that understands their world.
            </p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative rounded-3xl overflow-hidden border border-gold/20">
            <img src={IMAGES.building} alt="Southport office" className="w-full h-[460px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
            <div className="absolute bottom-5 left-5 glass px-4 py-3 rounded-xl">
              <div className="text-xs text-gold/80 uppercase tracking-wider">Head office</div>
              <div className="text-white text-sm font-medium">{FIRM.address}</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 bg-navy-800/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-2xl sm:text-3xl font-semibold gold-text">{s.value}</div>
              <div className="text-sm text-slate-400 mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">What we stand for</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-3">Values that shape every engagement</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 rounded-2xl bg-navy-700/60 border border-gold/15">
                <v.icon size={24} className="text-gold mb-4" />
                <h3 className="font-serif text-lg font-semibold text-white">{v.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy-800/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">Meet the team</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-3">The people behind your numbers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group rounded-2xl overflow-hidden bg-navy-700/60 border border-gold/15 hover:border-gold/40 transition-colors">
                <div className="relative h-72 overflow-hidden">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-white">{m.name}</h3>
                  <p className="text-gold text-sm">{m.role}</p>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{m.specialty}</p>
                  <p className="text-sm text-slate-400 mt-4 leading-relaxed">{m.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
