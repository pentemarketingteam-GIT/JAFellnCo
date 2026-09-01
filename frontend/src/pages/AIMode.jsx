import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
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
  const loadedRef = useRef(false);

  const saveState = useCallback((msgs, intk, cnv) => {
    if (!auth.user) return;
    http.post("/advisor/state", { messages: msgs, intake: intk, canvas: cnv }).catch(() => {});
  }, [auth.user]);

  // Restore a signed-in client's saved chat + intake progress once.
  useEffect(() => {
    if (!auth.user || loadedRef.current) return;
    loadedRef.current = true;
    http.get("/advisor/state").then((res) => {
      const s = res.data || {};
      if (Array.isArray(s.messages) && s.messages.length > 1) {
        setMessages(s.messages);
        if (s.intake && Object.keys(s.intake).length) setIntake((p) => ({ ...p, ...s.intake }));
        if (s.canvas && s.canvas.view) { setCanvas(s.canvas); if (s.canvas.view === "intake") intakeShownRef.current = true; }
        toast.success("Welcome back — we picked up where you left off.");
      }
    }).catch(() => {});
  }, [auth.user]);

  const onSend = useCallback(async (userText) => {
    const userMsg = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await http.post("/chat", {
        session_id: sessionId.current,
        message: userText,
        history,
        intake,
      });
      const data = res.data;
      const reply = data.reply || "I'm sorry, could you rephrase that?";
      const assistantMsg = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, assistantMsg]);

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

      if (nextCanvas.view !== "service") setMobileView("canvas");
      if (audioRef.current) voice.speak(reply);

      saveState([...messages, userMsg, assistantMsg], merged, nextCanvas);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Apologies, I'm having trouble connecting right now. Please call us on " + FIRM.phone + "." }]);
    } finally {
      setSending(false);
    }
  }, [messages, intake, voice, saveState]);

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
