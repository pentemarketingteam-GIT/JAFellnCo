import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Home", id: "home" },
  { to: "/services", label: "Services", id: "services" },
  { to: "/about", label: "About", id: "about" },
  { to: "/contact", label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,padding] duration-300 ${
        scrolled ? "glass py-3 border-b border-gold/20" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <Link to="/" data-testid="nav-brand-logo" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg border border-gold/50 flex items-center justify-center font-serif text-gold text-xl font-bold group-hover:bg-gold/10 transition-colors">
            JF
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold text-white tracking-wide">J A Fell &amp; Co</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-medium">Chartered Accountants</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.id}
              to={l.to}
              data-testid={`nav-link-${l.id}`}
              className={`relative text-sm font-medium tracking-wide transition-colors hover:text-gold ${
                location.pathname === l.to ? "text-gold" : "text-slate-300"
              }`}
            >
              {l.label}
              {location.pathname === l.to && (
                <motion.span layoutId="nav-underline" className="absolute -bottom-1.5 left-0 right-0 h-px bg-gold" />
              )}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => navigate("/ai")}
          data-testid="btn-launch-ai-mode"
          className="hidden md:inline-flex items-center gap-2 gold-btn px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide"
        >
          <Sparkles size={16} /> AI Advisor
        </button>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass mt-3 mx-4 rounded-xl border border-gold/20"
          >
            <div className="flex flex-col p-4 gap-1">
              {links.map((l) => (
                <Link
                  key={l.id}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-slate-200 hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => { setOpen(false); navigate("/ai"); }}
                className="mt-2 gold-btn px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> Launch AI Advisor
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
