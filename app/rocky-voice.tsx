// app/rocky-voice.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useVapi } from "@/hooks/useVapi";

const ROCKY_ASSISTANT_ID = process.env.EXPO_PUBLIC_ROCKY_ASSISTANT_ID!;

export default function RockyVoiceScreen() {
  const { startCall, stopCall, isCalling, transcripts } =
    useVapi(ROCKY_ASSISTANT_ID);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#020617" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 12,
          color: "#f9fafb",
        }}
      >
        Talk to Rocky (Voice)
      </Text>

      <ScrollView
        style={{ flex: 1, marginBottom: 16 }}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {transcripts.map((line, idx) => (
          <Text key={idx} style={{ marginBottom: 4, color: "#e5e7eb" }}>
            {line}
          </Text>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={isCalling ? stopCall : startCall}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 999,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#fbbf24",
          backgroundColor: isCalling ? "#b91c1c" : "#facc15",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: isCalling ? "#fee2e2" : "#1f2937",
          }}
        >
          {isCalling ? "End Voice Chat" : "Start Voice Chat"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
