import Header from "@/components/ui/header";
import { startVapiCall } from "@/lib/vapi";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
const getAIResponse = async (prompt: string) => {
  return `NPC Response for prompt: "${prompt}"`;
};

type Message = {
  id: string;
  text: string;
  fromUser: boolean;
};

const ChatScreen: React.FC = () => {
  const params = useLocalSearchParams<{ characterName?: string }>();
  const activeCharacterName =
    typeof params.characterName === "string" && params.characterName.length > 0
      ? params.characterName
      : "Rocky";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, fromUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const aiText = await getAIResponse(input);
    const aiMessage: Message = { id: Date.now().toString() + "_ai", text: aiText, fromUser: false };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleVoiceChat = () => {
    startVapiCall(activeCharacterName);
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        backgroundColor="white"
        barStyle="dark-content"
        translucent={true}
      />

      <Header title="Chat" />

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                msg.fromUser ? styles.userBubble : styles.npcBubble
              ]}
            >
              <Text style={styles.bubbleText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.voiceButton} onPress={handleVoiceChat}>
          <Text style={styles.voiceButtonText}>🎤 Talk with {activeCharacterName}</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          {input.length === 0 && (
            <Text style={styles.placeholder}>Type your message...</Text>
          )}
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            selectionColor="#000"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Image
              source={require('../../assets/sendbutton.png')}
              resizeMode="contain"
              style={styles.sendImage}
            />
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
  },
  sendImage: {
    width: 40,
    height: 40,
  },
  messagesContainer: {
    paddingBottom: 16,
  },
  bubble: {
    maxWidth: '70%',
    padding: 12,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: "white",
    alignSelf: "flex-end",
    borderWidth: 2.5,
    borderColor: '#000',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  npcBubble: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderWidth: 2.5,
    borderColor: '#000',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  bubbleText: {
    color: "#000",
    fontFamily: 'Vt',
    fontSize: 25,
  },
  voiceButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2.5,
    borderColor: "#000",
  },
  voiceButtonText: {
    color: "#fff",
    fontFamily: "Vt",
    fontSize: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginBottom: 15,
    borderWidth: 2.5,
    borderColor: "#9ca3af",
    backgroundColor: 'white',

  },
  input: {
    flex: 1,
    color: "#9ca3af",
    fontSize: 25,
    fontFamily: 'Vt',
    paddingHorizontal:20,
  },
  sendButton: {
    marginLeft: 8,
    padding: 10,
  },
  sendText: {
    color: "#fff",
    fontFamily: 'Vt',
  },
  placeholder: {
    position: "absolute",
    left: 20,
    color: "#9ca3af",
    fontSize: 25,
    fontFamily: "Vt",
  },
});
