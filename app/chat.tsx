import Header from "@/components/ui/header";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { npcPersonalities } from "@/app/data/npcPersonalities";
import { quizData } from "@/app/data/quizData";
import { useChatGPT } from "@/hooks/useChatGPT";
import { useLocalSearchParams } from "expo-router";

const getAIResponse = async (prompt: string) => {
  return `NPC Response for prompt: "${prompt}"`;
};

type Message = {
  id: string;
  text: string;
  fromUser: boolean;
};

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { characterName, characterId } = useLocalSearchParams();

  const npcId = Array.isArray(characterId) ? characterId[0] : characterId;
  // const npcName = Array.isArray(characterName) ? characterName[0] : characterName;

  const quizContext = quizData
  .map(
    (q, index) =>
      `${index + 1}. Question: ${q.question}\n   Correct answer: ${q.answer}`
  )
  .join("\n");


  const basePersonality = npcPersonalities[npcId] ?? "You are a friendly NPC.";

  const systemPrompt = `
  ${basePersonality}
  `;
  

  const { sendToChatGPT, generateIntroMessage } = useChatGPT(systemPrompt);

  useEffect(() => {
    const runIntro = async () => {
      const intro = await generateIntroMessage();
      if (intro) {
        setMessages([
          {
            id: Date.now().toString() + "_intro",
            text: intro,
            fromUser: false,
          },
        ]);
      }
    };
  
    runIntro();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { id: Date.now().toString(), text: input, fromUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    // Build conversation history INCLUDING the new user message
    const openAIMessages = [
      ...messages.map(m => ({
        role: m.fromUser ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: input } // Add the current user input here
    ];
    
    setInput("");
    
    const aiText = await sendToChatGPT(openAIMessages);

    const aiMessage: Message = { id: Date.now().toString() + "_ai", text: aiText, fromUser: false };

    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
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
              source={require('../assets/sendbutton.png')}
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
