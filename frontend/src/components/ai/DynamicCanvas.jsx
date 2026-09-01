import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Building2, Check, Loader2, Send, Sparkles, CloudCog, BadgePoundSterling, UserRound } from "lucide-react";
import { SERVICES, TEAM, IMAGES, FIRM } from "@/data/firm";
import { http } from "@/lib/apiClient";

const wrap = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

function Welcome({ data }) {
  return (
    <motion.div key="welcome" {...wrap} className="h-full flex flex-col justify-center">
      <div className="relative rounded-2xl overflow-hidden border border-gold/20 mb-8">
        <img src={IMAGES.hero} alt="" className="w-full h-52 object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
        <div className="absolute bottom-4 left-5 flex items-center gap-2">
          <Sparkles className="text-gold" size={18} />
          <span className="text-xs uppercase tracking-[0.2em] text-gold/90">AI Advisory Mode</span>
        </div>
      </div>
      <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white leading-tight">
        {data?.headline || "Meet Fiona, your J A Fell & Co advisor"}
      </h2>
      <p className="text-slate-300 mt-4 leading-relaxed max-w-lg">
        {data?.subtext || "Ask about our services, tax planning, or get an indicative quote. This panel updates live as we talk — try speaking using the mic."}
      </p>
      <div className="grid grid-cols-2 gap-3 mt-8 max-w-md">
        {SERVICES.slice(0, 4).map((s) => (
          <div key={s.id} className="p-4 rounded-xl bg-navy-700/60 border border-gold/15">
            <div className="text-gold text-sm font-medium">{s.title}</div>
            <div className="text-xs text-slate-400 mt-1">{s.tagline}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ServiceView({ data }) {
  const features = data?.features || [];
  return (
    <motion.div key="service" {...wrap} className="h-full">
      <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-6">
        <CloudCog className="text-gold" size={26} />
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Service</span>
      <h2 className="font-serif text-3xl font-semibold text-white mt-2">{data?.title || "Our Services"}</h2>
      <p className="text-slate-300 mt-3 leading-relaxed">{data?.summary}</p>
      <div className="mt-6 space-y-3">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 p-3 rounded-lg bg-navy-700/50 border border-gold/10">
            <span className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0"><Check size={13} className="text-gold" /></span>
            <span className="text-sm text-slate-200">{f}</span>
          </motion.div>
        ))}
      </div>
      {data?.ideal_for && (
        <div className="mt-6 p-4 rounded-xl border border-gold/20 bg-gold/5">
          <div className="text-xs uppercase tracking-wider text-gold/80 mb-1">Ideal for</div>
          <div className="text-sm text-slate-200">{data.ideal_for}</div>
        </div>
      )}
    </motion.div>
  );
}

function TeamView({ data }) {
  const fallback = TEAM[0];
  const match = TEAM.find((t) => data?.advisor && t.name.toLowerCase().includes(String(data.advisor).toLowerCase().split(" ")[0])) || fallback;
  const specialties = data?.specialties || [match.specialty];
  return (
    <motion.div key="team" {...wrap} className="h-full">
      <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Your advisor</span>
      <div className="mt-4 rounded-2xl overflow-hidden border border-gold/20">
        <div className="relative h-64">
          <img src={match.image} alt={match.name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <div className="font-serif text-2xl font-semibold text-white">{data?.advisor || match.name}</div>
            <div className="text-gold text-sm">{data?.role || match.role}</div>
          </div>
        </div>
      </div>
      <p className="text-slate-300 mt-5 leading-relaxed">{data?.bio || match.bio}</p>
      <div className="flex flex-wrap gap-2 mt-5">
        {specialties.map((s, i) => (
          <span key={i} className="px-3 py-1.5 rounded-full text-xs bg-gold/10 border border-gold/25 text-gold/90 font-mono">{s}</span>
        ))}
      </div>
    </motion.div>
  );
}

function QuoteView({ data }) {
  const items = data?.items || [];
  return (
    <motion.div key="quote" {...wrap} className="h-full">
      <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-6">
        <BadgePoundSterling className="text-gold" size={26} />
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Indicative quote</span>
      <h2 className="font-serif text-3xl font-semibold text-white mt-2">Your estimated fees</h2>
      <div className="mt-6 rounded-2xl border border-gold/20 overflow-hidden">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-gold/10 bg-navy-700/40">
            <span className="text-slate-200 text-sm">{it.label}</span>
            <span className="text-gold font-mono text-sm">{it.price}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-5 py-4 bg-gold/10">
          <span className="text-white font-medium">Estimated total</span>
          <span className="gold-text font-mono text-lg font-semibold">{data?.total || "—"}</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4 italic">{data?.note || "Indicative only, subject to a free consultation."}</p>
    </motion.div>
  );
}

function IntakeView({ intake, setIntake }) {
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const fields = [
    { key: "business_name", label: "Business name", testid: "intake-form-business-name", placeholder: "e.g. Marine Leisure Ltd" },
    { key: "contact_name", label: "Contact person", testid: "intake-form-contact-name", placeholder: "Your full name" },
    { key: "turnover", label: "Annual turnover", testid: "intake-form-turnover", placeholder: "e.g. £250k" },
    { key: "service_interested", label: "Service interested in", testid: "intake-form-service-interested", placeholder: "e.g. Cloud Accounting" },
    { key: "current_accountant", label: "Current accountant", testid: "intake-form-current-accountant", placeholder: "e.g. None / another firm" },
  ];

  const submit = async () => {
    if (!intake.business_name && !intake.contact_name) {
      toast.error("Add at least a business or contact name.");
      return;
    }
    setSaving(true);
    try {
      await http.post("/intake", intake);
      setSaved(true);
      toast.success("Onboarding details saved — we'll be in touch!");
    } catch (e) {
      toast.error("Couldn't save right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full bg-navy-800 border rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none transition-colors";

  return (
    <motion.div key="intake" {...wrap} className="h-full">
      <div className="flex items-center gap-3 mb-2">
        <Building2 className="text-gold" size={22} />
        <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Onboarding</span>
      </div>
      <h2 className="font-serif text-3xl font-semibold text-white">Let's get you set up</h2>
      <p className="text-slate-400 text-sm mt-2">Fields fill in automatically as we chat — edit anything you like.</p>

      <div className="mt-6 space-y-4" data-testid="dynamic-intake-form">
        {fields.map((f) => {
          const filled = intake[f.key] && intake[f.key].length > 0;
          return (
            <div key={f.key}>
              <label className="text-xs uppercase tracking-wider text-gold/70 flex items-center gap-2 mb-1.5">
                {f.label}
                <AnimatePresence>
                  {filled && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400">
                      <Check size={12} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </label>
              <input
                data-testid={f.testid}
                className={`${input} ${filled ? "border-emerald-500/40 bg-emerald-500/5" : "border-gold/20 focus:border-gold/60"}`}
                placeholder={f.placeholder}
                value={intake[f.key] || ""}
                onChange={(e) => setIntake({ ...intake, [f.key]: e.target.value })}
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={submit}
        disabled={saving}
        data-testid="intake-form-submit-button"
        className="mt-6 gold-btn px-6 py-3 rounded-full font-semibold flex items-center gap-2 disabled:opacity-60"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Send size={16} />}
        {saving ? "Saving…" : saved ? "Details saved" : "Submit onboarding details"}
      </button>
    </motion.div>
  );
}

export default function DynamicCanvas({ canvas, intake, setIntake }) {
  const view = canvas?.view || "welcome";
  const data = canvas?.data || {};
  return (
    <div
      data-testid="dynamic-canvas-container"
      className="relative h-full overflow-y-auto grain bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-6 sm:p-10 rounded-none lg:rounded-2xl border-r lg:border border-gold/20"
    >
      <div className="absolute top-6 right-8 w-40 h-40 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-xl mx-auto h-full">
        <AnimatePresence mode="wait">
          {view === "welcome" && <Welcome data={data} />}
          {view === "service" && <ServiceView data={data} />}
          {view === "team" && <TeamView data={data} />}
          {view === "quote" && <QuoteView data={data} />}
          {view === "intake" && <IntakeView intake={intake} setIntake={setIntake} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
