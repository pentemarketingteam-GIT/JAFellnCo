import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Phone, ShieldCheck, Check, CalendarCheck } from "lucide-react";
import { FIRM, SERVICES, IMAGES, STATS, WHO_WE_WORK_WITH, HOW_IT_WORKS } from "@/data/firm";
import ServiceIcon from "@/components/ServiceIcon";
import FeeEstimator from "@/components/FeeEstimator";

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
              <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">Chartered Accountants · Southport · UK-wide</span>
            </motion.div>

            <motion.h1 initial="hidden" animate="show" custom={1} variants={fadeUp} className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Clear. Proactive. <span className="gold-text italic">Advice.</span>
            </motion.h1>

            <motion.p initial="hidden" animate="show" custom={2} variants={fadeUp} className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              {FIRM.proposition} We're a modern firm of Chartered Accountants working with growing businesses and financial advisers across {FIRM.areas}.
            </motion.p>

            <motion.div initial="hidden" animate="show" custom={3} variants={fadeUp} className="mt-9 flex flex-col sm:flex-row gap-4">
              <a href={FIRM.booking} target="_blank" rel="noopener noreferrer" data-testid="hero-book-call" className="gold-btn px-7 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 group">
                <CalendarCheck size={18} /> Book a discovery call
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button onClick={() => navigate("/ai")} data-testid="hero-launch-ai" className="px-7 py-3.5 rounded-full font-semibold border border-gold/40 text-white hover:bg-gold/10 transition-colors flex items-center justify-center gap-2">
                <Sparkles size={18} className="text-gold" /> Talk to our AI Advisor
              </button>
            </motion.div>

            <motion.a href={FIRM.phoneHref} initial="hidden" animate="show" custom={3} variants={fadeUp} data-testid="hero-call" className="mt-5 inline-flex items-center gap-2 text-slate-300 hover:text-gold transition-colors">
              <Phone size={16} className="text-gold" /> <span className="font-mono">{FIRM.phone}</span>
            </motion.a>

            <motion.div initial="hidden" animate="show" custom={4} variants={fadeUp} className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-xl sm:text-2xl font-semibold gold-text">{s.value}</div>
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
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-3">A modern firm that speaks your language</h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              We're a modern firm of Chartered Accountants, blending traditional values with forward-thinking strategies. Based in the North West and working with clients across the UK, we focus on simplifying your finances, saving time and delivering insight.
            </p>
            <p className="text-slate-400 mt-4 leading-relaxed">
              We understand your world and work as your partner in progress. Let's build something better, together.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Chartered Accountants, traditional values with modern thinking",
                "Cloud accounting & streamlined systems",
                "Efficiency, clarity and growth-focused advice",
                "Specialists supporting financial advisers",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-slate-200">
                  <ShieldCheck size={18} className="text-gold mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Fee Estimator */}
      <FeeEstimator />

      {/* Who we work with */}
      <section className="relative py-24 bg-navy-800/50 grain">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">Accountants for financial advisers</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-3">Too much admin, not enough headspace?</h2>
            <p className="text-slate-400 mt-4">Whatever stage your advisory practice is at, we give you clarity, control and a clear path to your goals.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {WHO_WE_WORK_WITH.map((w, i) => (
              <motion.div
                key={w.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                variants={fadeUp}
                data-testid={`work-with-${i}`}
                className="relative p-7 rounded-2xl bg-navy-700/70 border border-gold/15 hover:border-gold/45 transition-colors flex flex-col"
              >
                <h3 className="font-serif text-xl font-semibold text-white">{w.title}</h3>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">{w.summary}</p>
                <ul className="mt-5 space-y-2.5 flex-1">
                  {w.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center mt-0.5 shrink-0"><Check size={12} className="text-gold" /></span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gold/70 italic mt-5 pt-4 border-t border-gold/10">{w.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">How it works</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-3">Trusted. Responsive. Insightful.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((h, i) => (
              <motion.div key={h.step} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} variants={fadeUp} className="p-7 rounded-2xl bg-navy-700/60 border border-gold/15">
                <div className="w-11 h-11 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center font-serif text-xl gold-text font-semibold mb-5">{h.step}</div>
                <h3 className="font-serif text-xl font-semibold text-white">{h.title}</h3>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">{h.text}</p>
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
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white relative">Ready to take control of your business?</h2>
            <p className="text-slate-300 mt-4 max-w-xl mx-auto relative">Book a free discovery call to see how we can help, or chat with our AI advisor for instant answers and an indicative quote.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center relative">
              <a href={FIRM.booking} target="_blank" rel="noopener noreferrer" className="gold-btn px-7 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2">
                <CalendarCheck size={18} /> Book a discovery call
              </a>
              <button onClick={() => navigate("/ai")} className="px-7 py-3.5 rounded-full font-semibold border border-gold/40 text-white hover:bg-gold/10 transition-colors flex items-center justify-center gap-2">
                <Sparkles size={18} className="text-gold" /> Launch AI Advisor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
