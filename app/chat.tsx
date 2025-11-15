// app/chat.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Header from "@/components/ui/header";
import { BlurView } from "expo-blur";

type Message = {
  id: string;
  text: string;
  fromUser: boolean;
};

// TEMP: stub AI – replace with Vapi later
const getAIResponse = async (prompt: string) => {
  return `NPC Response for prompt: "${prompt}"`;
};

export default function ChatScreen() {
  const { characterName, characterId } =
    useLocalSearchParams<{ characterName?: string; characterId?: string }>();

  const displayName = characterName || "Character";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      fromUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    const prompt = input;
    setInput("");

    // Fake AI response for now
    const aiText = await getAIResponse(prompt);
    const aiMessage: Message = {
      id: Date.now().toString() + "_ai",
      text: aiText,
      fromUser: false,
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <View style={styles.root}>
      {/* This sits above the AR camera; BlurView adds the "frosted" effect */}
      <BlurView
        intensity={40}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />

      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Same header & back behavior as chatScreen */}
        <Header title={`Chat with ${displayName}`} />

        <KeyboardAvoidingView
          style={styles.contentWrapper}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* 3D MODEL / AVATAR AREA */}
          <View style={styles.modelContainer}>
            {/* TODO: Replace this with your actual 3D model component */}
            <View style={styles.modelInner}>
              <Text style={styles.modelTitle}>{displayName}</Text>
              <Text style={styles.modelSubtitle}>
                {/* You can use characterId here to decide which model to render */}
                {/* Example: render <MascotModel characterId={characterId} /> */}
                3D character view goes here
              </Text>
            </View>
          </View>

          {/* CHAT AREA (like original chatScreen) */}
          <View style={styles.chatCard}>
            <ScrollView
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(msg => (
                <View
                  key={msg.id}
                  style={[
                    styles.bubble,
                    msg.fromUser ? styles.userBubble : styles.npcBubble,
                  ]}
                >
                  <Text style={styles.bubbleText}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              {input.length === 0 && (
                <Text style={styles.placeholder}>Type your message...</Text>
              )}
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                selectionColor="#000"
                returnKeyType="send"
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Image
                  source={require("../assets/sendbutton.png")}
                  resizeMode="contain"
                  style={styles.sendImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // Important so AR shows behind it when using transparent/modal presentation
    backgroundColor: "transparent",
  },
  safeArea: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
  },

  // === 3D MODEL AREA (top) ===
  modelContainer: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: "#9ca3af",
    backgroundColor: "rgba(15,23,42,0.85)",
    overflow: "hidden",
  },
  modelInner: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modelTitle: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "Vt",
  },
  modelSubtitle: {
    marginTop: 8,
    color: "#e5e7eb",
    fontSize: 14,
    textAlign: "center",
  },

  // === CHAT CARD (bottom) – based on chatScreen ===
  chatCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: "#9ca3af",
    backgroundColor: "rgba(15,23,42,0.95)",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 12,
  },
  messagesContainer: {
    paddingBottom: 16,
  },
  bubble: {
    maxWidth: "70%",
    padding: 12,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: "white",
    alignSelf: "flex-end",
    borderWidth: 2.5,
    borderColor: "#000",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  npcBubble: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderWidth: 2.5,
    borderColor: "#000",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  bubbleText: {
    color: "#000",
    fontFamily: "Vt",
    fontSize: 18,
  },

  // === INPUT AREA (same feel as chatScreen) ===
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginTop: 8,
    borderWidth: 2.5,
    borderColor: "#9ca3af",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    color: "#111827",
    fontSize: 20,
    fontFamily: "Vt",
    paddingHorizontal: 20,
  },
  placeholder: {
    position: "absolute",
    left: 20,
    color: "#9ca3af",
    fontSize: 20,
    fontFamily: "Vt",
  },
  sendButton: {
    marginLeft: 8,
    padding: 10,
  },
  sendImage: {
    width: 40,
    height: 40,
  },
});
