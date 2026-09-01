import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { FIRM } from "@/data/firm";
import { http } from "@/lib/apiClient";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setSending(true);
    try {
      await http.post("/contact", form);
      setSent(true);
      toast.success("Thank you — we'll be in touch shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (e) {
      toast.error("Something went wrong. Please call us on " + FIRM.phone);
    } finally {
      setSending(false);
    }
  };

  const field = "w-full bg-navy-800 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-gold/60 transition-colors";

  return (
    <div className="pt-28 pb-24">
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gold/90 font-medium">Get in touch</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-4">Let's start a conversation</h1>
          <p className="text-slate-300 mt-5">Pop in to our Southport office, give us a call, or send a message and we'll respond within one working day.</p>
        </div>
      </section>

      <section>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-5">
            {[
              { icon: MapPin, label: "Visit us", value: FIRM.address },
              { icon: Phone, label: "Call us", value: FIRM.phone, href: FIRM.phoneHref, mono: true },
              { icon: Mail, label: "Email us", value: FIRM.email, href: `mailto:${FIRM.email}` },
              { icon: Clock, label: "Opening hours", value: "Mon–Fri · 9:00am – 5:30pm" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4 p-5 rounded-2xl bg-navy-700/60 border border-gold/15">
                <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                  <c.icon size={20} className="text-gold" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gold/80">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className={`text-white hover:text-gold transition-colors ${c.mono ? "font-mono" : ""}`}>{c.value}</a>
                  ) : (
                    <div className="text-white">{c.value}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-2xl overflow-hidden border border-gold/20 h-56">
              <iframe
                title="J A Fell & Co location"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.4) invert(0.9) hue-rotate(180deg)" }}
                loading="lazy"
                src="https://www.google.com/maps?q=40+Hoghton+Street+Southport+PR9+0PQ&output=embed"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl bg-navy-700/60 border border-gold/15"
              data-testid="contact-form"
            >
              <h2 className="font-serif text-2xl font-semibold text-white mb-6">Send us a message</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input data-testid="contact-name" className={field} placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input data-testid="contact-email" className={field} placeholder="Email address *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <input data-testid="contact-phone" className={`${field} mt-4`} placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <textarea data-testid="contact-message" className={`${field} mt-4 min-h-[140px] resize-none`} placeholder="How can we help? *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <button
                type="submit"
                disabled={sending}
                data-testid="contact-form-submit-button"
                className="mt-6 gold-btn px-7 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-60"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : sent ? <CheckCircle2 size={18} /> : <Send size={18} />}
                {sending ? "Sending…" : sent ? "Message sent" : "Send message"}
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
