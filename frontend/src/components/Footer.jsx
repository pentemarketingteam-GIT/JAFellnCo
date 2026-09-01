import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Sparkles } from "lucide-react";
import { FIRM, SERVICES } from "@/data/firm";

export default function Footer() {
  return (
    <footer className="relative bg-navy-800 border-t border-gold/20 mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg border border-gold/50 flex items-center justify-center font-serif text-gold text-xl font-bold">JF</div>
            <div className="font-serif text-lg font-semibold text-white">J A Fell &amp; Co</div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Chartered Accountants & Business Advisors serving {FIRM.areas} since {FIRM.established}.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium mb-4">Services</h4>
          <ul className="space-y-2">
            {SERVICES.slice(0, 5).map((s) => (
              <li key={s.id}>
                <Link to="/services" className="text-sm text-slate-400 hover:text-gold transition-colors">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium mb-4">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-sm text-slate-400 hover:text-gold transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-sm text-slate-400 hover:text-gold transition-colors">Contact</Link></li>
            <li><Link to="/ai" className="text-sm text-slate-400 hover:text-gold transition-colors inline-flex items-center gap-1"><Sparkles size={12} /> AI Advisor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium mb-4">Get in touch</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin size={16} className="text-gold mt-0.5 shrink-0" /> {FIRM.address}
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-400">
              <Phone size={16} className="text-gold shrink-0" />
              <a href={FIRM.phoneHref} className="hover:text-gold transition-colors font-mono">{FIRM.phone}</a>
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-400">
              <Mail size={16} className="text-gold shrink-0" />
              <a href={`mailto:${FIRM.email}`} className="hover:text-gold transition-colors">{FIRM.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {FIRM.name}. All rights reserved.</span>
          <span>Regulated by the ICAEW · Southport, United Kingdom</span>
        </div>
      </div>
    </footer>
  );
}
