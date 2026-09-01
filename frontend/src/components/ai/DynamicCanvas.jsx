import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Building2, Check, Loader2, Send, Sparkles, CloudCog, BadgePoundSterling,
  CalendarClock, Video, MapPin, ArrowRight, TrendingUp, Clock, Layers,
  Plus, Minus, Zap, HeartCrack, HeartHandshake, RotateCw,
} from "lucide-react";
import { SERVICES, TEAM, IMAGES, FIRM, TURNOVER_BANDS, FEE_SERVICES } from "@/data/firm";
import { http } from "@/lib/apiClient";

const wrap = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

const PAIN_POINTS = [
  { id: "chasing-invoices", label: "Chasing invoices & late payments" },
  { id: "year-end-panic", label: "Year-end panic & scramble" },
  { id: "hmrc-letters", label: "Scary HMRC letters" },
  { id: "no-profit-view", label: "No clear view of profit" },
  { id: "admin-time", label: "Too much time on admin" },
  { id: "tax-efficiency", label: "Unsure I'm tax-efficient" },
  { id: "outgrown", label: "Outgrown my accountant" },
  { id: "growth-planning", label: "Planning growth / hiring" },
];

const COMPARE_NOW = ["Late nights on spreadsheets", "Year-end surprises & panic", "Guessing your tax bill", "No time to plan growth"];
const COMPARE_US = ["Real-time cloud numbers", "Proactive year-round planning", "No nasty tax surprises", "Time back to grow your firm"];

// ---- Small shared action button that talks back to Fiona ----
function ActionButton({ onClick, disabled, children, testid }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testid}
      className="mt-7 gold-btn px-6 py-3 rounded-full font-semibold flex items-center gap-2 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

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
        {data?.subtext || "Ask about our services, tax planning, or get an indicative quote. This panel updates live as we talk — and you can tap, drag and choose right here on the left."}
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

