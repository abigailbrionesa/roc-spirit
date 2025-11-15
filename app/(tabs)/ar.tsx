// app/screens/ARScreen.tsx
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import PosterArScene from "../ar/posterArScene";

const { width, height } = Dimensions.get("window");

export default function ARScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const [detectedCharacter, setDetectedCharacter] = useState<string | null>(null);

  const handleCharacterTapped = useCallback(() => {
    if (!detectedCharacter) return;
    console.log("[ARScreen] Navigating to Chat screen with:", detectedCharacter);
    router.push({
      pathname: "/chat" as any,
      params: { characterName: detectedCharacter },
    });
  }, [router, detectedCharacter]);

  const handlePosterFound = useCallback((characterName: string) => {
    console.log("[ARScreen] Poster found:", characterName);
    setDetectedCharacter(characterName);
  }, []);

  const handlePosterLost = useCallback(() => {
    console.log("[ARScreen] Poster lost, clearing character");
    setDetectedCharacter(null);
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need camera access</Text>
          <Text style={styles.permissionSub}>
            Camera access is required for AR experiences.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Viro AR camera – the ONLY camera user on this screen */}
        <ViroARSceneNavigator
          autofocus
          style={styles.camera}
          initialScene={{
            scene: () => (
              <PosterArScene 
                onPosterFound={handlePosterFound}
                onPosterLost={handlePosterLost}
              />
            ),
          }}
        />

        {/* Chat button - appears when poster detected */}
        {detectedCharacter && (
          <View style={styles.chatButtonContainer} pointerEvents="box-none">
            <TouchableOpacity 
              style={styles.chatButton} 
              activeOpacity={0.8} 
              onPress={handleCharacterTapped}
            >
              <Text style={styles.chatButtonText}>💬 Chat with {detectedCharacter}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Your overlay buttons */}
        <View style={styles.rightButtons} pointerEvents="box-none">
          {detectedCharacter ? (
            <TouchableOpacity 
              style={[styles.btn, styles.chatBtn]} 
              activeOpacity={0.7} 
              onPress={handleCharacterTapped}
            >
              <Text style={styles.chatBtnText}>💬</Text>
              <Text style={[styles.btnText, styles.chatBtnSubText]}>chat</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={() => {}}>
              <Text style={styles.btnText}>soon</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={() => {}}>
            <Text style={styles.btnText}>soon</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={() => {}}>
            <Text style={styles.btnText}>soon</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    width,
    height,
  },
  rightButtons: {
    position: "absolute",
    right: 12,
    top: "30%",
    height: 220,
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    width: 64,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
    paddingHorizontal: 6,
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    textTransform: "lowercase",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  permissionText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
  },
  permissionSub: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  chatButtonContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  chatButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  chatBtn: {
    backgroundColor: "rgba(37, 99, 235, 0.9)",
    borderColor: "rgba(59, 130, 246, 0.5)",
  },
  chatBtnText: {
    fontSize: 20,
    marginBottom: 2,
  },
  chatBtnSubText: {
    fontSize: 10,
    textTransform: "lowercase",
  },
});
