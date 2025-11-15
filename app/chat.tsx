// app/chat.tsx
import Header from "@/components/ui/header";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CharacterModelView from "../components/CharacterModelView";

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
      {/* Blurred AR camera behind */}
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />

      <SafeAreaView style={styles.safeArea}>
        <Header title={`Chat with ${displayName}`} />

        <KeyboardAvoidingView
          style={styles.contentWrapper}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          {/* Main content: model + messages */}
          <View style={styles.mainContent}>
            <View style={styles.topRow}>
              {/* LEFT: model in white card */}
              <View style={styles.leftModelColumn}>
                <View style={styles.modelCard}>
                  <View style={styles.modelHeader}>
                    <Text style={styles.modelTitle}>{displayName}</Text>
                    <Text style={styles.modelSubtitle}>
                      They’re here to chat with you.
                    </Text>
                  </View>
                  <CharacterModelView characterName={characterName} />
                </View>
              </View>

              {/* RIGHT: messages list */}
              <View style={styles.rightMessagesColumn}>
                <View style={styles.chatCardInner}>
                  <ScrollView
                    contentContainerStyle={styles.messagesContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
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
                </View>
              </View>
            </View>
          </View>

          {/* Bottom: input bar (stays pinned near bottom) */}
          <View style={styles.chatCard}>
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
    backgroundColor: "transparent",
  },
  safeArea: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  mainContent: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
  },

  // === 3D MODEL AREA ===
  topRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    flex: 1,
  },
  leftModelColumn: {
    width: "48%",
    paddingRight: 8,
  },
  rightMessagesColumn: {
    width: "52%",
    paddingLeft: 8,
  },
  modelCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: "#9ca3af",
    backgroundColor: "#ffffff", // white background behind model
    overflow: "hidden",
  },
  modelHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modelTitle: {
    color: "#000",
    fontSize: 20,
    fontFamily: "Vt",
  },
  modelSubtitle: {
    marginTop: 2,
    color: "#4b5563",
    fontSize: 12,
  },

  // === RIGHT CHAT LIST ===
  chatCardInner: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: "#9ca3af",
    backgroundColor: "rgba(15,23,42,0.95)",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
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

  // === BOTTOM INPUT BAR ===
  chatCard: {
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: "#9ca3af",
    backgroundColor: "rgba(15,23,42,0.95)",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingHorizontal: 8,
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
