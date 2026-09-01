import { useRef, useState, useCallback } from "react";
import { http, API } from "@/lib/apiClient";

export function useVoice() {
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start();
      mediaRef.current = { mr, stream };
      setRecording(true);
    } catch (e) {
      throw new Error("mic-denied");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    return new Promise((resolve) => {
      const ctx = mediaRef.current;
      if (!ctx) return resolve("");
      const { mr, stream } = ctx;
      mr.onstop = async () => {
        setRecording(false);
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size < 800) return resolve("");
        setTranscribing(true);
        try {
          const fd = new FormData();
          fd.append("file", blob, "audio.webm");
          const res = await fetch(`${API}/voice/transcribe`, { method: "POST", body: fd });
          const data = await res.json();
          resolve(data.text || "");
        } catch (e) {
          resolve("");
        } finally {
          setTranscribing(false);
        }
      };
      mr.stop();
    });
  }, []);

  const speak = useCallback(async (text) => {
    try {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      const res = await fetch(`${API}/voice/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "onyx" }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      setSpeaking(true);
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch (e) {
      setSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setSpeaking(false);
  }, []);

  return { recording, speaking, transcribing, startRecording, stopRecording, speak, stopSpeaking };
}
