import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import PosterArScene from "../ar/posterArScene";
import { QUEST_STOPS } from "../config/questStops";
import { useGameStore } from "../store/useGameStore";

const { width, height } = Dimensions.get("window");

export default function ARScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const [wrongPosterError, setWrongPosterError] = useState<string | null>(null);
  
  // Game state from Zustand store
  const { 
    currentStepIndex, 
    gamePhase, 
    collectedMascots,
    setGamePhase,
    advanceToNextStep,
    markMascotCollected,
  } = useGameStore();

  // Derived data
  const currentTarget = QUEST_STOPS[currentStepIndex];
  const isGameComplete = gamePhase === "COMPLETED";
  const totalStops = QUEST_STOPS.length;
  const collectedCount = collectedMascots.length;

  // Track if video is done
  const [isVideoComplete, setIsVideoComplete] = useState(false);
  
  // Track if we're viewing a previously collected character
  const [collectedCharacterName, setCollectedCharacterName] = useState<string | null>(null);

  // Reset states when moving to next character
  useEffect(() => {
    setIsVideoComplete(false);
    setCollectedCharacterName(null);
  }, [currentStepIndex]);

  // Handle when the correct poster is scanned
  const handleScanSuccess = useCallback(() => {
    console.log("[ARScreen] Correct poster scanned:", currentTarget.name);
  }, [currentTarget]);

  // Handle when a previously collected character is scanned
  const handleCollectedCharacterScanned = useCallback((scannedId: string, scannedName: string) => {
    console.log("[ARScreen] Previously collected character scanned:", scannedName);
    console.log("[ARScreen] Current collectedCharacterName:", collectedCharacterName);
    console.log("[ARScreen] Current gamePhase:", gamePhase);
    setCollectedCharacterName(scannedName);
    setGamePhase("INTERACTING");
    setIsVideoComplete(true);
    console.log("[ARScreen] Set collectedCharacterName to:", scannedName);
  }, [setGamePhase, collectedCharacterName, gamePhase]);

  const handleVideoFinished = useCallback(() => {
    console.log("[ARScreen] Video finished playing - showing buttons");
    setIsVideoComplete(true);
    setGamePhase("INTERACTING");
  }, [setGamePhase]);

  // Handle when wrong poster is scanned
  const handleScanFailure = useCallback((scannedName: string) => {
    console.log("[ARScreen] Wrong poster scanned:", scannedName, "Expected:", currentTarget.name);
    
    const scannedCharacter = QUEST_STOPS.find(stop => stop.name === scannedName);
    const isCollected = scannedCharacter && collectedMascots.includes(scannedCharacter.id);
    
    if (isCollected) {
      setWrongPosterError(`You already met ${scannedName}! Look for ${currentTarget.name} to continue.`);
    } else {
      setWrongPosterError(`🔒 Unlock previous characters first! Find ${currentTarget.name}.`);
    }
    
    setTimeout(() => {
      setWrongPosterError(null);
    }, 4000);
  }, [currentTarget, collectedMascots]);

  // Handle continuing to next quest step
  const handleContinueQuest = useCallback(() => {
    console.log("[ARScreen] Continuing quest from:", currentTarget.name);
    markMascotCollected(currentTarget.id);
    
    const nextStepIndex = currentStepIndex + 1;
    
    if (nextStepIndex < QUEST_STOPS.length) {
      advanceToNextStep();
    } else {
      setGamePhase("COMPLETED");
    }
  }, [currentStepIndex, currentTarget, markMascotCollected, advanceToNextStep, setGamePhase]);

  // Handle starting chat with character
  const handleStartChat = useCallback(() => {
    console.log("[ARScreen] Starting chat with:", currentTarget.name);
    router.push({
      pathname: "/chat" as any,
      params: {
        characterName: currentTarget.name,
        characterId: currentTarget.id, // NEW
      },
    });
  }, [currentTarget, router]);

  // Handle going back to finding the current target
  const handleBackToQuest = useCallback(() => {
    console.log("[ARScreen] Going back to quest");
    setCollectedCharacterName(null);
    setIsVideoComplete(false); // Reset video state too
    setGamePhase("FINDING");
  }, [setGamePhase]);

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

  if (isGameComplete) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.completionContainer}>
            <Text style={styles.completionTitle}>🎉 Quest Complete! 🎉</Text>
            <Text style={styles.completionText}>
              You collected all {totalStops} mascots!
            </Text>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => router.push("/chat" as any)}
            >
              <Text style={styles.chatButtonText}>Visit Chat Screen</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Viro AR camera */}
        <ViroARSceneNavigator
          autofocus
          style={styles.camera}
          key={`ar-scene-${currentStepIndex}`}
          initialScene={{
            scene: () => (
              <PosterArScene 
                currentTarget={currentTarget}
                gamePhase={gamePhase}
                collectedMascots={collectedMascots}
                onScanSuccess={handleScanSuccess}
                onVideoFinished={handleVideoFinished}
                onCollectedCharacterScanned={handleCollectedCharacterScanned}
                onScanFailure={handleScanFailure}
              />
            ),
          }}
        />

        {/* Status box - top center */}
        <View style={styles.statusBox}>
          {gamePhase === "FINDING" && (
            <>
              <Text style={styles.statusTitle}>Finding {currentTarget.name}...</Text>
              <Text style={styles.statusSub}>Look for the poster with your camera</Text>
            </>
          )}
          {gamePhase === "INTERACTING" && !isVideoComplete && (
            <>
              <Text style={styles.statusTitle}>Watch the video...</Text>
              <Text style={styles.statusSub}>{currentTarget.name} has something to say!</Text>
            </>
          )}
          {gamePhase === "INTERACTING" && isVideoComplete && !collectedCharacterName && (
            <>
              <Text style={styles.statusTitle}>You found {currentTarget.name}!</Text>
              <Text style={styles.statusSub}>Talk to them or continue your quest</Text>
            </>
          )}
          {gamePhase === "INTERACTING" && collectedCharacterName && (
            <>
              <Text style={styles.statusTitle}>You found {collectedCharacterName}!</Text>
              <Text style={styles.statusSub}>Chat with them again</Text>
            </>
          )}
        </View>

        {/* Progress indicator - top right */}
        <View style={styles.progressBox}>
          <Text style={styles.progressText}>
            {collectedCount} / {totalStops}
          </Text>
        </View>

        {/* Wrong poster error message */}
        {wrongPosterError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{wrongPosterError}</Text>
          </View>
        )}

        {/* Action buttons for NEW character - both Talk and Continue */}
        {gamePhase === "INTERACTING" && isVideoComplete && !collectedCharacterName && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.chatActionButton]}
              onPress={handleStartChat}
            >
              <Text style={styles.actionButtonText}>💬 Talk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.continueActionButton]}
              onPress={handleContinueQuest}
            >
              <Text style={styles.actionButtonText}>
                {currentStepIndex < totalStops - 1 ? "→ Continue Quest" : "✓ Complete Quest"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Single Chat button for COLLECTED character */}
        {gamePhase === "INTERACTING" && collectedCharacterName && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.chatActionButton]}
              onPress={() => {
                router.push({
                  pathname: "/chat" as any,
                  params: { characterName: collectedCharacterName },
                });
              }}
            >
              <Text style={styles.actionButtonText}>💬 Chat with {collectedCharacterName}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.continueActionButton]}
              onPress={handleBackToQuest}
            >
              <Text style={styles.actionButtonText}>← Back to Quest</Text>
            </TouchableOpacity>
          </View>
        )}
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
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0f172a",
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
  completionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0f172a",
  },
  completionTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  completionText: {
    color: "#ccc",
    fontSize: 18,
    marginBottom: 32,
    textAlign: "center",
  },
  chatButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  statusBox: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 80,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(59, 130, 246, 0.5)",
  },
  statusTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  statusSub: {
    color: "#94a3b8",
    fontSize: 13,
  },
  progressBox: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(34, 197, 94, 0.5)",
  },
  progressText: {
    color: "#22c55e",
    fontSize: 16,
    fontWeight: "700",
  },
  errorBox: {
    position: "absolute",
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: "rgba(239, 68, 68, 0.95)",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(220, 38, 38, 0.8)",
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  actionsContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatActionButton: {
    backgroundColor: "#8b5cf6",
  },
  continueActionButton: {
    backgroundColor: "#2563eb",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});