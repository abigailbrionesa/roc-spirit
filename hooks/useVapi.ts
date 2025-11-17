// src/hooks/useVapi.ts
import { useEffect, useState } from "react";
import { Platform } from "react-native";

let VapiClass: any = null;

// Only load native module on iOS/Android, and guard for Expo Go
try {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    VapiClass = require("@vapi-ai/react-native").default;
  }
} catch (e) {
  console.warn(
    "[Vapi] Native module not available. Are you running in Expo Go?",
    e
  );
}

const VAPI_PUBLIC_KEY = process.env.EXPO_PUBLIC_VAPI_PUBLIC_KEY!;
const vapi = VapiClass ? new VapiClass(VAPI_PUBLIC_KEY) : null;

export function useVapi(assistantId: string) {
  const [isCalling, setIsCalling] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);

  useEffect(() => {
    if (!vapi) return;

    const onStart = () => setIsCalling(true);
    const onEnd = () => setIsCalling(false);
    const onMessage = (message: any) => {
      if (message.type === "transcript") {
        setTranscripts(prev => [
          ...prev,
          `${message.role}: ${message.transcript}`,
        ]);
      }
    };

    vapi.on("call-start", onStart);
    vapi.on("call-end", onEnd);
    vapi.on("message", onMessage);

    return () => {
      vapi.off("call-start", onStart);
      vapi.off("call-end", onEnd);
      vapi.off("message", onMessage);
    };
  }, []);

  const startCall = () => {
    if (!vapi) {
      console.warn("[Vapi] startCall called but Vapi is not initialized.");
      return;
    }
    vapi.start(assistantId);
  };

  const stopCall = () => {
    if (!vapi) return;
    vapi.stop();
  };

  return { startCall, stopCall, isCalling, transcripts };
}
