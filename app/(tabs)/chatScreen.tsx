import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "react-native";
const ChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chat with NPC</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.body}>
          <Text style={styles.placeholder}>
            Here we’ll later plug in conversational AI.
            {"\n\n"}
            For now, imagine this is a chat log with the character you tapped in AR.
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: "#1f2937",
    backgroundColor: 'white',
  },
  backText: {
    color: "#9ca3af",
    fontSize: 20,
    fontFamily: 'pix',

  },
  title: {
    flex: 1,
    textAlign: "center",
    color: "#041a46ff",
    fontSize: 40,
    fontWeight: "600",
    fontFamily: 'pix',

  },
  body: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    color: "#9ca3af",
    fontSize: 15,
    lineHeight: 22,
  },
});