// 1. Tap-to-Ask service tiles
function ServiceTiles({ data, onSend, sending }) {
  return (
    <motion.div key="service_tiles" {...wrap} className="h-full">
      <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Explore our services</span>
      <h2 className="font-serif text-3xl font-semibold text-white mt-2">Where would you like to start?</h2>
      <p className="text-slate-400 text-sm mt-2">{data?.intro || "Tap any service and I'll walk you through it."}</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="canvas-service-tiles">
        {SERVICES.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            disabled={sending}
            onClick={() => onSend(`Tell me about your ${s.title} service.`)}
            data-testid={`canvas-service-tile-${s.id}`}
            className="group text-left p-4 rounded-xl bg-navy-700/50 border border-gold/15 hover:border-gold/50 hover:bg-gold/5 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <span className="text-gold text-sm font-medium">{s.title}</span>
              <ArrowRight size={15} className="text-gold/50 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-xs text-slate-400 mt-1">{s.tagline}</div>
          </motion.button>
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

// 2. Pain-point chooser
function PainPoints({ data, interactive, onInteractive, onSend, sending }) {
  const selected = interactive.painPoints || [];
  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    onInteractive({ ...interactive, painPoints: next });
  };
  const submit = () => {
    const labels = PAIN_POINTS.filter((p) => selected.includes(p.id)).map((p) => p.label.toLowerCase());
    onSend(`My main challenges right now are: ${labels.join(", ")}. How can you help?`);
  };
  return (
    <motion.div key="pain_points" {...wrap} className="h-full">
      <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-6">
        <Zap className="text-gold" size={26} />
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-gold/90">What's holding you back?</span>
      <h2 className="font-serif text-3xl font-semibold text-white mt-2">Tick what sounds familiar</h2>
      <p className="text-slate-400 text-sm mt-2">{data?.intro || "Pick the ones that bite — I'll tailor everything around them."}</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5" data-testid="canvas-pain-points">
        {PAIN_POINTS.map((p) => {
          const on = selected.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              data-testid={`canvas-pain-${p.id}`}
              className={`flex items-center gap-2.5 text-left p-3 rounded-xl border text-sm transition-colors ${on ? "border-gold/55 bg-gold/10 text-white" : "border-gold/15 bg-navy-700/40 text-slate-300 hover:border-gold/35"}`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${on ? "bg-gold border-gold text-navy-900" : "border-gold/40"}`}>
                {on && <Check size={12} />}
              </span>
              {p.label}
            </button>
          );
        })}
      </div>
      <ActionButton onClick={submit} disabled={sending || selected.length === 0} testid="canvas-pain-submit">
        <HeartHandshake size={16} /> Let's tackle these
      </ActionButton>
    </motion.div>
  );
}

// 3. Live fee slider
function FeeSlider({ data, interactive, onInteractive, onSend, sending }) {
  const idx = Math.max(0, TURNOVER_BANDS.findIndex((b) => b.id === (interactive.turnoverBand || "90-250")));
  const band = TURNOVER_BANDS[idx] || TURNOVER_BANDS[1];
  const fee = Math.round(band.base);
  const setIdx = (i) => onInteractive({ ...interactive, turnoverBand: TURNOVER_BANDS[i].id });
  return (
    <motion.div key="fee_slider" {...wrap} className="h-full">
      <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-6">
        <TrendingUp className="text-gold" size={26} />
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Live fee estimate</span>
      <h2 className="font-serif text-3xl font-semibold text-white mt-2">Slide to your turnover</h2>
      <p className="text-slate-400 text-sm mt-2">{data?.service ? `Indicative ${data.service} fee based on turnover.` : "Drag the slider and watch the indicative monthly fee update."}</p>

      <div className="mt-8 p-6 rounded-2xl border border-gold/20 bg-navy-700/40">
        <div className="flex items-end justify-between mb-1">
          <span className="text-xs uppercase tracking-wider text-gold/70">Annual turnover</span>
          <span className="text-white font-mono text-sm">{band.label}</span>
        </div>
        <input
          type="range"
          min={0}
          max={TURNOVER_BANDS.length - 1}
          step={1}
          value={idx}
          onChange={(e) => setIdx(Number(e.target.value))}
          data-testid="canvas-fee-slider"
          className="w-full accent-gold cursor-pointer mt-3"
        />
        <div className="mt-8 text-center">
          <div className="text-xs uppercase tracking-wider text-gold/70">Indicative from</div>
          <motion.div key={fee} initial={{ scale: 0.9, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} className="gold-text font-mono text-5xl font-semibold mt-1">
            £{fee}<span className="text-2xl text-slate-400">/mo</span>
          </motion.div>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3 italic">Indicative only, subject to a free consultation.</p>
      <ActionButton onClick={() => onSend(`My turnover is around ${band.label}. Roughly what would your monthly fees look like?`)} disabled={sending} testid="canvas-fee-submit">
        <BadgePoundSterling size={16} /> Discuss this estimate
      </ActionButton>
    </motion.div>
  );
}

// 4. Build-your-package basket
function PackageBuilder({ interactive, onInteractive, onSend, sending }) {
  const chosen = interactive.package || [];
  const toggle = (id) => {
    const next = chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id];
    onInteractive({ ...interactive, package: next });
  };
  const total = FEE_SERVICES.filter((s) => chosen.includes(s.id)).reduce((a, s) => a + s.price, 0);
  const submit = () => {
    const labels = FEE_SERVICES.filter((s) => chosen.includes(s.id)).map((s) => s.label);
    onSend(`I'd like a package with: ${labels.join(", ")}. What would that cost together?`);
  };
  return (
    <motion.div key="package_builder" {...wrap} className="h-full">
      <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-6">
        <Layers className="text-gold" size={26} />
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Build your package</span>
      <h2 className="font-serif text-3xl font-semibold text-white mt-2">Mix &amp; match your support</h2>
      <p className="text-slate-400 text-sm mt-2">Add what you need — the monthly total updates as you go.</p>
      <div className="mt-6 space-y-2.5" data-testid="canvas-package-list">
        {FEE_SERVICES.map((s) => {
          const on = chosen.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              data-testid={`canvas-package-${s.id}`}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-colors ${on ? "border-gold/55 bg-gold/10" : "border-gold/15 bg-navy-700/40 hover:border-gold/35"}`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${on ? "bg-gold text-navy-900" : "bg-navy-800 text-gold border border-gold/40"}`}>
                  {on ? <Minus size={13} /> : <Plus size={13} />}
                </span>
                <span className={`text-sm ${on ? "text-white" : "text-slate-300"}`}>{s.label}</span>
              </span>
              <span className="text-gold font-mono text-sm">£{s.price}/mo</span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-between px-5 py-4 rounded-2xl bg-gold/10 border border-gold/25">
        <span className="text-white font-medium">Your monthly total</span>
        <motion.span key={total} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="gold-text font-mono text-xl font-semibold" data-testid="canvas-package-total">from £{total}/mo</motion.span>
      </div>
      <ActionButton onClick={submit} disabled={sending || chosen.length === 0} testid="canvas-package-submit">
        <BadgePoundSterling size={16} /> Quote this package
      </ActionButton>
    </motion.div>
  );
}

// 5. ROI / time-reclaimed calculator
function RoiCalc({ interactive, onInteractive, onSend, sending }) {
  const hours = interactive.roiHours || 6;
  const RATE = 45; // indicative value of an adviser's hour
  const WEEKS = 46;
  const hoursYr = hours * WEEKS;
  const moneyYr = hours * WEEKS * RATE;
  return (
    <motion.div key="roi" {...wrap} className="h-full">
      <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-6">
        <Clock className="text-gold" size={26} />
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Reclaim your time</span>
      <h2 className="font-serif text-3xl font-semibold text-white mt-2">What is admin costing you?</h2>
      <p className="text-slate-400 text-sm mt-2">How many hours a week do you lose to books, admin and chasing paperwork?</p>

      <div className="mt-8 p-6 rounded-2xl border border-gold/20 bg-navy-700/40">
        <div className="flex items-end justify-between">
          <span className="text-xs uppercase tracking-wider text-gold/70">Hours per week</span>
          <span className="text-white font-mono text-lg">{hours}h</span>
        </div>
        <input
          type="range" min={1} max={20} step={1} value={hours}
          onChange={(e) => onInteractive({ ...interactive, roiHours: Number(e.target.value) })}
          data-testid="canvas-roi-slider"
          className="w-full accent-gold cursor-pointer mt-3"
        />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="p-5 rounded-2xl border border-gold/20 bg-navy-700/40 text-center">
          <div className="text-xs uppercase tracking-wider text-gold/70">Time back / year</div>
          <motion.div key={hoursYr} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="gold-text font-mono text-3xl font-semibold mt-1">{hoursYr}h</motion.div>
        </div>
        <div className="p-5 rounded-2xl border border-gold/20 bg-navy-700/40 text-center">
          <div className="text-xs uppercase tracking-wider text-gold/70">Value reclaimed</div>
          <motion.div key={moneyYr} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="gold-text font-mono text-3xl font-semibold mt-1">£{moneyYr.toLocaleString()}</motion.div>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3 italic">Based on an indicative £{RATE}/hour value of your time over {WEEKS} working weeks.</p>
      <ActionButton onClick={() => onSend(`I spend about ${hours} hours a week on admin and bookkeeping. How could you take that off my plate?`)} disabled={sending} testid="canvas-roi-submit">
        <ArrowRight size={16} /> Show me how to get it back
      </ActionButton>
    </motion.div>
  );
}

// 6. Comparison flip card
function Comparison({ data, onSend, sending }) {
  const [flipped, setFlipped] = React.useState(false);
  const now = data?.now?.length ? data.now : COMPARE_NOW;
  const us = data?.withUs?.length ? data.withUs : COMPARE_US;
  return (
    <motion.div key="comparison" {...wrap} className="h-full flex flex-col">
      <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Before &amp; after</span>
      <h2 className="font-serif text-3xl font-semibold text-white mt-2">Picture the difference</h2>
      <p className="text-slate-400 text-sm mt-2">Tap the card to flip between where you are now and life with us.</p>

      <button
        onClick={() => setFlipped((f) => !f)}
        data-testid="canvas-comparison-flip"
        className="mt-7 relative w-full rounded-2xl border p-6 text-left transition-colors min-h-[280px] overflow-hidden group"
        style={{ borderColor: flipped ? "rgba(212,175,55,0.5)" : "rgba(244,63,94,0.35)" }}
      >
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div key="now" initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center gap-2 text-rose-400 mb-4"><HeartCrack size={20} /><span className="uppercase text-xs tracking-widest">You now</span></div>
              <ul className="space-y-3">
                {now.map((n, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />{n}</li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div key="us" initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center gap-2 text-gold mb-4"><HeartHandshake size={20} /><span className="uppercase text-xs tracking-widest">With J A Fell &amp; Co</span></div>
              <ul className="space-y-3">
                {us.map((n, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-100 text-sm"><Check size={14} className="text-gold" />{n}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-slate-500 group-hover:text-gold transition-colors"><RotateCw size={12} /> flip</span>
      </button>

      <ActionButton onClick={() => onSend("That 'with you' picture is exactly what I want. What's the first step?")} disabled={sending} testid="canvas-comparison-submit">
        <ArrowRight size={16} /> That's the version I want
      </ActionButton>
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

function SchedulerView({ data, intake }) {
  const [mode, setMode] = React.useState("office");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [booked, setBooked] = React.useState(false);

  const days = React.useMemo(() => {
    const out = [];
    const d = new Date();
    let added = 0;
    while (added < 6) {
      d.setDate(d.getDate() + 1);
      const dow = d.getDay();
      if (dow !== 0 && dow !== 6) {
        out.push({
          key: d.toISOString().slice(0, 10),
          label: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
        });
        added++;
      }
    }
    return out;
  }, []);

  const times = ["09:30", "11:00", "13:30", "15:00", "16:30"];

  const book = async () => {
    if (!date || !time) { toast.error("Please pick a date and time."); return; }
    setSaving(true);
    try {
      await http.post("/meeting", {
        name: intake?.contact_name || "",
        email: intake?.email || "",
        phone: intake?.phone || "",
        mode, date, time,
        notes: intake?.business_name ? `Business: ${intake.business_name}` : "",
      });
      setBooked(true);
      toast.success("Meeting requested — we'll confirm by email shortly.");
    } catch (e) {
      toast.error("Couldn't book right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div key="scheduler" {...wrap} className="h-full">
      <div className="flex items-center gap-3 mb-2">
        <CalendarClock className="text-gold" size={22} />
        <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Book a consultation</span>
      </div>
      <h2 className="font-serif text-3xl font-semibold text-white">Pick a time that suits you</h2>
      <p className="text-slate-400 text-sm mt-2">{data?.note || "Free 30-minute consultation with a senior advisor. No obligation."}</p>

      <div className="mt-6 grid grid-cols-2 gap-3" data-testid="scheduler-modes">
        {[{ id: "office", icon: MapPin, t: "In person", s: FIRM.addressShort }, { id: "video", icon: Video, t: "Video call", s: "Google Meet / Teams" }].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            data-testid={`scheduler-mode-${m.id}`}
            className={`p-4 rounded-xl border text-left transition-colors ${mode === m.id ? "border-gold/50 bg-gold/10" : "border-gold/15 bg-navy-700/40 hover:border-gold/35"}`}
          >
            <m.icon size={18} className="text-gold mb-2" />
            <div className="text-sm text-white font-medium">{m.t}</div>
            <div className="text-xs text-slate-400 mt-0.5">{m.s}</div>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-wider text-gold/70 mb-2">Date</div>
        <div className="flex flex-wrap gap-2" data-testid="scheduler-dates">
          {days.map((d) => (
            <button key={d.key} onClick={() => setDate(d.key)} className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${date === d.key ? "gold-btn border-transparent" : "border-gold/20 text-slate-300 hover:border-gold/45"}`}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs uppercase tracking-wider text-gold/70 mb-2">Time</div>
        <div className="flex flex-wrap gap-2" data-testid="scheduler-times">
          {times.map((t) => (
            <button key={t} onClick={() => setTime(t)} className={`px-4 py-2 rounded-lg text-sm font-mono border transition-colors ${time === t ? "gold-btn border-transparent" : "border-gold/20 text-slate-300 hover:border-gold/45"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <button onClick={book} disabled={saving} data-testid="scheduler-book-button" className="mt-7 gold-btn px-6 py-3 rounded-full font-semibold flex items-center gap-2 disabled:opacity-60">
        {saving ? <Loader2 size={16} className="animate-spin" /> : booked ? <Check size={16} /> : <CalendarClock size={16} />}
        {saving ? "Booking…" : booked ? "Meeting requested" : "Request this slot"}
      </button>
    </motion.div>
  );
}

export default function DynamicCanvas({ canvas, intake, setIntake, onSend, sending, interactive = {}, onInteractive = () => {} }) {
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
          {view === "service_tiles" && <ServiceTiles data={data} onSend={onSend} sending={sending} />}
          {view === "service" && <ServiceView data={data} />}
          {view === "pain_points" && <PainPoints data={data} interactive={interactive} onInteractive={onInteractive} onSend={onSend} sending={sending} />}
          {view === "fee_slider" && <FeeSlider data={data} interactive={interactive} onInteractive={onInteractive} onSend={onSend} sending={sending} />}
          {view === "package_builder" && <PackageBuilder interactive={interactive} onInteractive={onInteractive} onSend={onSend} sending={sending} />}
          {view === "roi" && <RoiCalc interactive={interactive} onInteractive={onInteractive} onSend={onSend} sending={sending} />}
          {view === "comparison" && <Comparison data={data} onSend={onSend} sending={sending} />}
          {view === "team" && <TeamView data={data} />}
          {view === "quote" && <QuoteView data={data} />}
          {view === "scheduler" && <SchedulerView data={data} intake={intake} />}
          {view === "intake" && <IntakeView intake={intake} setIntake={setIntake} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
