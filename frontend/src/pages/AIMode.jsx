import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { http } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { useVoice } from "@/hooks/useVoice";
import ChatPanel from "@/components/ai/ChatPanel";
import DynamicCanvas from "@/components/ai/DynamicCanvas";
import { FIRM } from "@/data/firm";

function makeSessionId() {
  return "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const GREETING = "Hello, I'm Fiona, your AI advisor at J A Fell & Co. Whether you need cloud accounting, tax planning, bookkeeping or business advice, I'm here to help — and this panel will update as we chat. What can I help you with today?";

export default function AIMode() {
  const auth = useAuth();
  const voice = useVoice();
  const sessionId = useRef(makeSessionId());
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [intake, setIntake] = useState({ business_name: "", contact_name: "", turnover: "", service_interested: "", current_accountant: "" });
  const [canvas, setCanvas] = useState({ view: "welcome", data: {} });
  const [sending, setSending] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mobileView, setMobileView] = useState("chat");
  const audioRef = useRef(audioEnabled);
  audioRef.current = audioEnabled;
  const intakeShownRef = useRef(false);

  const onSend = useCallback(async (userText) => {
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setSending(true);
    try {
      const history = [...messages, { role: "user", content: userText }].map((m) => ({ role: m.role, content: m.content }));
      const res = await http.post("/chat", {
        session_id: sessionId.current,
        message: userText,
        history,
        intake,
      });
      const data = res.data;
      const reply = data.reply || "I'm sorry, could you rephrase that?";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      let merged = { ...intake };
      if (data.intake) {
        Object.keys(data.intake).forEach((k) => {
          if (data.intake[k]) merged[k] = data.intake[k];
        });
        setIntake(merged);
      }

      let nextCanvas = data.canvas || { view: "welcome", data: {} };
      const hasClientInfo = merged.business_name || merged.contact_name;
      // Guarantee the auto-filling intake form is shown at least once when we
      // first capture client details, even if the model jumps ahead to a quote.
      if (hasClientInfo && !intakeShownRef.current && nextCanvas.view !== "intake") {
        nextCanvas = { view: "intake", data: {} };
      }
      if (nextCanvas.view === "intake") intakeShownRef.current = true;
      setCanvas(nextCanvas);

      if (nextCanvas.view === "intake" || hasClientInfo) {
        setMobileView("canvas");
      }
      if (audioRef.current) voice.speak(reply);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Apologies, I'm having trouble connecting right now. Please call us on " + FIRM.phone + "." }]);
    } finally {
      setSending(false);
    }
  }, [messages, intake, voice]);

  return (
    <div className="h-screen w-screen flex flex-col bg-navy-900 overflow-hidden">
      {/* Top bar */}
      <div className="h-14 shrink-0 border-b border-gold/20 flex items-center justify-between px-4 sm:px-6 glass">
        <Link to="/" data-testid="ai-back-home" className="flex items-center gap-2 text-slate-300 hover:text-gold transition-colors text-sm">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to website</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-gold/50 flex items-center justify-center font-serif text-gold font-bold text-sm">JF</div>
          <span className="font-serif text-white font-semibold hidden sm:inline">J A Fell &amp; Co · AI Advisor</span>
        </div>
        <button
          onClick={() => setMobileView(mobileView === "chat" ? "canvas" : "chat")}
          data-testid="btn-toggle-view-mode"
          className="lg:hidden flex items-center gap-2 text-sm text-gold border border-gold/30 rounded-full px-3 py-1.5"
        >
          <LayoutGrid size={14} /> {mobileView === "chat" ? "View panel" : "View chat"}
        </button>
      </div>

      {/* Split layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_440px]">
        {/* Canvas (left) */}
        <div className={`min-h-0 ${mobileView === "canvas" ? "block" : "hidden"} lg:block`}>
          <DynamicCanvas canvas={canvas} intake={intake} setIntake={setIntake} />
        </div>
        {/* Chat (right) */}
        <div className={`min-h-0 ${mobileView === "chat" ? "block" : "hidden"} lg:block`}>
          <ChatPanel
            messages={messages}
            sending={sending}
            onSend={onSend}
            voice={voice}
            audioEnabled={audioEnabled}
            setAudioEnabled={setAudioEnabled}
            auth={auth}
          />
        </div>
      </div>
    </div>
  );
}
