import Header from "@/components/ui/header";
import { useVapi } from "@/hooks/useVapi";
import React, { useEffect, useRef, useState } from "react";
import { Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { characterName, characterId } = useLocalSearchParams();

  const npcId = Array.isArray(characterId) ? characterId[0] : characterId;
  const npcName = Array.isArray(characterName) ? characterName[0] : characterName || "Rocky";

  // Get assistant ID based on character (you'll need to add these to .env)
  const getAssistantId = (charName: string) => {
    const assistantMap: Record<string, string> = {
      Rocky: process.env.EXPO_PUBLIC_ROCKY_ASSISTANT_ID || "",
      "Ghost Friend": process.env.EXPO_PUBLIC_GHOST_ASSISTANT_ID || "",
      "Flower Spirit": process.env.EXPO_PUBLIC_FLOWER_ASSISTANT_ID || "",
      Teacher: process.env.EXPO_PUBLIC_TEACHER_ASSISTANT_ID || "",
    };
    return assistantMap[charName] || process.env.EXPO_PUBLIC_VAPI_ASSISTANT_ID || "";
  };

  const assistantId = getAssistantId(npcName);

  // Vapi hook for native voice
  const { startCall, stopCall, isCalling, transcripts } = useVapi(assistantId);

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
    
    // Auto-scroll to bottom after new message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleVoiceToggle = () => {
    if (isCalling) {
      stopCall();
    } else {
      startCall();
    }
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

      <View style={styles.headerContainer}>
        <Header title={`Chat with ${npcName}`} />
        <TouchableOpacity 
          style={[
            styles.voiceChatButton, 
            isCalling && styles.voiceChatButtonActive
          ]} 
          onPress={handleVoiceToggle}
        >
          <Text style={styles.voiceChatIcon}>
            {isCalling ? "⏹️" : "🎤"}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 75 : 0}
      >
        {/* Voice Call Status */}
        {isCalling && (
          <View style={styles.voiceStatusBanner}>
            <Text style={styles.voiceStatusText}>
              🎙️ Voice call active - Speak now!
            </Text>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Text Chat Messages */}
          {!isCalling && messages.map(msg => (
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

          {/* Voice Transcripts */}
          {isCalling && transcripts.map((line, idx) => {
            const isUser = line.startsWith("user:");
            const text = line.replace(/^(user:|assistant):/, "").trim();
            return (
              <View
                key={idx}
                style={[
                  styles.bubble,
                  isUser ? styles.userBubble : styles.npcBubble
                ]}
              >
                <Text style={styles.bubbleText}>{text}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Only show text input when NOT in voice call */}
        {!isCalling && (
          <View style={styles.inputContainer}>
            {input.length === 0 && (
              <Text style={styles.placeholder}>Type your message...</Text>
            )}
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              selectionColor="#000"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Image
                source={require('../assets/sendbutton.png')}
                resizeMode="contain"
                style={styles.sendImage}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Voice call info when active */}
        {isCalling && (
          <View style={styles.voiceInfoContainer}>
            <Text style={styles.voiceInfoText}>
              Tap the ⏹️ button above to end the call
            </Text>
          </View>
        )}

      </KeyboardAvoidingView>
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
  headerContainer: {
    position: 'relative',
  },
  voiceChatButton: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: '#10b981',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    zIndex: 10,
  },
  voiceChatButtonActive: {
    backgroundColor: '#dc2626', // Red when active
  },
  voiceChatIcon: {
    fontSize: 24,
  },
  voiceStatusBanner: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2.5,
    borderColor: '#000',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  voiceStatusText: {
    color: '#fff',
    fontFamily: 'Vt',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
  },
  voiceInfoContainer: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2.5,
    borderColor: '#9ca3af',
    marginTop: 16,
    marginBottom: 15,
  },
  voiceInfoText: {
    color: '#374151',
    fontFamily: 'Vt',
    fontSize: 16,
    textAlign: 'center',
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
    marginTop: 16,
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
