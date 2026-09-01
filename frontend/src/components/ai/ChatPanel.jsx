import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

function Waveform({ active }) {
  return (
    <div className="flex items-center gap-0.5 h-4" data-testid="voice-waveform-visualizer">
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          className="w-0.5 bg-gold rounded-full"
          animate={active ? { height: ["4px", "16px", "6px", "14px", "4px"] } : { height: "4px" }}
          transition={{ duration: 0.9, repeat: active ? Infinity : 0, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

function StatusBadge({ recording, transcribing, speaking, thinking }) {
  let label = "Ready", color = "text-slate-400", dot = "bg-slate-500";
  if (recording) { label = "Listening"; color = "text-rose-400"; dot = "bg-rose-500"; }
  else if (transcribing) { label = "Transcribing"; color = "text-cyan-400"; dot = "bg-cyan-500"; }
  else if (thinking) { label = "Thinking"; color = "text-gold"; dot = "bg-gold"; }
  else if (speaking) { label = "Speaking"; color = "text-emerald-400"; dot = "bg-emerald-500"; }
  return (
    <div className="flex items-center gap-2" data-testid="voice-status-badge">
      <span className={`w-2 h-2 rounded-full ${dot} ${(recording || thinking || speaking) ? "animate-pulse" : ""}`} />
      <span className={`text-xs font-mono ${color}`}>{label}</span>
    </div>
  );
}

export default function ChatPanel({ messages, sending, onSend, voice, audioEnabled, setAudioEnabled, auth }) {
  const [text, setText] = useState("");
  const scrollRef = useRef(null);
  const { recording, speaking, transcribing, startRecording, stopRecording, stopSpeaking } = voice;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = () => {
    const t = text.trim();
    if (!t || sending) return;
    setText("");
    onSend(t);
  };

  const toggleMic = async () => {
    if (recording) {
      const transcript = await stopRecording();
      if (transcript && transcript.trim()) {
        onSend(transcript.trim());
      } else {
        toast.error("Didn't catch that — try again.");
      }
    } else {
      try {
        await startRecording();
      } catch (e) {
        toast.error("Microphone access is needed for voice chat.");
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-navy-900/95 border-l border-gold/20">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gold/15 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Sparkles size={18} className="text-gold" />
            {(recording || speaking) && <span className="absolute inset-0 rounded-full border border-gold animate-pulse-ring" />}
          </div>
          <div>
            <div className="text-white font-medium text-sm flex items-center gap-2">Fiona {speaking && <Waveform active />}</div>
            <StatusBadge recording={recording} transcribing={transcribing} speaking={speaking} thinking={sending} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (speaking) stopSpeaking(); setAudioEnabled(!audioEnabled); }}
            data-testid="chat-audio-toggle"
            title={audioEnabled ? "Mute voice" : "Enable voice"}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${audioEnabled ? "border-gold/40 text-gold bg-gold/10" : "border-slate-600 text-slate-400"}`}
          >
            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          {auth.user ? (
            <button onClick={auth.logout} data-testid="chat-user-pill" className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gold/30 hover:bg-gold/10 transition-colors">
              {auth.user.picture ? (
                <img src={auth.user.picture} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs">{auth.user.name?.[0]}</div>
              )}
              <LogOut size={13} className="text-slate-400" />
            </button>
          ) : (
            <button onClick={auth.login} data-testid="google-login-button" className="flex items-center gap-2 px-3 py-2 rounded-full gold-btn text-xs font-semibold">
              <LogIn size={14} /> Sign in
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4" data-testid="chat-messages">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gold/15 border border-gold/25 text-white rounded-br-sm"
                    : "bg-navy-700/70 border border-gold/10 text-slate-200 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {sending && (
          <div className="flex justify-start">
            <div className="bg-navy-700/70 border border-gold/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-gold" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gold/15 shrink-0">
        {recording && (
          <div className="mb-3 flex items-center justify-center gap-3 text-rose-400 text-sm">
            <Waveform active /> Listening… tap the mic to send
          </div>
        )}
        <div className="flex items-end gap-2">
          <button
            onClick={toggleMic}
            disabled={transcribing || sending}
            data-testid="chat-voice-mic-button"
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border transition-colors disabled:opacity-50 ${
              recording ? "bg-rose-500/20 border-rose-500 text-rose-400" : "border-gold/40 text-gold hover:bg-gold/10"
            }`}
          >
            {transcribing ? <Loader2 size={18} className="animate-spin" /> : recording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <div className="flex-1 flex items-end gap-2 bg-navy-800 border border-gold/20 rounded-2xl px-4 py-2 focus-within:border-gold/50 transition-colors">
            <textarea
              data-testid="chat-input-field"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about services, tax, or a quote…"
              rows={1}
              className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 focus:outline-none resize-none max-h-24 py-1"
            />
          </div>
          <button
            onClick={send}
            disabled={!text.trim() || sending}
            data-testid="chat-send-button"
            className="w-11 h-11 rounded-full gold-btn flex items-center justify-center shrink-0 disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
