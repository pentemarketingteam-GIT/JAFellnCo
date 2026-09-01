import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Phone, ShieldCheck, Star, Quote } from "lucide-react";
import { FIRM, SERVICES, IMAGES, STATS, TESTIMONIALS } from "@/data/firm";
import ServiceIcon from "@/components/ServiceIcon";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16">
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.hero} alt="J A Fell & Co office" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/95 to-navy-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div initial="hidden" animate="show" variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-6">
              <ShieldCheck size={14} className="text-gold" />
              <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">Chartered · Est. {FIRM.established} · Southport</span>
            </motion.div>

            <motion.h1 initial="hidden" animate="show" custom={1} variants={fadeUp} className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Accountancy that helps your business <span className="gold-text italic">grow with confidence</span>
            </motion.h1>

            <motion.p initial="hidden" animate="show" custom={2} variants={fadeUp} className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              From cloud accounting and proactive tax planning to hands-on business advisory, we partner with ambitious businesses and financial advisers across {FIRM.areas}.
            </motion.p>

            <motion.div initial="hidden" animate="show" custom={3} variants={fadeUp} className="mt-9 flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate("/ai")} data-testid="hero-launch-ai" className="gold-btn px-7 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 group">
                <Sparkles size={18} /> Talk to our AI Advisor
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href={FIRM.phoneHref} data-testid="hero-call" className="px-7 py-3.5 rounded-full font-semibold border border-gold/40 text-white hover:bg-gold/10 transition-colors flex items-center justify-center gap-2">
                <Phone size={18} className="text-gold" /> {FIRM.phone}
              </a>
            </motion.div>

            <motion.div initial="hidden" animate="show" custom={4} variants={fadeUp} className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-mono text-2xl sm:text-3xl font-semibold gold-text">{s.value}</div>
                  <div className="text-xs text-slate-400 mt-1 leading-snug">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">What we do</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-3">A complete finance function, on tap</h2>
            <p className="text-slate-400 mt-4">Six core services, one dedicated team. Choose what you need today — scale up when you're ready.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                variants={fadeUp}
                data-testid={`home-service-${s.id}`}
                className="group relative p-7 rounded-2xl bg-navy-700/70 border border-gold/15 hover:border-gold/50 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  <ServiceIcon name={s.icon} size={22} className="text-gold" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-white">{s.title}</h3>
                <p className="text-sm text-gold/70 mt-1 mb-3">{s.tagline}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{s.summary}</p>
                <Link to="/services" className="mt-5 inline-flex items-center gap-1.5 text-sm text-gold font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="relative py-24 bg-navy-800/50 grain">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <div className="relative rounded-3xl overflow-hidden border border-gold/20">
              <img src={IMAGES.analysis} alt="Financial analysis" className="w-full h-[440px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={1} variants={fadeUp}>
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">Why J A Fell &amp; Co</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-3">Local roots. National reach. Personal service.</h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              For over four decades we've been the trusted finance partner for Southport's businesses — and today we support clients right across the UK. You get a named advisor who knows your numbers and your ambitions.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "ICAEW-regulated Chartered Accountants",
                "Fixed, transparent fees — no surprises",
                "Cloud-first, so you see your numbers in real time",
                "Proactive advice, not just year-end compliance",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-slate-200">
                  <ShieldCheck size={18} className="text-gold mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">Client stories</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-3">Trusted by businesses that don't stand still</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} variants={fadeUp} className="p-7 rounded-2xl bg-navy-700/60 border border-gold/15">
                <Quote size={28} className="text-gold/40 mb-4" />
                <p className="text-slate-200 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-1 mt-5 text-gold">
                  {[...Array(5)].map((_, k) => <Star key={k} size={14} fill="currentColor" />)}
                </div>
                <div className="mt-3 text-sm"><span className="text-white font-medium">{t.author}</span><span className="text-slate-500"> · {t.company}</span></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-gold/30 glass p-10 sm:p-14 text-center">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white relative">Ready to talk numbers?</h2>
            <p className="text-slate-300 mt-4 max-w-xl mx-auto relative">Chat with our AI advisor for instant answers and an indicative quote, or book a free consultation at our Southport office.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center relative">
              <button onClick={() => navigate("/ai")} className="gold-btn px-7 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2">
                <Sparkles size={18} /> Launch AI Advisor
              </button>
              <Link to="/contact" className="px-7 py-3.5 rounded-full font-semibold border border-gold/40 text-white hover:bg-gold/10 transition-colors">Book a consultation</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
