// src/hooks/useVapi.ts
import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/react-native";

const VAPI_PUBLIC_KEY = process.env.EXPO_PUBLIC_VAPI_PUBLIC_KEY!;

// Single Vapi instance shared across the app
const vapi = new Vapi(VAPI_PUBLIC_KEY);

export function useVapi(assistantId: string) {
  const [isCalling, setIsCalling] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);

  useEffect(() => {
    const handleCallStart = () => {
      setIsCalling(true);
    };

    const handleCallEnd = () => {
      setIsCalling(false);
    };

    const handleMessage = (message: any) => {
      if (message.type === "transcript") {
        setTranscripts(prev => [
          ...prev,
          `${message.role}: ${message.transcript}`,
        ]);
      }
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);

    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("message", handleMessage);
    };
  }, []);

  const startCall = () => {
    // Start voice call with this assistant
    vapi.start(assistantId);
  };

  const stopCall = () => {
    vapi.stop();
  };

  return {
    startCall,
    stopCall,
    isCalling,
    transcripts,
  };
}
