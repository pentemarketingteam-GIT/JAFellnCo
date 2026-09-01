import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, Calculator, ArrowRight } from "lucide-react";
import { TURNOVER_BANDS, FEE_SERVICES } from "@/data/firm";

export default function FeeEstimator() {
  const navigate = useNavigate();
  const [band, setBand] = useState(TURNOVER_BANDS[1].id);
  const [selected, setSelected] = useState(["cloud", "tax"]);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const { monthly } = useMemo(() => {
    const b = TURNOVER_BANDS.find((x) => x.id === band) || TURNOVER_BANDS[0];
    const svc = FEE_SERVICES.filter((s) => selected.includes(s.id));
    const sum = svc.reduce((a, s) => a + s.price, 0);
    const total = selected.length ? Math.round((b.base + sum * b.mult) / 5) * 5 : 0;
    return { monthly: total };
  }, [band, selected]);

  return (
    <section className="relative py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">Instant estimate</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-3">See your indicative monthly fee</h2>
            <p className="text-slate-400 mt-4 leading-relaxed">Pick your turnover and the services you need for a ballpark figure. No forms, no obligation — final fees are fixed and confirmed after a free consultation.</p>

            <div className="mt-8">
              <div className="text-xs uppercase tracking-wider text-gold/70 mb-3">Annual turnover</div>
              <div className="flex flex-wrap gap-2" data-testid="fee-turnover-bands">
                {TURNOVER_BANDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBand(b.id)}
                    data-testid={`fee-band-${b.id}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      band === b.id ? "gold-btn border-transparent" : "border-gold/25 text-slate-300 hover:border-gold/50"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <div className="text-xs uppercase tracking-wider text-gold/70 mb-3">Services</div>
              <div className="grid sm:grid-cols-2 gap-2.5" data-testid="fee-services">
                {FEE_SERVICES.map((s) => {
                  const on = selected.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggle(s.id)}
                      data-testid={`fee-service-${s.id}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                        on ? "border-gold/50 bg-gold/10" : "border-gold/15 bg-navy-700/40 hover:border-gold/35"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${on ? "bg-gold border-gold" : "border-gold/40"}`}>
                        {on && <Check size={13} className="text-navy-900" />}
                      </span>
                      <span className="text-sm text-slate-200">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-gold/30 glass p-8 sm:p-10 flex flex-col justify-center"
            data-testid="fee-result-card"
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 text-gold/80 text-xs uppercase tracking-wider">
                <Calculator size={14} /> Estimated from
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-mono text-5xl sm:text-6xl font-semibold gold-text" data-testid="fee-monthly-total">£{monthly}</span>
                <span className="text-slate-400 mb-2">/ month</span>
              </div>
              <p className="text-sm text-slate-400 mt-3">
                {selected.length ? `Based on ${selected.length} service${selected.length > 1 ? "s" : ""} for your turnover band.` : "Select at least one service to see a figure."}
              </p>
              <div className="h-px bg-gold/15 my-6" />
              <p className="text-xs text-slate-500">Indicative only. Fixed monthly fees are confirmed after a free, no-obligation consultation — nothing is charged until you're happy.</p>
              <button
                onClick={() => navigate("/ai")}
                data-testid="fee-cta-ai"
                className="mt-6 gold-btn px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 w-full"
              >
                Get an exact quote from our AI advisor <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
